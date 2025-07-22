const Donation = require('../models/donation.model');
const Missionary = require('../models/missionary.model');
const Cause = require('../models/cause.model');
const mongoose = require('mongoose');
const Organization = require("../models/organization.model");
const User = require("../models/user.model");
const ApiError = require('../utils/apiError');

/**
 * @description Fetches a paginated and filterable list of donations for the logged-in missionary.
 * @param {object} user - The authenticated user object (must have role 'missionary').
 * @param {object} queryParams - Filters from the request query (page, limit, search, sortBy, sortOrder).
 * @returns {Promise<object>} A promise that resolves to the paginated list of donations.
 */
const listMyPayments = async (user, queryParams) => {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = queryParams;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Find the missionary profile linked to the logged-in user
    const missionary = await Missionary.findOne({ userId: user._id }).lean();
    if (!missionary) {
        // If the user is not a missionary or has no profile, they have no payments.
        return { data: [], pagination: { currentPage: 1, totalPages: 0, totalCount: 0 } };
    }

    // Find all causes created by this missionary
    const missionaryCauseIds = await Cause.find({ missionaryId: missionary._id })
        .select('_id')
        .lean()
        .then(causes => causes.map(c => c._id));

    // Base query: find successful donations made to this missionary OR their causes
    const matchStage = {
        status: 'succeeded',
        $or: [
            { targetType: 'Missionary', targetId: missionary._id },
            { targetType: 'Cause', targetId: { $in: missionaryCauseIds } }
        ]
    };

    // Add search filter if provided (searches donor name or email)
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        matchStage.$or.push(
             { donorName: searchRegex },
             { donorEmail: searchRegex }
        );
    }
    
    // Define a valid sort object
    const sortStage = {};
    if (['createdAt', 'amount', 'donorName'].includes(sortBy)) {
        sortStage[sortBy] = sortOrder === 'asc' ? 1 : -1;
    } else {
        sortStage['createdAt'] = -1; // Default sort
    }

    // Aggregation pipeline to fetch and shape the data
    const pipeline = [
        { $match: matchStage },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: limitNum },
        // Look up the target's name (either cause name or missionary name)
        {
            $lookup: {
                from: 'causes',
                localField: 'targetId',
                foreignField: '_id',
                as: 'causeInfo'
            }
        },
        { $unwind: { path: '$causeInfo', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                date: '$createdAt',
                amount: 1,
                donorName: 1,
                status: 1,
                donationType: 1,
                target: {
                    $cond: {
                        if: { $eq: ['$targetType', 'Cause'] },
                        then: '$causeInfo.name',
                        else: 'Direct Donation' // Or you could populate the missionary's name
                    }
                }
            }
        }
    ];

    const payments = await Donation.aggregate(pipeline);
    const totalCount = await Donation.countDocuments(matchStage);

    return {
        data: payments,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalCount,
        },
    };
};

/**
 * @description Fetches a paginated list of ALL donations, with optional filters for admin use.
 * @param {object} queryParams - Filters (page, limit, search, sortBy, sortOrder, missionaryId).
 * @returns {Promise<object>} A promise that resolves to the paginated list of donations.
 */
const listAllPayments = async (queryParams) => {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc', missionaryId, npoId } = queryParams;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const matchStage = { status: 'succeeded' };

    // Filtering logic
    let missionaryObjIds = [];
    let causeIds = [];

    if (npoId && mongoose.Types.ObjectId.isValid(npoId)) {
        // Get all missionaries under this NPO
        missionaryObjIds = await Missionary.find({ organizationId: npoId })
            .select('_id')
            .lean()
            .then(missionaries => missionaries.map(m => m._id));
        // Get all causes under these missionaries
        causeIds = await Cause.find({ missionaryId: { $in: missionaryObjIds } })
            .select('_id')
            .lean()
            .then(causes => causes.map(c => c._id));
    }

    if (missionaryId && mongoose.Types.ObjectId.isValid(missionaryId)) {
        const missionaryObjId = new mongoose.Types.ObjectId(missionaryId);
        // If npoId is also provided, ensure missionary is under that NPO
        if (npoId && missionaryObjIds.length > 0 && !missionaryObjIds.some(id => id.equals(missionaryObjId))) {
            // missionaryId not under selected NPO, return empty
            return {
                data: [],
                pagination: {
                    currentPage: pageNum,
                    totalPages: 0,
                    totalCount: 0,
                },
            };
        }
        // Get all causes for this missionary
        const missionaryCauseIds = await Cause.find({ missionaryId: missionaryObjId })
            .select('_id')
            .lean()
            .then(causes => causes.map(c => c._id));
        matchStage.$or = [
            { targetType: 'Missionary', targetId: missionaryObjId },
            { targetType: 'Cause', targetId: { $in: missionaryCauseIds } }
        ];
    } else if (npoId && missionaryObjIds.length > 0) {
        // Only npoId provided: all missionaries/causes under this NPO
        matchStage.$or = [
            { targetType: 'Missionary', targetId: { $in: missionaryObjIds } },
            { targetType: 'Cause', targetId: { $in: causeIds } }
        ];
    }

    if (search) {
        const searchRegex = new RegExp(search, 'i');
        const searchCondition = { $or: [{ donorName: searchRegex }, { donorEmail: searchRegex }] };
        if (matchStage.$or) {
            matchStage.$and = [matchStage.$or, searchCondition];
            delete matchStage.$or;
        } else {
            matchStage.$or = searchCondition.$or;
        }
    }

    const sortStage = {};
    const validSortFields = ['createdAt', 'amount', 'donorName'];
    sortStage[validSortFields.includes(sortBy) ? sortBy : 'createdAt'] = sortOrder === 'asc' ? 1 : -1;

    const pipeline = [
        { $match: matchStage },
        { $lookup: { from: 'causes', localField: 'targetId', foreignField: '_id', as: 'causeInfo' } },
        { $unwind: { path: '$causeInfo', preserveNullAndEmptyArrays: true } },
        { $addFields: { resolvedMissionaryId: { $cond: { if: { $eq: ['$targetType', 'Missionary'] }, then: '$targetId', else: '$causeInfo.missionaryId' } } } },
        { $lookup: { from: 'missionaries', localField: 'resolvedMissionaryId', foreignField: '_id', as: 'missionaryInfo' } },
        { $unwind: { path: '$missionaryInfo', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'users', localField: 'missionaryInfo.userId', foreignField: '_id', as: 'userInfo' } },
        { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                date: '$createdAt',
                amount: 1,
                donorName: 1,
                status: 1,
                donationType: 1,
                missionaryName: { $ifNull: [{ $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName'] }, 'N/A'] },
                targetName: { $cond: { if: { $eq: ['$targetType', 'Cause'] }, then: '$causeInfo.name', else: 'Direct Donation' } }
            }
        },
        { $sort: sortStage },
        { $skip: skip },
        { $limit: limitNum },
    ];

    const countPipeline = [{ $match: matchStage }, { $count: 'totalCount' }];
    const [payments, countResult] = await Promise.all([
        Donation.aggregate(pipeline),
        Donation.aggregate(countPipeline)
    ]);
    const totalCount = countResult.length > 0 ? countResult[0].totalCount : 0;

    return {
        data: payments,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalCount / limitNum),
            totalCount,
        },
    };
};




module.exports = { listMyPayments, listAllPayments };