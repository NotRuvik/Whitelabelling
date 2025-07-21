const Plan = require('../models/plan.model');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

const createPlan = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (await Plan.findOne({ name })) {
            throw new ApiError(409, `A plan with the name '${name}' already exists.`);
        }
        const plan = await Plan.create(req.body);
        res.status(201).json(new ApiResponse(201, plan, 'Plan created successfully'));
    } catch (error) {
        next(error);
    }
};

const getActivePlans = async (req, res, next) => {
    try {
        const plans = await Plan.find({ isActive: true });
        res.status(200).json(new ApiResponse(200, plans));
    } catch (error) {
        next(error);
    }
};

const getAllPlans = async (req, res, next) => {
    try {
        const plans = await Plan.find({});
        res.status(200).json(new ApiResponse(200, plans));
    } catch (error) {
        next(error);
    }
};

const getPlanById = async (req, res, next) => {
    try {
        const plan = await Plan.findById(req.params.planId);
        if (!plan || !plan.isActive) {
            throw new ApiError(404, 'Plan not found or is not active.');
        }
        res.status(200).json(new ApiResponse(200, plan));
    } catch (error) {
        next(error);
    }
};

const updatePlan = async (req, res, next) => {
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.planId, req.body, { new: true });
        if (!plan) {
            throw new ApiError(404, 'Plan not found.');
        }
        res.status(200).json(new ApiResponse(200, plan, 'Plan updated successfully.'));
    } catch (error) {
        next(error);
    }
};

const deletePlan = async (req, res, next) => {
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.planId, { isActive: false }, { new: true });
        if (!plan) {
            throw new ApiError(404, 'Plan not found.');
        }
        res.status(200).json(new ApiResponse(200, plan, 'Plan deactivated successfully.'));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPlan,
    getActivePlans,
    getAllPlans,
    getPlanById,
    updatePlan,
    deletePlan,
};