// src/routes/stripe.routes.js
const express = require('express');
const { onboardNpo, onboardMissionary, disconnectMissionaryStripeAccount, manageMissionaryStripeAccount, disconnectNpoStripeAccount, manageNpoStripeAccount } = require('../controllers/stripe.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();
router.post('/connect/onboard/missionary',protect, authorize('missionary'),  onboardMissionary);
router.post('/connect/disconnect/missionary', protect, authorize('missionary'), disconnectMissionaryStripeAccount);
router.post('/connect/manage/missionary', protect, authorize('missionary'), manageMissionaryStripeAccount);

router.post('/connect/onboard/:orgId', protect, authorize('npo_admin'), onboardNpo);
router.post('/connect/disconnect/npo', protect, authorize('npo_admin'), disconnectNpoStripeAccount);
router.post('/connect/manage/npo', protect, authorize('npo_admin'), manageNpoStripeAccount);

module.exports = router;