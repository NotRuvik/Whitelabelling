// import React, { useState, useEffect } from 'react';
// import { Box, Toolbar, CssBaseline } from '@mui/material';
// import { Outlet } from 'react-router-dom';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import { useAuth } from '../contexts/AuthContext';
// import superadminMenu from '../menu-items/superadmin';
// import npoadminMenu from '../menu-items/npoadmin';
// import missionaryMenu from '../menu-items/missionary';

// const drawerWidth = 260;

// export default function DashboardLayout() {
//   const { user } = useAuth();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     if (user?.role) {
//       switch (user.role) {
//         case 'super_admin': setMenuItems(superadminMenu); break;
//         case 'npo_admin': setMenuItems(npoadminMenu); break;
//         case 'missionary': setMenuItems(missionaryMenu); break;
//         default: setMenuItems([]);
//       }
//     }
//   }, [user]);

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
//       <Header drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
//       <Sidebar
//         drawerWidth={drawerWidth}
//         mobileOpen={mobileOpen}
//         handleDrawerToggle={handleDrawerToggle}
//         menuItems={menuItems}
//       />
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           backgroundColor: (theme) => theme.palette.background.default,
//           minHeight: '100vh',
//         }}
//       >
//         <Toolbar />
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }
import React, { useState, useEffect } from "react";
import { Box, Toolbar, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useAuth } from "../contexts/AuthContext";
import superadminMenu from "../menu-items/superadmin";
import npoadminMenu from "../menu-items/npoadmin";
import missionaryMenu from "../menu-items/missionary";
import baseMenu from "../menu-items/baseuser";
import donorMenu from "../menu-items/donoruser";

const drawerWidth = 280; // Standard width for the sidebar
const collapsedDrawerWidth = 88; // Width when collapsed

export default function DashboardLayout() {
  const { user } = useAuth();
  console.log("userrole",user)
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false); // State for desktop collapse
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case "super_admin":
          setMenuItems(superadminMenu);
          break;
        case "npo_admin":
          setMenuItems(npoadminMenu);
          break;
        case "missionary":
          setMenuItems(missionaryMenu);
          break;
          case "donor":
          setMenuItems(donorMenu);
          break;
           case "base_user":
          setMenuItems(baseMenu);
          break;
        default:
          setMenuItems([]);
      }
    }
  }, [user]);

  // Toggles the mobile (temporary) drawer
  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Toggles the desktop (permanent) drawer's collapsed state
  const handleCollapseToggle = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const currentDrawerWidth = isSidebarCollapsed
    ? collapsedDrawerWidth
    : drawerWidth;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header
        handleMobileDrawerToggle={handleMobileDrawerToggle}
        handleCollapseToggle={handleCollapseToggle}
        isSidebarCollapsed={isSidebarCollapsed}
        drawerWidth={drawerWidth}
        collapsedDrawerWidth={collapsedDrawerWidth}
      />
      <Sidebar
        drawerWidth={drawerWidth}
        collapsedDrawerWidth={collapsedDrawerWidth}
        mobileOpen={mobileOpen}
        handleMobileDrawerToggle={handleMobileDrawerToggle}
        isSidebarCollapsed={isSidebarCollapsed}
        menuItems={menuItems}
        userRole={user.role}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: {
            sm: `calc(100% - ${currentDrawerWidth}px)`,
          },
          minHeight: '100vh',
          // --- THIS IS THE FIX ---
          // Add this line to restore the light grey background for all pages
          backgroundColor: (theme) => theme.palette.grey[100],
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
