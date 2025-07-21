// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Typography,
//   Box,
//   Badge,
//   Avatar,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   Tooltip,
//   Divider,
//   Stack,
//   TextField,
//   InputAdornment,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import DoneAllIcon from "@mui/icons-material/DoneAll";
// import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
// import CloseIcon from "@mui/icons-material/Close";
// import SearchIcon from "@mui/icons-material/Search";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import { LogoutOutlined } from "@ant-design/icons";
// import { useAuth } from "../../contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import {
//   getMyNotifications,
//   markNotificationsAsRead,
//   markAllAsRead,
//   clearNotification,
//   clearAllNotifications,
// } from "../../services/notification.service";

// const backendUrl = process.env.REACT_APP_API_URL;

// const Header = ({
//   handleMobileDrawerToggle,
//   handleCollapseToggle,
//   isSidebarCollapsed,
//   drawerWidth,
//   collapsedDrawerWidth,
// }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [userMenuAnchor, setUserMenuAnchor] = useState(null);
//   const [notifMenuAnchor, setNotifMenuAnchor] = useState(null);
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     if (!user) return;
//     const loadNotifications = async () => {
//       try {
//         const response = await getMyNotifications();
//         if (response.data && Array.isArray(response.data.data)) {
//           setNotifications(response.data.data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch notifications:", error);
//       }
//     };
//     loadNotifications();
//     const interval = setInterval(loadNotifications, 60000);
//     return () => clearInterval(interval);
//   }, [user]);

//   const handleOpenNotifMenu = (event) => {
//     setNotifMenuAnchor(event.currentTarget);
//     const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
//     if (unreadIds.length > 0) {
//       const updated = notifications.map((n) =>
//         unreadIds.includes(n._id) ? { ...n, isRead: true } : n
//       );
//       setNotifications(updated);
//       markNotificationsAsRead(unreadIds).catch((e) =>
//         console.error("Failed to mark as read:", e)
//       );
//     }
//   };
//   const handleCloseNotifMenu = () => setNotifMenuAnchor(null);
//   const handleMarkAllRead = (e) => {
//     e.stopPropagation();
//     markAllAsRead()
//       .then(() =>
//         setNotifications((c) => c.map((n) => ({ ...n, isRead: true })))
//       )
//       .catch((e) => console.error("Failed to mark all as read:", e));
//   };
//   const handleClearAll = (e) => {
//     e.stopPropagation();
//     if (window.confirm("Are you sure you want to clear all notifications?")) {
//       clearAllNotifications()
//         .then(() => {
//           setNotifications([]);
//           handleCloseNotifMenu();
//         })
//         .catch((e) => console.error("Failed to clear all:", e));
//     }
//   };
//   const handleClearOne = (e, notificationId) => {
//     e.stopPropagation();
//     clearNotification(notificationId)
//       .then(() =>
//         setNotifications((c) => c.filter((n) => n._id !== notificationId))
//       )
//       .catch((e) => console.error("Failed to clear notification:", e));
//   };
//   const handleOpenUserMenu = (event) => setUserMenuAnchor(event.currentTarget);
//   const handleCloseUserMenu = () => setUserMenuAnchor(null);
//   const handleLogout = () => {
//     logout();
//     handleCloseUserMenu();
//   };

//   const unreadCount = notifications.filter((n) => !n.isRead).length;
//   const currentSidebarWidth = isSidebarCollapsed
//     ? collapsedDrawerWidth
//     : drawerWidth;

//   return (
//     <AppBar
//       position="fixed"
//       color="inherit"
//       elevation={0}
//       sx={{
//         width: { sm: `calc(100% - ${currentSidebarWidth}px)` },
//         ml: { sm: `${currentSidebarWidth}px` },
//         transition: (theme) =>
//           theme.transitions.create(["margin", "width"], {
//             easing: theme.transitions.easing.sharp,
//             duration: theme.transitions.duration.enteringScreen,
//           }),
//         borderBottom: "1px solid",
//         borderColor: "divider",
//         borderRadius: "0px",
//       }}
//     >
//       <Toolbar sx={{ height: 70 }}>
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           {/* Hamburger for Mobile */}
//           <IconButton
//             color="inherit"
//             onClick={handleMobileDrawerToggle}
//             sx={{ display: { sm: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//           {/* Hamburger for Desktop */}
//           <IconButton
//             color="inherit"
//             onClick={handleCollapseToggle}
//             sx={{ display: { xs: "none", sm: "block" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//         </Box>

