import api from "./api";

const API_URL = "/dashboard";

/**
 * Fetches the main dashboard statistics (Total NPOs, Missionaries, Causes).
 * Requires super_admin authentication, which is handled automatically by the api instance interceptor.
 * @returns {Promise} An axios promise containing the dashboard stats data.
 */
export const getDashboardStats = () => {
  return api.get(`${API_URL}/stats`);
};

export const getGrowthData = (metric) => {
  return api.get("/dashboard/growth-chart", {
    params: { metric },
  });
};
export const getRoleBasedDashboardData = () => {
  return api.get("/dashboard");
};
