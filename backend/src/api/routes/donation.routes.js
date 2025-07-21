const express = require('express');
const donationController = require('../controllers/donation.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/create-checkout-session', donationController.createCheckoutSession);
router.post('/create-subscription', donationController.createSubscription); 
    router.get('/stats', protect, authorize('npo_admin', 'missionary'), donationController.getDonationOverview);
router.get('/', protect, authorize('npo_admin', 'missionary'), donationController.listDonations);
router.get(
    '/my-history',
    protect,
    authorize('donor'), // This route is ONLY for donors
    donationController.getMyDonationHistory
);
router.get(
    '/receipt/:paymentIntentId',
    protect,
    authorize('donor'), // Ensure only the donor can access it
    donationController.getDonationReceipt
);
router.get(
    '/my-fundraising-report', 
    protect, 
    authorize('missionary'), 
    donationController.getMissionaryFundraisingReport
);
router.get('/commissions', donationController.getCommissions);
module.exports = router;