//         <Box sx={{ flexGrow: 1 }} />

//         <Stack direction="row" alignItems="center" spacing={1.5}>
//           <Tooltip title="Notifications">
//             <IconButton color="inherit" onClick={handleOpenNotifMenu}>
//               <Badge badgeContent={unreadCount} color="error">
//                 <NotificationsOutlinedIcon />
//               </Badge>
//             </IconButton>
//           </Tooltip>
//           <Menu
//             anchorEl={notifMenuAnchor}
//             open={Boolean(notifMenuAnchor)}
//             onClose={handleCloseNotifMenu}
//           >
//             <Box
//               sx={{
//                 p: 2,
//                 borderBottom: "1px dashed",
//                 borderColor: "divider",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <Typography variant="h6" fontWeight={600}>
//                 Notifications
//               </Typography>
//               <Stack direction="row" spacing={1}>
//                 <Tooltip title="Mark all as read">
//                   <IconButton
//                     size="small"
//                     color="success"
//                     onClick={handleMarkAllRead}
//                   >
//                     <DoneAllIcon fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Clear all notifications">
//                   <IconButton
//                     size="small"
//                     color="error"
//                     onClick={handleClearAll}
//                   >
//                     <DeleteSweepIcon fontSize="small" />
//                   </IconButton>
//                 </Tooltip>
//               </Stack>
//             </Box>
//             <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
//               {notifications.length > 0 ? (
//                 notifications.map((n) => (
//                   <MenuItem
//                     key={n._id}
//                     alignItems="flex-start"
//                     sx={{
//                       py: 1.5,
//                       px: 2,
//                       whiteSpace: "normal",
//                       borderBottom: "1px dashed",
//                       borderColor: "divider",
//                       gap: 1.5,
//                     }}
//                     onClick={() => {
//                       if (user.role === "super_admin") navigate("/npos");
//                       handleCloseNotifMenu();
//                     }}
//                   >
//                     {!n.isRead && (
//                       <Box
//                         component="span"
//                         sx={{
//                           width: 10,
//                           height: 10,
//                           borderRadius: "50%",
//                           bgcolor: "primary.main",
//                           mt: "6px",
//                           flexShrink: 0,
//                         }}
//                       />
//                     )}
//                     <Box sx={{ flexGrow: 1 }}>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           fontWeight: n.isRead ? 400 : 500,
//                           color: n.isRead ? "text.secondary" : "text.primary",
//                           lineHeight: 1.4,
//                         }}
//                       >
//                         {n.message}
//                       </Typography>
//                     </Box>
//                     <Tooltip title="Dismiss">
//                       <IconButton
//                         size="small"
//                         color="inherit"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleClearOne(e, n._id);
//                         }}
//                       >
//                         <CloseIcon fontSize="small" />
//                       </IconButton>
//                     </Tooltip>
//                   </MenuItem>
//                 ))
//               ) : (
//                 <Typography
//                   sx={{ p: 4, textAlign: "center" }}
//                   color="text.secondary"
//                 >
//                   🎉 You're all caught up!
//                 </Typography>
//               )}
//             </Box>
//           </Menu>

//           <Tooltip title="Account Settings">
//             <IconButton
//               onClick={handleOpenUserMenu}
//               size="small"
//               sx={{ p: 0.5, borderRadius: "50%" }}
//             >
//               <Avatar
//                 src={
//                   user?.profilePhotoUrl
//                     ? `${backendUrl}${user.profilePhotoUrl}`
//                     : ""
//                 }
//                 sx={{ width: 36, height: 36 }}
//               >
//                 {user?.firstName?.charAt(0)}
//               </Avatar>
//             </IconButton>
//           </Tooltip>

