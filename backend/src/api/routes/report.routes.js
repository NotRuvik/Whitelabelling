const express = require("express");
const router = express.Router();
const reportController = require("../controllers/report.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// --- PUBLIC ROUTE ---
// Anyone can submit a report.
router.post("/", reportController.submitReport);

// --- ADMIN ROUTES ---
// These routes are for super admins to manage the reports.
router.get(
  "/all", // Changed route to avoid conflict, e.g., /api/v1/reports/all
  protect,
  authorize("super_admin"),
  reportController.getAbuseReports
);

router.patch(
  "/:reportId/block",
  protect,
  authorize("super_admin"),
  reportController.resolveReportByBlocking
);

router.patch(
  "/:reportId/block-for-cause",
  protect,
  authorize("super_admin"),
  reportController.resolveCauseReportByBlocking
);

router.patch(
  "/:reportId/dismiss",
  protect,
  authorize("super_admin"),
  reportController.resolveReportByDismissing
);

module.exports = router;
