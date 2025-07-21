import axios from 'axios';
import api from './api';
const API_URL = '/bases';
const getAuthToken = () => localStorage.getItem('authToken'); // Make sure 'authToken' is the key you use

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
/**
 * Creates a new base user. (NPO Admin only)
 * @param {object} baseData - { firstName, lastName, email, password, location }
 */
export const addBaseUser = (baseData) => {
    return apiClient.post(API_URL, baseData);
};

/**
 * Gets a list of all base users for the organization. (NPO Admin only)
 */
// export const getBases = () => {
//     return apiClient.get(API_URL);
// };
/**
 * Gets a paginated and searchable list of base users for the organization. (NPO Admin only)
 * @param {object} options - Options for pagination and search.
 * @param {number} options.page - The current page number (1-indexed).
 * @param {number} options.limit - The number of items per page.
 * @param {string} options.search - The search query string.
 * @returns {Promise<object>} A promise that resolves to the API response data.
 */
export const getBases = ({ page = 1, limit = 10, search = '' } = {}) => {
    return apiClient.get(`${API_URL}`, { // Append /my-org to the API_URL
        params: {
            page,
            limit,
            search,
        },
    });
};

export const getBaseLocations = () => {
    return api.get('/bases/locations');
};