//           <Menu
//             anchorEl={userMenuAnchor}
//             open={Boolean(userMenuAnchor)}
//             onClose={handleCloseUserMenu}
//             PaperProps={{ sx: { width: 200 } }}
//           >
//             {user?.role != "missionary" && (
//               <MenuItem
//                 onClick={() => {
//                   navigate("/userProfile");
//                   handleCloseUserMenu();
//                 }}
//               >
//                 <ListItemIcon>
//                   <AccountCircleOutlinedIcon fontSize="small" />
//                 </ListItemIcon>
//                 My Profile
//               </MenuItem>
//             )}
//             <Divider sx={{ my: 0.5 }} />
//             <MenuItem onClick={handleLogout}>
//               <ListItemIcon>
//                 <LogoutOutlined />
//               </ListItemIcon>
//               Logout
//             </MenuItem>
//           </Menu>
//         </Stack>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
  Divider,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getMyNotifications,
  markNotificationsAsRead,
  markAllAsRead,
  clearNotification,
  clearAllNotifications,
} from "../../services/notification.service";
import NotificationDropdown from "../../genricCompoennts/NotificationDropdown";
const backendUrl = process.env.REACT_APP_API_URL;

const Header = ({
  handleMobileDrawerToggle,
  handleCollapseToggle,
  isSidebarCollapsed,
  drawerWidth,
  collapsedDrawerWidth,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notifMenuAnchor, setNotifMenuAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    const loadNotifications = async () => {
      try {
        const response = await getMyNotifications();
        if (response.data && Array.isArray(response.data.data)) {
          setNotifications(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const handleOpenNotifMenu = (event) => {
    setNotifMenuAnchor(event.currentTarget);
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
    if (unreadIds.length > 0) {
      const updated = notifications.map((n) =>
        unreadIds.includes(n._id) ? { ...n, isRead: true } : n
      );
      setNotifications(updated);
      markNotificationsAsRead(unreadIds).catch((e) =>
        console.error("Failed to mark as read:", e)
      );
    }
  };

  const handleCloseNotifMenu = () => setNotifMenuAnchor(null);
  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllAsRead()
      .then(() =>
        setNotifications((c) => c.map((n) => ({ ...n, isRead: true })))
      )
      .catch((e) => console.error("Failed to mark all as read:", e));
  };
  const handleClearAll = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      clearAllNotifications()
        .then(() => {
          setNotifications([]);
          handleCloseNotifMenu();
        })
        .catch((e) => console.error("Failed to clear all:", e));
    }
  };
  const handleClearOne = (e, notificationId) => {
    e.stopPropagation();
    clearNotification(notificationId)
      .then(() =>
        setNotifications((c) => c.filter((n) => n._id !== notificationId))
      )
      .catch((e) => console.error("Failed to clear notification:", e));
  };
  const handleOpenUserMenu = (event) => setUserMenuAnchor(event.currentTarget);
  const handleCloseUserMenu = () => setUserMenuAnchor(null);
  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const currentSidebarWidth = isSidebarCollapsed
    ? collapsedDrawerWidth
    : drawerWidth;

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${currentSidebarWidth}px)` },
        ml: { sm: `${currentSidebarWidth}px` },
        transition: (theme) =>
          theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: "0px",
      }}
    >
      <Toolbar sx={{ height: 70 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Hamburger for Mobile */}
          <IconButton
            color="inherit"
            onClick={handleMobileDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {/* Hamburger for Desktop */}
          <IconButton
            color="inherit"
            onClick={handleCollapseToggle}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <NotificationDropdown
            anchorEl={notifMenuAnchor}
            onClose={handleCloseNotifMenu}
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onClearAll={handleClearAll}
            onClearOne={(id) => handleClearOne(null, id)}
            onClickNotification={(n) => {
              if (user.role === "super_admin") navigate("/npos");
            }}
            onClickNotificationIcon={handleOpenNotifMenu}
          />
          <Tooltip title="Account Settings">
            <IconButton
              onClick={handleOpenUserMenu}
              size="small"
              sx={{ p: 0.5, borderRadius: "50%" }}
            >
              <Avatar
                src={
                  user?.profilePhotoUrl
                    ? `${backendUrl}${user.profilePhotoUrl}`
                    : ""
                }
                sx={{ width: 36, height: 36 }}
              >
                {user?.firstName?.charAt(0)}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleCloseUserMenu}
            PaperProps={{ sx: { width: 200 } }}
          >
            {user?.role != "missionary" && (
              <MenuItem
                onClick={() => {
                  navigate("/userProfile");
                  handleCloseUserMenu();
                }}
              >
                <ListItemIcon>
                  <AccountCircleOutlinedIcon fontSize="small" />
                </ListItemIcon>
                My Profile
              </MenuItem>
            )}
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
