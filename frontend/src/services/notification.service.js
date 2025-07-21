// src/services/notificationService.js
import axios from 'axios';

const API_URL = '/notifications';
const getAuthToken = () => localStorage.getItem('authToken'); // Adjust based on how you store your token

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '',
});

apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// export const markNotificationsAsRead = (notificationIds) => {
//     return apiClient.patch(`${API_URL}/read`, { notificationIds });
// };
// export const getMyNotifications = () => {
//     return apiClient.get(API_URL);
// };
export const getMyNotifications = () => {
    return apiClient.get(`${API_URL}`); // Ensure your prefix is correct
};

export const markNotificationsAsRead = (notificationIds) => {
    return apiClient.patch(`${API_URL}/read`, { notificationIds });
};

// --- NEW FUNCTIONS ---
export const markAllAsRead = () => {
    return apiClient.patch(`${API_URL}/read-all`);
};

export const clearNotification = (notificationId) => {
    return apiClient.delete(`${API_URL}/${notificationId}`);
};

export const clearAllNotifications = () => {
    return apiClient.delete(`${API_URL}`);
};