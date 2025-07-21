const reportService = require('../services/report.service');
const ApiResponse = require('../utils/apiResponse');

const submitReport = async (req, res, next) => {
  try {
    const newReport = await reportService.submitReport(req.body);
    res.status(201).json(new ApiResponse(201, newReport, 'Report submitted successfully.'));
  } catch (error) {
    next(error);
  }
};

// // --- ADMIN ACTIONS (MOVED FROM admin.controller.js) ---
// const getAbuseReports = async (req, res, next) => {
//   try {
//     const reports = await reportService.getAllReports();
//     res.status(200).json(new ApiResponse(200, reports));
//   } catch (error) {
//     next(error);
//   }
// };
const getAbuseReports = async (req, res, next) => {
  try {
    // Extract query parameters for pagination, sorting, and searching
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc', 
      search = '' 
    } = req.query;

    const options = { page, limit, sortBy, sortOrder, search };
    
    // Call the service with the extracted options
    const { data, totalCount } = await reportService.getAllReports(options);

    const response = {
      data,
      pagination: {
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page, 10),
        itemsPerPage: parseInt(limit, 10),
      },
    };
    
    res.status(200).json(new ApiResponse(200, response, "Reports fetched successfully"));
  } catch (error) {
    next(error);
  }
};
const resolveReportByBlocking = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { adminNotes } = req.body;
    const result = await reportService.resolveReportAndBlockUser(reportId, adminNotes);
    res.status(200).json(new ApiResponse(200, result));
  } catch (error) {
    next(error);
  }
};

const resolveCauseReportByBlocking = async (req, res, next) => {
    try {
        const { reportId } = req.params;
        const { adminNotes } = req.body;
        const result = await reportService.resolveCauseReportAndBlockMissionary(reportId, adminNotes);
        res.status(200).json(new ApiResponse(200, result));
    } catch (error) {
        next(error);
    }
}

const resolveReportByDismissing = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { adminNotes } = req.body;
    const result = await reportService.resolveReportAndDismiss(reportId, adminNotes);
    res.status(200).json(new ApiResponse(200, result));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitReport,
  getAbuseReports,
  resolveReportByBlocking,
  resolveCauseReportByBlocking,
  resolveReportByDismissing,
};