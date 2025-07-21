import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import logo from '../../Assests/Logo1.svg'
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      mt={10}
      component="footer"
      sx={{
        backgroundColor: "#fff",
        color: "#000",
      }}
    >
      <Grid container sx={{ maxWidth: "1200px" }}>
        {/* Logo and Tagline */}
        <Grid item xs={12} md={3} ml={10}>
          {/* <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            N
            <svg
              style={{
                display: "inline",
                verticalAlign: "middle",
                margin: "0 2px",
              }}
              width="10"
              height="20"
            >
              <path
                d="M0 0 L10 20"
                stroke="#FFC107"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            GHTBRIGHT
          </Typography> */}
           <div className="navbar-logo ms-5">
                    <a href="/npoLanding"><img src={logo} alt="NightBright Logo" className="logo-img" /></a>
                  </div>
          <Typography variant="body2" sx={{ mb: 2, fontSize: ".8rem" }}>
            The all-in-one missionary support platform.
          </Typography>
          <Box>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#000", mr: 1 }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#000", mr: 1 }}
            >
              <YouTubeIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "#000" }}
            >
              <TwitterIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Contact */}
        <Grid item xs={12} md={3} py={2} pl={10}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 2, fontSize: "1rem" }}
          >
            Contact
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>
            Redding, CA 96001
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, fontSize: "0.8rem" }}>
            General Inquiries:
            <br />
            <Link href="mailto:info@nightbright.org" color="inherit">
              info@nightbright.org
            </Link>
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={3} py={2} pl={10}>
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 2, fontSize: "1rem" }}
          >
            Quick Links
          </Typography>
          <Box>
            <Link
              href="#"
              color="inherit"
              sx={{ display: "block", mb: 1, fontSize: "0.8rem" }}
            >
              Terms & Conditions
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ display: "block", mb: 1, fontSize: "0.8rem" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ display: "block", mb: 1, fontSize: "0.8rem" }}
            >
              Become Funded
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ display: "block", mb: 1, fontSize: "0.8rem" }}
            >
              Whitelabel
            </Link>
            <Link
              href="#"
              color="inherit"
              sx={{ display: "block", fontSize: "0.8rem" }}
            >
              Why We Give
            </Link>
          </Box>
        </Grid>
        <Box sx={{ mt: 2, ml:6 }} >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", mb: 2, fontSize: "1rem" }}
          >
            Follow
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontSize: "0.8rem" }}>
            Sign up to get the latest news from Night Bright, Inc.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              variant="outlined"
              size="small"
              // placeholder="Your email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  backgroundColor: "#e0e0e0",
                },
              }}
            />
            <Button
              style={{ marginRight: "18px" }}
              variant="contained"
              sx={{
                fontSize: "10px",
                borderRadius: 0,
                backgroundColor: "#000",
                color: "#fff",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Box>
        {/* Follow / Newsletter */}
      </Grid>

      {/* Copyright */}
      <Box sx={{ textAlign: "center", mt: 2, mb: 3 }}>
        <Typography variant="body2" sx={{ bgcolor: "#000", color: "#fff" }}>
          © {year} by Night Bright Inc
        </Typography>
      </Box>
    </Box>
  );
}
