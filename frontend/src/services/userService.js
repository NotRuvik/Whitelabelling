// src/services/userService.js
import axios from 'axios';
const getAuthToken = () => localStorage.getItem('authToken');
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

export const updateUserDetails = (userData) => {
  return apiClient.put(`/users/${userData.id}`, userData); // Update the user details
};

export const uploadMyAvatar = (file) => {
    const formData = new FormData();
    formData.append('profilePhoto', file);

    // Call the new universal user route
    return apiClient.patch(`/users/me/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};