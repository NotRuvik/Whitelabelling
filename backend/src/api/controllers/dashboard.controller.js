const mongoose = require('mongoose');
const Organization = require('../models/organization.model');
const Missionary = require('../models/missionary.model');
const Cause = require('../models/cause.model');
const Donation = require('../models/donation.model');
const Notification = require("../models/notification.model");
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

/**
 * @desc      Internal helper to get dashboard statistics for Super Admin.
 * @returns   {Promise<object>} A promise that resolves to the stats object.
 */
const getDashboardStatsInternal = async () => {
    // Define date ranges for calculating growth
    const now = new Date();
    const last30Days = new Date(new Date().setDate(now.getDate() - 30));
    const last60Days = new Date(new Date().setDate(now.getDate() - 60));

    // Fetch all data points concurrently
    const [
        totalNpos,
        totalMissionaries,
        totalCauses,
        newNposLast30Days,
        newMissionariesLast30Days,
        newCausesLast30Days,
        newNposPrevious30Days,
        newMissionariesPrevious30Days,
        newCausesPrevious30Days,
    ] = await Promise.all([
        // Get total counts
        Organization.countDocuments(),
        Missionary.countDocuments(),
        Cause.countDocuments(),
        // Get counts for new entries in the last 30 days
        Organization.countDocuments({ createdAt: { $gte: last30Days } }),
        Missionary.countDocuments({ createdAt: { $gte: last30Days } }),
        Cause.countDocuments({ createdAt: { $gte: last30Days } }),
        // Get counts for new entries in the 30 days before that
        Organization.countDocuments({ createdAt: { $gte: last60Days, $lt: last30Days } }),
        Missionary.countDocuments({ createdAt: { $gte: last60Days, $lt: last30Days } }),
        Cause.countDocuments({ createdAt: { $gte: last60Days, $lt: last30Days } }),
    ]);

    // Calculate the change for each metric
    const npoChange = newNposLast30Days - newNposPrevious30Days;
    const missionaryChange = newMissionariesLast30Days - newMissionariesPrevious30Days;
    const causeChange = newCausesLast30Days - newCausesPrevious30Days;

    // Structure the response payload
    const stats = {
        npos: {
            value: totalNpos,
            change: Math.abs(npoChange),
            isIncrease: npoChange >= 0,
        },
        missionaries: {
            value: totalMissionaries,
            change: Math.abs(missionaryChange),
            isIncrease: missionaryChange >= 0,
        },
        causes: {
            value: totalCauses,
            change: Math.abs(causeChange),
            isIncrease: causeChange >= 0,
        },
    };

    return stats;
};

/**
 * @desc      Internal helper to get time-series data for growth charts.
 * @param     {string} metric - The metric to analyze ('npos' or 'subscriptions').
 * @returns   {Promise<object>} A promise that resolves to the chart data object.
 */
