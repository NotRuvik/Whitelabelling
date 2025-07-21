const express = require('express');
const router = express.Router();
const baseController = require('../controllers/base.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// All base routes are protected
router.use(protect);

// Routes for NPO Admins to manage bases
router.route('/')
    .post(authorize('npo_admin'), baseController.createBaseUser)
    .get(authorize('npo_admin'), baseController.getBasesForMyOrg);
router.get('/locations', baseController.getAllBaseLocations);

module.exports = router;