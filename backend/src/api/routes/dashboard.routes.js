// const express = require('express');
// const router = express.Router();
// const dashboardController = require('../controllers/dashboard.controller');
// const { protect, authorize } = require('../middlewares/auth.middleware');

// // Apply protection and authorization middleware for all routes in this file.
// // Only users with the 'super_admin' role will be able to proceed.
// router.use(protect, authorize('super_admin'));

// /**
//  * @route   GET /api/v1/dashboard/stats
//  * @desc    Retrieves aggregate counts for the main dashboard.
//  * @access  Private (Super Admin)
//  */
// router.get('/stats', dashboardController.getDashboardStats);

// router.get('/growth-chart', dashboardController.getGrowthChartData);

// module.exports = router;
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

/**
 * @route   GET /api/v1/dashboard
 * @desc    Retrieves dashboard data based on the authenticated user's role.
 * @access  Private (super_admin, npo_admin, donor)
 */
router.get('/', protect, authorize('super_admin', 'npo_admin', 'donor'), dashboardController.getRoleBasedDashboard);

// The old routes can be removed or kept for internal use if needed,
// but the new endpoint is designed to replace them for the frontend.
// router.get('/stats', protect, authorize('super_admin'), dashboardController.getDashboardStats);
// router.get('/growth-chart', protect, authorize('super_admin'), dashboardController.getGrowthChartData);

module.exports = router;