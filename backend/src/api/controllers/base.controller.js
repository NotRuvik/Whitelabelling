const User = require('../models/user.model');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const baseService = require('../services/base.service');

const createBaseUser = async (req, res, next) => {
    try {
        // The service now handles all the logic
        // Pass tenant context to the service
        const newBaseUser = await baseService.registerNewBaseUser(req.body, req.user, req.tenant);
        res.status(201).json(new ApiResponse(201, newBaseUser, 'Base user created successfully.'));
    } catch (error) {
        next(error);
    }
};

// NPO Admin gets a list of all their Base Users
// const getBasesForMyOrg = async (req, res, next) => {
//     try {
//         const { organizationId } = req.user;
//         const bases = await User.find({ organizationId, role: 'base_user' }).sort({ createdAt: -1 });
//         res.status(200).json(new ApiResponse(200, bases));
//     } catch (error) {
//         next(error);
//     }
// };

const getBasesForMyOrg = async (req, res, next) => {
    try {
        // Use tenant context for organizationId
        const organizationId = req.tenant?._id;
        if (!organizationId) {
            throw new ApiError(400, 'No organization context found.');
        }
        const { page = 1, limit = 10, search = '' } = req.query; 

        const basesData = await baseService.getAllBasesForOrg({
            organizationId,
            page: Number(page),
            limit: Number(limit),
            search,
        });

        res.status(200).json(
            new ApiResponse(
                200,
                {
                    data: basesData.data,
                    pagination: {
                        currentPage: basesData.page,
                        totalPages: basesData.totalPages,
                        totalBases: basesData.total,
                        limit: basesData.limit,
                    },
                },
                "Bases fetched successfully."
            )
        );
    } catch (error) {
        next(error);
    }
};

const getAllBaseLocations = async (req, res, next) => {
    try {
        // Find all unique, non-null location values from users with the 'base_user' role
        const locations = await User.distinct('location', { 
            role: 'base_user', 
            location: { $ne: null, $ne: '' } 
        });
        res.status(200).json(new ApiResponse(200, locations.sort()));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBaseUser,
    getBasesForMyOrg,
    getAllBaseLocations
};