// src/services/organizationService.js
import axios from 'axios';

const API_URL = '/organizations';

// Setup axios instance with auth headers if you have a token
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '',
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${your_auth_token}` // Get token from your auth context
    }
});


// export const fetchOrganizations = () => {
//     return apiClient.get(API_URL);
// };
export const fetchOrganizations = (page = 1, perPage = 10, search = "", sortField = "", sortOrder = "asc") => {
    let query = `?page=${page}&perPage=${perPage}`;
    if (search) query += `&search=${encodeURIComponent(search)}`;
    return apiClient.get(`${API_URL}${query}`);
};

export const approveOrganization = (orgId) => {
    return apiClient.patch(`${API_URL}/${orgId}/status`, { status: 'active' });
};

export const rejectOrganization = (orgId) => {
    return apiClient.post(`${API_URL}/${orgId}/review`, { decision: 'reject' });
};

export const blockOrganization = (orgId) => {
    return apiClient.patch(`${API_URL}/${orgId}/block`, { isBlocked: true });
};

export const unblockOrganization = (orgId) => {
    return apiClient.patch(`${API_URL}/${orgId}/block`, { isBlocked: false });
};