import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../Assests/Logo.svg";
import MissionarySignupModal from "../components/auth/MissionarySignupModal";
import { LoginModal } from "../components/auth/LoginModal";
import { Box, Button, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider, useMediaQuery, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../../contexts/AuthContext";

export default function NavBar() {
  const [hoveredMenu, setHoveredMenu] = useState("");
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    if (isMobile) handleDrawerToggle();
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
    if (isMobile) handleDrawerToggle();
  };

  const closeLoginModal = () => setLoginModalOpen(false);

  const openSignupModal = () => {
    setSignupModalOpen(true);
    if (isMobile) handleDrawerToggle();
  };

  const closeSignupModal = () => setSignupModalOpen(false);

  const navLinkBase = {
    margin: "0 20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    textDecoration: "none",
    position: "relative",
    "&:hover": {
      color: "#d1a768",
    },
  };

  const dropdownMenuStyle = {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    padding: "16px 24px",
    gap: "40px",
    zIndex: 1001,
    whiteSpace: "nowrap",
    minWidth: "250px",
  };

  const mobileDropdownStyle = {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "20px",
    gap: "10px",
    marginTop: "8px",
  };

  const drawerContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        color: "#fff",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <Typography variant="h5" fontWeight="bold" sx={{ color: "#ffffff" }}>
          Brand Logo
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <List>
        {/* Find */}
        <ListItem
          button
          onClick={() => setHoveredMenu(hoveredMenu === "find" ? "" : "find")}
          sx={{ padding: "12px 0" }}
        >
          <ListItemText primary="Find" />
        </ListItem>
        {hoveredMenu === "find" && (
          <Box sx={mobileDropdownStyle}>
            <Link
              to="/missionaries"
              style={{
                color: "#d1a768",
                textDecoration: "none",
                fontWeight: 500,
                padding: "8px 0",
              }}
              onClick={handleDrawerToggle}
            >
              Missionaries
            </Link>
            <Link
              to="/causes"
              style={{
                color: "#d1a768",
                textDecoration: "none",
                fontWeight: 500,
                padding: "8px 0",
              }}
              onClick={handleDrawerToggle}
            >
              Causes
            </Link>
          </Box>
        )}

        {/* Become */}
        <ListItem
          button
          component={Link}
          to="/become"
          onClick={handleDrawerToggle}
          sx={{ padding: "12px 0" }}
        >
          <ListItemText primary="Become" />
        </ListItem>

        {/* Forum */}
        <ListItem
          button
          component={Link}
          to="/forum"
          onClick={handleDrawerToggle}
          sx={{ padding: "12px 0" }}
        >
          <ListItemText primary="Forum" />
        </ListItem>

        {/* About */}
        <ListItem
          button
          onClick={() => setHoveredMenu(hoveredMenu === "about" ? "" : "about")}
          sx={{ padding: "12px 0" }}
        >
          <ListItemText primary="About" />
        </ListItem>
        {hoveredMenu === "about" && (
          <Box sx={mobileDropdownStyle}>
            <Link
              to="/about"
              style={{
                color: "#d1a768",
                textDecoration: "none",
                fontWeight: 500,
                padding: "8px 0",
              }}
              onClick={handleDrawerToggle}
            >
              About
            </Link>
            <Link
              to="/team"
              style={{
                color: "#d1a768",
                textDecoration: "none",
                fontWeight: 500,
                padding: "8px 0",
              }}
              onClick={handleDrawerToggle}
            >
              Team
            </Link>
            <Link
              to="/ways-to-give"
              style={{
                color: "#d1a768",
                textDecoration: "none",
                fontWeight: 500,
                padding: "8px 0",
              }}
              onClick={handleDrawerToggle}
            >
              Ways to Give
            </Link>
          </Box>
        )}

        {isAuthenticated ? (
          <>
            <Divider sx={{ backgroundColor: "#333", margin: "20px 0" }} />
            <ListItem
              button
              component={Link}
              to="/profile"
              onClick={handleDrawerToggle}
              sx={{ padding: "12px 0" }}
            >
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              onClick={handleLogout}
              sx={{ padding: "12px 0", color: "#E5A749" }}
            >
              <ListItemText primary="Log Out" />
            </ListItem>
          </>
        ) : (
          <>
            <Divider sx={{ backgroundColor: "#333", margin: "20px 0" }} />
            <ListItem
              button
              onClick={() => setHoveredMenu(hoveredMenu === "signin" ? "" : "signin")}
              sx={{ padding: "12px 0", color: "#d1a768" }}
            >
              <ListItemText primary="Sign In" />
            </ListItem>
            {hoveredMenu === "signin" && (
              <Box sx={mobileDropdownStyle}>
                <ListItem
                  button
                  onClick={openLoginModal}
                  sx={{ padding: "8px 0", color: "#d1a768" }}
                >
                  <ListItemText primary="Missionary Log-in" />
                </ListItem>
                <ListItem
                  button
                  onClick={openSignupModal}
                  sx={{ padding: "8px 0", color: "#d1a768" }}
                >
                  <ListItemText primary="Missionary Sign-up" />
                </ListItem>
              </Box>
            )}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#000",
          color: "#fff",
          padding: { xs: "20px", md: "40px 0 40px 150px" },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Mobile menu button */}
        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "#ffffff", fontSize: { xs: "1.5rem", md: "2rem" } }}
        >
          Brand Logo
        </Typography>

        {/* Desktop Nav Links */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Box
              sx={{ position: "relative" }}
              onMouseEnter={() => setHoveredMenu("find")}
              onMouseLeave={() => setHoveredMenu("")}
            >
              <span style={navLinkBase}>Find</span>
              {hoveredMenu === "find" && (
                <Box sx={dropdownMenuStyle}>
                  <Link
                    to="/missionaries"
                    style={{
                      color: "#333",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Missionaries
                  </Link>
                  <Link
                    to="/causes"
                    style={{
                      color: "#333",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Causes
                  </Link>
                </Box>
              )}
            </Box>

            <Link to="/become" style={navLinkBase}>
              Become
            </Link>

            <Link to="/forum" style={navLinkBase}>
              Forum
            </Link>

            <Box
              sx={{ position: "relative" }}
              onMouseEnter={() => setHoveredMenu("about")}
              onMouseLeave={() => setHoveredMenu("")}
            >
              <span style={navLinkBase}>About</span>
              {hoveredMenu === "about" && (
                <Box sx={dropdownMenuStyle}>
                  <Link
                    to="/about"
                    style={{
                      color: "#333",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    About
                  </Link>
                  <Link
                    to="/team"
                    style={{
                      color: "#333",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Team
                  </Link>
                  <Link
                    to="/ways-to-give"
                    style={{
                      color: "#333",
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Ways to Give
                  </Link>
                </Box>
              )}
            </Box>

            <Box>
              {isAuthenticated ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    minWidth: "240px",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    component={Link}
                    to="/profile"
                    variant="contained"
                    sx={{
                      bgcolor: "white",
                      color: "black",
                      borderRadius: "20px",
                      textTransform: "none",
                      "&:hover": { bgcolor: "#f0f0f0" },
                      px: 3,
                      mr: 2,
                      fontSize: { md: "0.875rem", lg: "0.9375rem" },
                    }}
                  >
                    Dashboard
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outlined"
                    sx={{
                      borderColor: "#E5A749",
                      color: "#E5A749",
                      borderRadius: "20px",
                      textTransform: "none",
                      "&:hover": { borderColor: "white", color: "white" },
                      px: 3,
                      fontSize: { md: "0.875rem", lg: "0.9375rem" },
                    }}
                  >
                    Log Out
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{ position: "relative" }}
                  onMouseEnter={() => setHoveredMenu("signin")}
                  onMouseLeave={() => setHoveredMenu("")}
                >
                  <span style={{ ...navLinkBase, color: "#d1a768" }}>
                    Sign In
                  </span>
                  {hoveredMenu === "signin" && (
                    <Box sx={dropdownMenuStyle}>
                      <span
                        onClick={openLoginModal}
                        style={{
                          color: "#333",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Missionary Log-in
                      </span>
                      <span
                        onClick={openSignupModal}
                        style={{
                          color: "#333",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Missionary Sign-up
                      </span>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Spacer for desktop layout */}
        {!isMobile && <Box sx={{ width: "100px" }}></Box>}
      </Box>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "80%",
            maxWidth: "320px",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <LoginModal
        open={isLoginModalOpen}
        handleClose={closeLoginModal}
        openSignupModal={openSignupModal}
      />
      <MissionarySignupModal
        open={isSignupModalOpen}
        handleClose={closeSignupModal}
        openLoginModal={openLoginModal}
      />
    </>
  );
}