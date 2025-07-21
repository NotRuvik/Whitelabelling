import api from './api';

/**
 * Fetches a paginated and filtered list of aggregated donor data.
 * @param {object} params - The query parameters for filtering (page, minContribution, etc.).
 * @returns {Promise} An axios promise containing the list of donors.
 */
export const listDonors = (params) => {
  return api.get('/donors', { params });
};