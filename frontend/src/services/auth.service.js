import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const getOrgSlug = () => localStorage.getItem('orgSlug');

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const orgSlug = getOrgSlug();
    if (orgSlug) {
        config.headers['x-org-slug'] = orgSlug;
    }
    return config;
});

/**
 * Registers a new missionary via the public signup endpoint.
 * @param {object} signupData - { firstName, lastName, email, password }
 */
export const publicMissionarySignup = (signupData) => {
    return apiClient.post('/missionaries/public/signup', signupData);
};



// You can add your login function here as well
// export const login = (credentials) => apiClient.post('/auth/login', credentials);