const express = require('express');
const donorController = require('../controllers/donor.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', protect, authorize('npo_admin', 'missionary'), donorController.listDonors);

module.exports = router;