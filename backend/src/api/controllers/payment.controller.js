const paymentService = require('../services/payment.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * @description Controller to get the logged-in user's payment history.
 */
const getMyPaymentHistory = async (req, res, next) => {
    try {
        // The service function handles all logic based on the logged-in user and query params
        const result = await paymentService.listMyPayments(req.user, req.query);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

const getAdminPaymentHistory = async (req, res, next) => {
    try {
         const result = await paymentService.listAllPayments(req.query, req.user);
        res.status(200).json(new ApiResponse(200, result, "Admin payment history fetched successfully."));
    } catch (error) {
        next(error);
    }
};

module.exports = { getMyPaymentHistory, getAdminPaymentHistory };