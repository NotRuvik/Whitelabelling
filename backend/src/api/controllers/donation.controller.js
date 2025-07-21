const donationService = require('../services/donation.service');
const ApiResponse = require("../utils/apiResponse");
const User = require("../models/user.model");
const Missionary = require("../models/missionary.model");
const Organization = require("../models/organization.model");
const createCheckoutSession = async (req, res, next) => {
    try {
        const session = await donationService.createOneTimeDonationSession(req.body);
        res.status(200).json({ id: session.id });
    } catch (error) {
        next(error); // Pass error to your global handler
    }
};
const getMissionaryFundraisingReport = async (req, res, next) => {
    try {
        const report = await donationService.generateFundraisingReportForMissionary(req.user);
        res.status(200).json(new ApiResponse(200, report, "Report fetched successfully."));
    } catch (error) {
        next(error);
    }
};
const createSubscription = async (req, res, next) => {
    try {
        const result = await donationService.createSubscription(req.body);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

const getDonationOverview = async (req, res, next) => {
  try {
    const [stats, donations] = await Promise.all([
      donationService.calculateDonationStats(req.user, req.query.period),
      donationService.listDonationsOverview(req.user, req.query.period)
    ]);

    res.status(200).json(new ApiResponse(200, { stats, donations }));
  } catch (error) {
    next(error);
  }
};

// const getCommissions = async (req, res, next) => {
//     try {
//         const { missionaryId } = req.query;

//         if (!missionaryId) {
//             throw new ApiError(400, "Missionary ID is required.");
//         }

//         // 1. Fetch the super_admin's commission
//         const superAdmin = await User.findOne({ role: 'super_admin' });
//         if (!superAdmin) {
//             throw new ApiError(404, "Super admin configuration not found.");
//         }
//         const superAdminCommission = superAdmin.commission || 0;

//         // 2. Fetch the missionary document and populate their user details
//         const missionary = await Missionary.findById(missionaryId).populate('userId');
//         if (!missionary) {
//             throw new ApiError(404, "Missionary not found.");
//         }

//         // 3. Get the missionary's personal commission from their populated user document
//         const missionaryCommission = missionary.userId ? (missionary.userId.commission || 0) : 0;

//         // 4. Find the npo_admin for the missionary's organization
//         const npoAdmin = await User.findOne({
//             organizationId: missionary.organizationId,
//             role: 'npo_admin'
//         });
//         const npoCommission = npoAdmin ? (npoAdmin.commission || 0) : 0;

//         res.status(200).json(new ApiResponse(200, {
//             superAdminCommission,
//             npoCommission,
//             missionaryCommission, 
//         }, "Commissions fetched successfully."));

//     } catch (error) {
//         next(error);
//     }
// };
const getCommissions = async (req, res, next) => {
  try {
    const { missionaryId } = req.query;

    if (!missionaryId) {
      throw new ApiError(400, "Missionary ID is required.");
    }

    // 1. Fetch the super_admin's commission
    const superAdmin = await User.findOne({ role: 'super_admin' });
    if (!superAdmin) {
      throw new ApiError(404, "Super admin configuration not found.");
    }
    const superAdminCommission = superAdmin.commission || 0;

    // 2. Fetch the missionary document and populate their user details
    const missionary = await Missionary.findById(missionaryId).populate('userId');
    if (!missionary) {
      throw new ApiError(404, "Missionary not found.");
    }

    const missionaryCommission = missionary.userId ? (missionary.userId.missionaryCommission || 0) : 0;

    // 3. Fetch the organization document and populate its userId
    const organization = await Organization.findById(missionary.organizationId).populate('userId');
    console.log("organizationorganizationorganization",organization)
    if (!organization) {
      throw new ApiError(404, "Organization not found for this missionary.");
    }

    // 4. Get the npo_admin commission from the populated userId
    const npoCommission = organization.userId ? (organization.userId.npoCommission || 0) : 0;

    res.status(200).json(new ApiResponse(200, {
      superAdminCommission,
      npoCommission,
      missionaryCommission,
    }, "Commissions fetched successfully."));

  } catch (error) {
    next(error);
  }
};

const listDonations = async (req, res, next) => {
    try {
        // We pass the logged-in user for tenancy and query for filters
        const result = await donationService.listDonations(req.user, req.query);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

const getMyDonationHistory = async (req, res, next) => {
    try {
        const result = await donationService.listMyDonationsAsDonor(req.user, req.query);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
};

const getDonationReceipt = async (req, res, next) => {
    try {
        const { paymentIntentId } = req.params;
        const receiptUrl = await donationService.getStripeReceiptUrl(paymentIntentId);
        res.status(200).json(new ApiResponse(200, { url: receiptUrl }));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCheckoutSession,
    // getDonationStats,
    getDonationOverview,
    listDonations,
    getMyDonationHistory,
    getDonationReceipt,
    createSubscription,
    getMissionaryFundraisingReport,
    getCommissions
};