import api from './api';

const API_URL = '/reports'; // Base URL for all report-related actions

// --- PUBLIC ACTION ---

/**
 * Submits an abuse report to the backend.
 * @param {object} reportData - The complete report payload from the modal.
 * @returns {Promise<object>} The server's response.
 */
export const submitAbuseReport = (reportData) => {
  // Corresponds to: POST /reports/
  return api.post(`${API_URL}/`, reportData);
};


// --- ADMIN ACTIONS ---

/**
 * Fetches abuse reports from the API with pagination, sorting, and search capabilities.
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of items per page.
 * @param {string} sortBy - The field to sort by.
 * @param {string} sortOrder - The sort direction ('asc' or 'desc').
 * @param {string} search - The search term.
 * @returns {Promise} - The promise from the API call.
 */
export const getAbuseReports = (page, limit, sortBy, sortOrder, search) => {
  
  const params = new URLSearchParams({
    page,
    limit,
    sortBy,
    sortOrder,
  });

  if (search) {
    params.append('search', search);
  }

  return api.get(`${API_URL}/all?${params.toString()}`);
};

/**
 * Resolves a report by blocking the associated user.
 * @param {string} reportId - The ID of the abuse report to resolve.
 * @param {string} adminNotes - Notes from the super admin.
 * @returns {Promise<object>} The server's response.
 */
export const resolveReportBlock = (reportId, adminNotes) => {
  // Corresponds to: PATCH /reports/:reportId/block
  return api.patch(`${API_URL}/${reportId}/block`, { adminNotes });
};

/**
 * Resolves a cause report by blocking the associated missionary.
 * @param {string} reportId - The ID of the abuse report to resolve.
 * @param {string} adminNotes - Notes from the super admin.
 * @returns {Promise<object>} The server's response.
 */
export const resolveCauseReportBlockMissionary = (reportId, adminNotes) => {
  // Corresponds to: PATCH /reports/:reportId/block-for-cause
  return api.patch(`${API_URL}/${reportId}/block-for-cause`, { adminNotes });
}

/**
 * Resolves a report by dismissing it.
 * @param {string} reportId - The ID of the abuse report to resolve.
 * @param {string} adminNotes - Notes from the super admin.
 * @returns {Promise<object>} The server's response.
 */
export const resolveReportDismiss = (reportId, adminNotes) => {
  // Corresponds to: PATCH /reports/:reportId/dismiss
  return api.patch(`${API_URL}/${reportId}/dismiss`, { adminNotes });
};
