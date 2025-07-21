const express = require('express');
const { handleStripeWebhook } = require('../controllers/webhook.controller.js');

const router = express.Router();

// Stripe requires the raw body for signature verification, so we use express.raw
router.post('/', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;