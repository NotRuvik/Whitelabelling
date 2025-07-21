import axios from 'axios';
import api from './api';
const getAuthToken = () => localStorage.getItem('authToken');
const API_URL = '/missionaries'; 

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Fetches all publicly listed missionaries. No auth required.
 * @param {object} params - Object for query params (search, ministry, continent, page, etc.)
 */
export const getPublicMissionaries = (params) => {
    return apiClient.get('/missionaries/public', { params });
};

export const getMissionaries = (params) => {
    return apiClient.get(API_URL, { params });
};

export const addAndRegisterMissionary = (missionaryData) => {
    return apiClient.post(API_URL, missionaryData);
};

export const blockMissionary = (missionaryId) => {
    return apiClient.patch(`${API_URL}/${missionaryId}/status`, { isActive: false });
};

export const unblockMissionary = (missionaryId) => {
    return apiClient.patch(`${API_URL}/${missionaryId}/status`, { isActive: true });
};

export const getMyProfile = () => {
    return apiClient.get(`${API_URL}/me`);
};

export const updateMyProfile = (profileData) => {
    return apiClient.patch(`${API_URL}/me`, profileData);
};

export const assignBaseToMissionary = (missionaryId, baseId) => {
    return api.patch(`/missionaries/${missionaryId}/assign-base`, { baseId });
};

export const uploadProfilePicture = (file) => {
    const formData = new FormData();
    formData.append('profilePhoto', file);

    return apiClient.patch(`${API_URL}/me/photo`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

/**
 * Uploads multiple images for the missionary page.
 * @param {FileList} files - The files selected by the user from the input.
 */
export const uploadPageImages = (files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('pageImages', files[i]);
  }
  return apiClient.patch(`${API_URL}/me/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Deletes a specific page image for the current missionary.
 * @param {string} imageUrl - The relative URL of the image to delete.
 */
export const deletePageImage = (imageUrl) => {
  return apiClient.delete(`${API_URL}/me/images`, {
    data: { imageUrl }, // Send the imageUrl in the request body for a DELETE request
  });
};

/**
 * Uploads a verification document file.
 * @param {File} file - The document file to upload.
 */
export const uploadVerificationDocument = (file) => {
  const formData = new FormData();
  // 'verificationDocument' must match the fieldName in your uploader options
  formData.append('verificationDocument', file);
  
  return apiClient.patch('/missionaries/me/document', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Deletes the current user's verification document.
 */
export const deleteVerificationDocument = () => {
  return apiClient.delete(`${API_URL}/me/document`);
};