const getGrowthChartDataInternal = async (metric) => {
    let filter = {};
    if (metric === 'npos') {
        // No additional filter needed
    } else if (metric === 'subscriptions') {
        filter.subscriptionStatus = 'active';
    } else {
        // In a real app, you might throw an error, but for this internal function, we proceed cautiously.
        return null;
    }

    const now = new Date();
    const last12Months = new Date(new Date().setMonth(now.getMonth() - 12));
    const last30Days = new Date(new Date().setDate(now.getDate() - 30));
    const last60Days = new Date(new Date().setDate(now.getDate() - 60));

    const [
        totalCount,
        newLast30Days,
        newPrevious30Days,
        monthlyData
    ] = await Promise.all([
        Organization.countDocuments(filter),
        Organization.countDocuments({ ...filter, createdAt: { $gte: last30Days } }),
        Organization.countDocuments({ ...filter, createdAt: { $gte: last60Days, $lt: last30Days } }),
        Organization.aggregate([
            { $match: { ...filter, createdAt: { $gte: last12Months } } },
            { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            {
                $project: {
                    _id: 0,
                    name: {
                        $let: {
                            vars: { months: ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
                            in: { $arrayElemAt: ["$$months", "$_id.month"] }
                        }
                    },
                    count: 1
                }
            }
        ])
    ]);

    const change = newLast30Days - newPrevious30Days;

    const responsePayload = {
        value: totalCount,
        change: Math.abs(change),
        isIncrease: change >= 0,
        chartData: monthlyData.map(item => ({ name: item.name, uv: item.count })),
    };

    return responsePayload;
};



const getSuperAdminDashboardData = async () => {
    const [statsRes, npoRes, subsRes, activityFeed] = await Promise.all([
        getDashboardStatsInternal(),
        getGrowthChartDataInternal('npos'),
        getGrowthChartDataInternal('subscriptions'),
        Notification.find({ recipientRole: 'super_admin'  })
            .sort({ createdAt: -1 })
            .limit(5)
    ]);
    return {
        role: 'super_admin',
        stats: statsRes,
        npoGrowth: npoRes,
        subscriptionGrowth: subsRes,
        activityFeed: activityFeed.map(act => ({
            message: act.message,
            time: act.createdAt
        }))
    };
};

const getNpoAdminDashboardData = async (user) => {
    const { organizationId } = user;
    const orgObjectId = new mongoose.Types.ObjectId(organizationId);

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthEnd = currentMonthStart;

    const [
        totalMissionaries,
        totalCauses,
        donationStats,
        donationChartData,
        recentDonations,
        recentActivity,
    ] = await Promise.all([
        Missionary.countDocuments({ organizationId: orgObjectId }),
        Cause.countDocuments({ organizationId: orgObjectId }),
        Donation.aggregate([ 
            { $match: { organizationId: orgObjectId, status: 'succeeded' } },
            {
                $facet: {
                    currentMonth: [
                        { $match: { createdAt: { $gte: currentMonthStart } } },
                        { $group: { _id: null, totalRevenue: { $sum: '$amount' }, uniqueDonors: { $addToSet: '$donorId' } } },
                        { $project: { _id: 0, totalRevenue: 1, donorCount: { $size: '$uniqueDonors' } } }
                    ],
                    previousMonth: [
                        { $match: { createdAt: { $gte: previousMonthStart, $lt: previousMonthEnd } } },
                        { $group: { _id: null, totalRevenue: { $sum: '$amount' }, uniqueDonors: { $addToSet: '$donorId' } } },
                        { $project: { _id: 0, totalRevenue: 1, donorCount: { $size: '$uniqueDonors' } } }
                    ]
                }
            }
        ]),
        getDonationChartDataForNpo(orgObjectId), 
        getRecentDonationsForNpo(orgObjectId),
        Notification.find({ organizationId: orgObjectId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('recipientUserId', 'firstName lastName')
    ]);
    
    const currentMonthStats = donationStats[0]?.currentMonth[0] || { totalRevenue: 0, donorCount: 0 };
    const previousMonthStats = donationStats[0]?.previousMonth[0] || { totalRevenue: 0, donorCount: 0 };

    const revenueChange = currentMonthStats.totalRevenue - previousMonthStats.totalRevenue;
    const donorChange = currentMonthStats.donorCount - previousMonthStats.donorCount;

    const formattedActivity = recentActivity.map(act => ({
        name: act.recipientUserId ? `${act.recipientUserId.firstName} ${act.recipientUserId.lastName}` : 'System',
        message: act.message,
        time: act.createdAt
    }));

    return {
        role: 'npo_admin',
        stats: {
            missionaries: { value: totalMissionaries, change: 0, isIncrease: true },
            causes: { value: totalCauses, change: 0, isIncrease: true },
            monthlyRevenue: {
                value: currentMonthStats.totalRevenue,
                change: Math.abs(revenueChange),
                isIncrease: revenueChange >= 0,
            },
            monthlyDonors: {
                value: currentMonthStats.donorCount,
                change: Math.abs(donorChange),
                isIncrease: donorChange >= 0,
            }
        },
        donationChartData, 
        recentDonations,
        activityFeed: formattedActivity,
    };
};

/**
 * @desc      Internal helper to get the 5 most recent donations for the NPO dashboard feed.
 * @param     {object} orgObjectId - The Mongoose ObjectId of the organization.
 * @returns   {Promise<Array>} A promise that resolves to an array of recent donation objects.
 */
const getRecentDonationsForNpo = async (orgObjectId) => {
    try {
        const donations = await Donation.aggregate([
            // 1. Match successful donations for the specific NPO
            { $match: { organizationId: orgObjectId, status: 'succeeded' } },
            // 2. Sort by most recent and limit to 5
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            // 3. Lookup donor's name from the 'users' collection
            { $lookup: { from: 'users', localField: 'donorId', foreignField: '_id', as: 'donorInfo' } },
            { $unwind: { path: '$donorInfo', preserveNullAndEmptyArrays: true } },
            // 4. Lookup target's name (whether it's a Cause or a Missionary)
            { $lookup: { from: 'causes', localField: 'targetId', foreignField: '_id', as: 'causeInfo' } },
            { $lookup: { from: 'missionaries', localField: 'targetId', foreignField: '_id', as: 'missionaryInfo' } },
            { $unwind: { path: '$causeInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$missionaryInfo', preserveNullAndEmptyArrays: true } },
            // If the target is a missionary, we need their user document for the name
            { $lookup: { from: 'users', localField: 'missionaryInfo.userId', foreignField: '_id', as: 'missionaryUser' } },
            { $unwind: { path: '$missionaryUser', preserveNullAndEmptyArrays: true } },
            // 5. Project the final, clean shape for the activity feed
            {
                $project: {
                    _id: 0,
                    amount: 1,
                    date: '$createdAt',
                    // Use the donor's name from the donation record, or 'Anonymous'
                    donorName: {
                        $cond: {
                            if: '$isAnonymous',
                            then: 'Anonymous Donor',
                            else: { $concat: ['$donorInfo.firstName', ' ', '$donorInfo.lastName'] }
                        }
                    },
                    // Determine the target's name based on its type
                    targetName: {
                        $cond: {
                            if: { $eq: ['$targetType', 'Cause'] },
                            then: '$causeInfo.name',
                            else: { $concat: ['$missionaryUser.firstName', ' ', '$missionaryUser.lastName'] }
                        }
                    }
                }
            }
        ]);
        return donations;
    } catch (error) {
        console.error("Error fetching recent donations for NPO dashboard:", error);
        return [];
    }
};

/**
 * @desc      Internal helper to get detailed, time-series donation data for NPO charts.
 * @param     {object} orgObjectId - The Mongoose ObjectId of the organization.
 * @returns   {Promise<Array>} A promise that resolves to an array of individual donation objects.
 */
const getDonationChartDataForNpo = async (orgObjectId) => {
    const now = new Date();
    const last30Days = new Date(new Date().setDate(now.getDate() - 30));

    try {
        const donations = await Donation.aggregate([
            // 1. Match successful donations for the NPO in the last 30 days
            {
                $match: {
                    organizationId: orgObjectId,
                    status: 'succeeded',
                    createdAt: { $gte: last30Days }
                }
            },
            // 2. Sort by date to make the chart chronological
            { $sort: { createdAt: 1 } },
            // 3. Lookups to get the target's name
            { $lookup: { from: 'causes', localField: 'targetId', foreignField: '_id', as: 'causeInfo' } },
            { $lookup: { from: 'missionaries', localField: 'targetId', foreignField: '_id', as: 'missionaryInfo' } },
            { $unwind: { path: '$causeInfo', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$missionaryInfo', preserveNullAndEmptyArrays: true } },
            // Lookup the missionary's user details to get their name
            { $lookup: { from: 'users', localField: 'missionaryInfo.userId', foreignField: '_id', as: 'missionaryUser' } },
            { $unwind: { path: '$missionaryUser', preserveNullAndEmptyArrays: true } },
            // 4. Project the final shape with all necessary details for the tooltip
            {
                $project: {
                    _id: 0,
                    date: '$createdAt',
                    amount: '$amount',
                    targetName: {
                        $cond: {
                            if: { $eq: ['$targetType', 'Cause'] },
                            then: '$causeInfo.name',
                            else: { $concat: ['$missionaryUser.firstName', ' ', '$missionaryUser.lastName'] }
                        }
                    }
                }
            }
        ]);
        return donations;
    } catch (error) {
        console.error("Error generating detailed donation chart data:", error);
        return []; // Return an empty array on error to prevent frontend crashes
    }
};

const getDonorDashboardData = async (user) => {
    const donorId = new mongoose.Types.ObjectId(user._id);

    const [donationStats, recentDonations] = await Promise.all([
        Donation.aggregate([
            { $match: { donorId: donorId, status: 'succeeded' } },
            { $group: { _id: null, totalDonated: { $sum: "$amount" }, donationCount: { $sum: 1 } } }
        ]),
        Donation.find({ donorId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('targetId', 'name')
    ]);

    const stats = donationStats[0] || { totalDonated: 0, donationCount: 0 };

    return {
        role: 'donor',
        stats: {
            totalDonated: { value: stats.totalDonated, change: 0, isIncrease: true },
            donationCount: { value: stats.donationCount, change: 0, isIncrease: true },
        },
        recentDonations: recentDonations.map(d => ({
            id: d._id,
            amount: d.amount,
            date: d.createdAt,
            recipient: d.targetId?.name || 'General Donation',
            type: d.donationType
        })),
    };
};

/**
 * @desc      Main dashboard data dispatcher based on user role.
 * @route     GET /api/v1/dashboard
 * @access    Private (super_admin, npo_admin, donor)
 */
const getRoleBasedDashboard = async (req, res, next) => {
    try {
        const { role } = req.user;
        let dashboardData;

        switch (role) {
            case 'super_admin':
                dashboardData = await getSuperAdminDashboardData();
                break;
            case 'npo_admin':
                dashboardData = await getNpoAdminDashboardData(req.user);
                break;
            case 'donor':
                dashboardData = await getDonorDashboardData(req.user);
                break;
            default:
                throw new ApiError(403, "You do not have a dashboard view for your role.");
        }

        res.status(200).json(new ApiResponse(200, dashboardData, "Dashboard data fetched successfully."));

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRoleBasedDashboard,
};