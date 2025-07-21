import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  SvgIcon,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import * as AntdIcons from "@ant-design/icons";
import logo from "../../Assests/Logo1.svg";

// Your Brand Logo as an SVG Component
const BrandLogo = () => (
  <SvgIcon fontSize="large" sx={{ color: "primary.main" }}>
    <svg
      fill="currentColor"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M938 458.8l-29.6-31.2c-18-18.8-47.2-18.8-65.2 0l-1.2 1.2-132.4-140c-18-18.8-47.2-18.8-65.2 0L521.2 411.6l-174-184c-18-18.8-47.2-18.8-65.2 0L86.4 458.8c-18 18.8-18 49.2 0 68l29.6 31.2c18 18.8 47.2 18.8 65.2 0l1.2-1.2 132.4 140c18 18.8 47.2 18.8 65.2 0l123.2-129.2 174 184c18 18.8 47.2 18.8 65.2 0l205.6-216.4c18-18.8 18-49.2 0-68zM332.8 546.4c-18 18.8-47.2 18.8-65.2 0l-29.6-31.2c-18-18.8-18-49.2 0-68l113.2-118.8c18-18.8 47.2-18.8 65.2 0l29.6 31.2c18 18.8 18 49.2 0 68L332.8 546.4z m358.4-375.2c18-18.8 47.2-18.8 65.2 0l29.6 31.2c18 18.8 18 49.2 0 68L580.4 546.4c-18 18.8-47.2 18.8-65.2 0l-29.6-31.2c-18-18.8-18-49.2 0-68l205.6-216.4z"></path>
    </svg>
  </SvgIcon>
);

const Sidebar = ({
  drawerWidth,
  collapsedDrawerWidth, // <-- Prop to control collapsed width
  mobileOpen,
  handleMobileDrawerToggle,
  isSidebarCollapsed, // <-- Prop to control collapsed state
  menuItems,
  userRole,
}) => {
  console.log("userRoleuserRole",userRole)
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* <Toolbar
        sx={{ py: 3, display: "flex", alignItems: "center", gap: 1.5, px: 3 }}
      >
        <BrandLogo />
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary.main"
          sx={{ display: isSidebarCollapsed ? "none" : "block" }}
        >
          Brand Logo
        </Typography>
      </Toolbar> */}
      <Toolbar
      sx={{
        py: 3,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 3,
        justifyContent: isSidebarCollapsed ? 'center' : 'flex-start', // Center logo when collapsed
        minHeight: '64px', // Ensure consistent height
      }}
    >
      {userRole === "super_admin" ? (
        // Use a Box to wrap the <img> tag for MUI's sx prop
        <Box
          component="img" // This makes the Box render as an <img> tag
          src={logo}
          alt="Admin Dashboard Logo" // Provide a meaningful alt text
          sx={{
            display: 'block', // Ensures margin auto works if needed for centering
            // Add any other specific styles for the image logo here
            // e.g., margin: isSidebarCollapsed ? '0 auto' : '0', if centering is desired
          }}
        />
      ) : (
        // BrandLogo component
        <BrandLogo /> // Render BrandLogo for other roles
      )}

      {/* Typography for the text label */}
      <Typography
        variant="h5"
        fontWeight={700}
        color="primary.main" // Make sure 'primary.main' is available via theme
        sx={{
          // Hide text when sidebar is collapsed OR when userRole is Super_Admin
          // (assuming BrandLogo inherently indicates the brand name)
          // If BrandLogo is purely an icon and still needs text, adjust this condition.
          display: isSidebarCollapsed || userRole === "super_admin" ? "none" : "block",
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        NPO Logo
      </Typography>
    </Toolbar>

      {/* Scrollable List Section (your exact styling) */}
      <Box
        sx={{
          px: 2,
          bgcolor: "#F9FAFB",
          borderRadius: "20px",
          mx: 2,
          my: 2,
          flexGrow: 1,
          overflowY: "auto",
        }}
      >
        <List>
          {menuItems.map((item) => {
            const Icon = AntdIcons[item.icon];
            return (
              <ListItem
                key={item.id || item.title}
                disablePadding
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  component={NavLink}
                  to={item.url}
                  sx={{
                    borderRadius: "8px",
                    px: 1.5,
                    py: 1,
                    gap: 1.5, // Sync gap with icon margin
                    minHeight: 40,
                    color: "#212B36",
                    // Center content when collapsed
                    justifyContent: isSidebarCollapsed ? "center" : "initial",
                    "& .MuiListItemIcon-root": {
                      minWidth: 0,
                      color: "inherit",
                      fontSize: "18px",
                      marginRight: isSidebarCollapsed ? 0 : "12px",
                    },
                    "& .MuiListItemText-primary": {
                      fontSize: "14px",
                      fontWeight: 500,
                    },
                    "&:hover": {
                      backgroundColor: "primary.dark ",
                    },
                    "&.active": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      fontWeight: 600,
                      "&:hover": {
                        backgroundColor: "primary.light",
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    {Icon ? <Icon /> : <AntdIcons.QuestionCircleOutlined />}
                  </ListItemIcon>
                  {/* Text is now hidden when sidebar is collapsed */}
                  <ListItemText
                    primary={item.title}
                    sx={{ display: isSidebarCollapsed ? "none" : "block" }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      // The Box itself now gets the dynamic width
      sx={{
        width: { sm: isSidebarCollapsed ? collapsedDrawerWidth : drawerWidth },
        flexShrink: { sm: 0 },
      }}
    >
      {/* Mobile Drawer (no changes needed) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid #E0E0E0",
            borderRadius: 0,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer (now collapsible) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            borderRight: "1px solid #E0E0E0",
            borderRadius: 0,
            // Width changes based on the collapsed state
            width: isSidebarCollapsed ? collapsedDrawerWidth : drawerWidth,
            // Add a smooth animation for the width change
            overflowX: "hidden",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
