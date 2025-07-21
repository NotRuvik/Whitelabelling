const Donation = require('../models/donation.model');
const mongoose = require('mongoose');
const Missionary = require('../models/missionary.model');
const Cause = require('../models/cause.model');

const listDonors = async (user, queryParams) => {
    const { page = 1, limit = 10, search, minContribution, maxContribution, donationType, causeId } = queryParams;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const pipeline = [];

    // --- 1. Initial Match Stage (Pre-Aggregation) ---
    const initialMatch = {
        organizationId: new mongoose.Types.ObjectId(user.organizationId),
        isAnonymous: false,
        status: 'succeeded'
    };

    if (user.role === 'missionary') {
        const missionary = await Missionary.findOne({ userId: user._id }).lean();
        if (!missionary) {
            return { data: [], pagination: { currentPage: 1, totalPages: 0, totalDonors: 0 } };
        }
        const missionaryCauseIds = await Cause.find({ missionaryId: missionary._id })
            .select('_id')
            .lean()
            .then(causes => causes.map(c => c._id));
        
        initialMatch.$or = [
            { targetType: 'Missionary', targetId: missionary._id },
            { targetType: 'Cause', targetId: { $in: missionaryCauseIds } }
        ];
    } else if (user.role === 'npo_admin' && queryParams.causeId) {
        initialMatch.targetId = new mongoose.Types.ObjectId(queryParams.causeId);
        initialMatch.targetType = 'Cause';
    }

    if (donationType) {
        initialMatch.donationType = donationType;
    }

    pipeline.push({ $match: initialMatch });

    // --- 2. Grouping Stage ---
    // This stage aggregates data per donor.
    pipeline.push({
        $group: {
            _id: "$donorId",
            totalContribution: { $sum: "$amount" },
            numDonations: { $sum: 1 },
            lastDonationDate: { $max: "$createdAt" },
            donationTypes: { $addToSet: "$donationType" }
        }
    });

    // --- 3. Post-Group Match for Contribution Filters ---
    const postGroupMatch = {};
    if (minContribution || maxContribution) {
        postGroupMatch.totalContribution = {};
        if (minContribution) postGroupMatch.totalContribution.$gte = parseFloat(minContribution);
        if (maxContribution) postGroupMatch.totalContribution.$lte = parseFloat(maxContribution);
        pipeline.push({ $match: postGroupMatch });
    }

    // --- 4. Lookup and Project Donor Details ---
    pipeline.push(
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'donorDetails' } },
        { $unwind: { path: '$donorDetails', preserveNullAndEmptyArrays: true } },
        { $match: { donorDetails: { $ne: null } } }, // Ensure we only get donors who are users
        {
            $project: {
                _id: 0,
                donorId: '$_id',
                name: { $concat: ['$donorDetails.firstName', ' ', '$donorDetails.lastName'] },
                email: '$donorDetails.email',
                totalContribution: 1,
                numDonations: 1,
                lastDonationDate: 1,
                donationTypes: 1
            }
        }
    );

    // --- 5.  New Search Stage (Post-Aggregation and Projection) ---
    if (search) {
        const searchConditions = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];

        const numericSearchValue = Number(search);
        if (!isNaN(numericSearchValue) && isFinite(search)) {
            // If the search term is a number, check numeric fields.
            searchConditions.push({ totalContribution: numericSearchValue });
            searchConditions.push({ numDonations: numericSearchValue });
        }

        pipeline.push({ $match: { $or: searchConditions } });
    }

    // --- 6. Pagination and Final Execution ---
    const countPipeline = [...pipeline, { $count: 'total' }];

    // Add sorting and pagination to the main data pipeline
    pipeline.push({ $sort: { lastDonationDate: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limitNum });

    const [donors, countResult] = await Promise.all([
        Donation.aggregate(pipeline),
        Donation.aggregate(countPipeline)
    ]);

    const totalDonors = countResult[0]?.total || 0;

    return {
        data: donors,
        pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(totalDonors / limitNum),
            totalDonors,
        },
    };
};



module.exports = { listDonors };