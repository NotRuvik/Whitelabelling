import axios from "axios";
import api from "./api";
const API_URL = "/causes";

const getAuthToken = () => localStorage.getItem("authToken");

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Fetches all publicly listed causes. No auth required.
 * @param {object} params - Object for query params (search, ministryType, isCompleted, page, etc.)
 */
export const getPublicCauses = (params) => {
  return api.get("/causes/public", { params });
};
/**
 * Fetches a public cause by its ID (no auth required).
 * @param {string} causeId
 * @returns {Promise} Axios response promise
 */
export const getPublicCauseById = (causeId) => {
  return apiClient.get(`/causes/public/${causeId}`);
};

/**
 * Fetches a list of all causes for the current organization.
 * Used for the "List of Causes" tab.
 * @returns {Promise} Axios response promise
 */
export const getCauses = () => {
  return apiClient.get(API_URL);
};

/**
 * Creates a new cause by sending text data and files.
 * This function is special because it handles multipart/form-data.
 * @param {FormData} formData - The FormData object containing all form fields and files.
 * @returns {Promise} Axios response promise
 */
export const addCause = (formData) => {
  return apiClient.post(API_URL, formData, {
    headers: {
      // This header is essential for file uploads
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Updates an existing cause.
 * @param {string} causeId - The ID of the cause to update.
 * @param {FormData} formData - The form data containing updates and possibly files.
 * @returns {Promise} An axios promise with the updated cause data.
 */
export const updateCause = (causeId, formData) => {
  return api.patch(`/causes/${causeId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
/**
 * Fetches a single cause by its ID.
 * @param {string} causeId
 * @returns {Promise} Axios response promise
 */
export const getCauseById = (causeId) => {
  return apiClient.get(`${API_URL}/${causeId}`);
};

/**
 * Deletes a cause by its ID.
 * @param {string} causeId
 * @returns {Promise} Axios response promise
 */
export const deleteCause = (causeId) => {
  return apiClient.delete(`${API_URL}/${causeId}`);
};

/**
 * Fetches all causes for the logged-in user's organization.
 * This is used to populate the "Filter by Cause" dropdown.
 * @returns {Promise} An axios promise containing the list of causes.
 */
export const getCausesForMyOrg = () => {
  // Assuming your endpoint to get causes for the dashboard is just '/causes'
  return api.get("/causes");
};
