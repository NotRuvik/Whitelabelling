import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { getRoleBasedDashboardData } from "../services/dashboard.service";

import SuperAdminDashboard from "../genricCompoennts/Dashboard/SuperAdminDashboard";
import NpoAdminDashboard from "../genricCompoennts/Dashboard/NpoAdminDashboard";
import DonorDashboard from "../genricCompoennts/Dashboard/DonorDashboard";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await getRoleBasedDashboardData();
        setDashboardData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Could not load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const renderDashboardByRole = () => {
    if (!dashboardData) return null;

    switch (dashboardData.role) {
      case "super_admin":
        return <SuperAdminDashboard data={dashboardData} />;
      case "npo_admin":
        return <NpoAdminDashboard data={dashboardData} />;
      case "donor":
        return <DonorDashboard data={dashboardData} />;
      default:
        return <Typography>No dashboard available for your role.</Typography>;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 1, minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        Dashboard
      </Typography>
      {renderDashboardByRole()}
    </Box>
  );
};

export default DashboardPage;