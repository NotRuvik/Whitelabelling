const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// This route is protected and only accessible by missionaries
router.get(
    '/my-history',
    protect,
    authorize('missionary', 'super_admin'), // Ensures only missionaries can access this
    paymentController.getMyPaymentHistory
);
router.get(
    '/admin-view',
    protect,
    authorize('npo_admin', 'super_admin'), // Ensures only super_admins can access
    paymentController.getAdminPaymentHistory
);

module.exports = router;