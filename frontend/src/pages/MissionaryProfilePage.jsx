import React from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Link, Outlet, useLocation } from "react-router-dom";

const MissionaryProfilePage = () => {
  const { user } = useAuth();
  console.log("user", user);
  const location = useLocation();
  const backendUrl = process.env.REACT_APP_API_URL;
  const currentTab = location.pathname;

  return (
    <Box sx={{ bgcolor: "#f4f5f7", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", alignItems: "center", mb: 4, pl: 3 }}>
          <Avatar
            src={
              user?.profilePhotoUrl
                ? `${backendUrl}${user.profilePhotoUrl}`
                : ""
            }
            sx={{
              width: 90,
              height: 90,
              mr: 3,
              bgcolor: "#e0e0e0",
              fontSize: 40,
            }}
          >
            {user?.firstName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography
              variant="caption"
              sx={{ color: "gray", fontSize: 22, fontWeight: 500 }}
            >
              Welcome
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#6e6e6e" }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontWeight: 600, color: "#6e6e6e" }}
            >
              Status: {user?.isBlocked ? "Inactive" : "Active"}
            </Typography>
          </Box>
        </Box>

        {/* Navigation Tabs */}
        <Paper elevation={1} sx={{ borderRadius: "20px", overflow: "hidden" }}>
          <Box
            sx={{
              bgcolor: "#ffffff",
              //borderBottom: "1px solid #e0e0e0",
              px: 3,
            }}
          >
            <Tabs
              value={currentTab}
              textColor="inherit"
              indicatorColor="primary"
              variant="fullWidth"
              sx={{
                minHeight: "48px",
                ".MuiTabs-flexContainer": {
                  justifyContent: "space-around",
                },
                ".MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  color: "#4a4a4a",
                  minHeight: "48px",
                },
                ".Mui-selected": {
                  color: "#2a4fb3",
                },
                ".MuiTabs-indicator": {
                  height: "3px",
                  backgroundColor: "#2a4fb3",
                  borderRadius: "2px",
                },
              }}
            >
              <Tab
                label="Account"
                value="/profile/account"
                to="/profile/account"
                component={Link}
              />
              <Tab
                label="My Page"
                value="/profile/my-page"
                to="/profile/my-page"
                component={Link}
              />
              <Tab
                label="Causes"
                value="/profile/causes"
                to="/profile/causes"
                component={Link}
              />
              <Tab
                label="Forum"
                value="/profile/forum"
                to="/profile/forum"
                component={Link}
              />
              <Tab
                label="Wallet"
                value="/profile/wallet"
                to="/profile/wallet"
                component={Link}
              />
              <Tab
                label="Donations"
                value="/profile/donations"
                to="/profile/donations"
                component={Link}
              />
            </Tabs>
          </Box>
          <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#fff" }}>
            <Outlet />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MissionaryProfilePage;
