const donorService = require('../services/donor.service');
const ApiResponse = require('../utils/apiResponse');

const listDonors = async (req, res, next) => {
    try {
        const result = await donorService.listDonors(req.user, req.query);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

module.exports = { listDonors };