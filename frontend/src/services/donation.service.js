import api from "./api"; // Import the configured axios instance

/**
 * Fetches donation statistics from the backend.
 * @param {string} period - The time filter (e.g., 'thisMonth', 'lastYear').
 * @returns {Promise} An axios promise containing the stats data.
 */
export const getDonationStats = (period) => {
  // Make a GET request to the /donations/stats endpoint.
  // We pass the period in a `params` object, and axios will
  // automatically format it into a query string like: /donations/stats?period=thisMonth
  return api.get("/donations/stats", {
    params: {
      period,
    },
  });
};

/**
 * Fetches a paginated and filtered list of individual donations.
 * @param {object} params - The query parameters for filtering (page, search, minAmount, etc.).
 * @returns {Promise} An axios promise containing the list of donations.
 */
export const listDonations = (params) => {
  return api.get('/donations', { params });
};
