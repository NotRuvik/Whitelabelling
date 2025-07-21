// import React from "react";
// import {
//   Box,
//   Grid,
//   Typography,
//   Link,
//   TextField,
//   Button,
//   IconButton,
// } from "@mui/material";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import YouTubeIcon from "@mui/icons-material/YouTube";
// import TwitterIcon from "@mui/icons-material/Twitter";

// export default function Footer() {
//   const year = new Date().getFullYear();

//   return (
//     <Box
//       //mt={10}
//       component="footer"
//       sx={{
//         backgroundColor: "#ffffff",
//         color: "#000",
//       }}
//     >
//       <Grid container sx={{ maxWidth: "1200px" }}>
//         {/* Logo and Tagline */}
//         <Grid item xs={12} md={3} ml={10}>
//           <Typography variant="h4" fontWeight="bold" sx={{ color: "#000000" }}>
//             Brand Logo
//           </Typography>
//           <Typography variant="body2" sx={{ mb: 2, fontSize: "0.5rem" }}>
//             The all-in-one missionary support platform.
//           </Typography>
//           <Box>
//             <IconButton
//               href="https://instagram.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               sx={{ color: "#000", mr: 1 }}
//             >
//               <InstagramIcon />
//             </IconButton>
//             <IconButton
//               href="https://youtube.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               sx={{ color: "#000", mr: 1 }}
//             >
//               <YouTubeIcon />
//             </IconButton>
//             <IconButton
//               href="https://twitter.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               sx={{ color: "#000" }}
//             >
//               <TwitterIcon />
//             </IconButton>
//           </Box>
//         </Grid>

//         {/* Contact */}
//         <Grid item xs={12} md={3} py={2} pl={10}>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: "bold", mb: 2, fontSize: "0.8rem" }}
//           >
//             Contact
//           </Typography>
//           <Typography variant="body2" sx={{ fontSize: "0.6rem" }}>
//             Redding, CA 96001
//           </Typography>
//           <Typography variant="body2" sx={{ mt: 1, fontSize: "0.6rem" }}>
//             General Inquiries:
//             <br />
//             <Link href="mailto:info@nightbright.org" color="inherit">
//               info@nightbright.org
//             </Link>
//           </Typography>
//         </Grid>

//         {/* Quick Links */}
//         <Grid item xs={12} md={3} py={2} pl={10}>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: "bold", mb: 2, fontSize: "0.8rem" }}
//           >
//             Quick Links
//           </Typography>
//           <Box>
//             <Link
//               href="#"
//               color="inherit"
//               sx={{ display: "block", mb: 1, fontSize: "0.6rem" }}
//             >
//               Terms & Conditions
//             </Link>
//             <Link
//               href="#"
//               color="inherit"
//               sx={{ display: "block", mb: 1, fontSize: "0.6rem" }}
//             >
//               Privacy Policy
//             </Link>
//             <Link
//               href="#"
//               color="inherit"
//               sx={{ display: "block", mb: 1, fontSize: "0.6rem" }}
//             >
//               Become Funded
//             </Link>
//             <Link
//               href="#"
//               color="inherit"
//               sx={{ display: "block", mb: 1, fontSize: "0.6rem" }}
//             >
//               Whitelabel
//             </Link>
//             <Link
//               href="#"
//               color="inherit"
//               sx={{ display: "block", fontSize: "0.6rem" }}
//             >
//               Why We Give
//             </Link>
//           </Box>
//         </Grid>

//         {/* Follow / Newsletter */}
//         <Grid item xs={12} md={3} py={2} ml={30}>
//           <Typography
//             variant="h6"
//             sx={{ fontWeight: "bold", mb: 2, fontSize: "0.8rem" }}
//           >
//             Follow
//           </Typography>
//           <Typography variant="body2" sx={{ mb: 2, fontSize: "0.6rem" }}>
//             Sign up to get the latest news from Night Bright, Inc.
//           </Typography>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             <TextField
//               variant="outlined"
//               size="small"
//               // placeholder="Your email"
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 0,
//                   backgroundColor: "#e0e0e0",
//                 },
//               }}
//             />
//             <Button
//               style={{ marginRight: "18px" }}
//               variant="contained"
//               sx={{
//                 fontSize: "10px",
//                 borderRadius: 0,
//                 backgroundColor: "#000",
//                 color: "#fff",
//                 "&:hover": { backgroundColor: "#333" },
//               }}
//             >
//               Subscribe
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>

//       {/* Copyright */}
//       <Box sx={{ textAlign: "center", mt: 2, mb: 3 }}>
//         <Typography variant="body2" sx={{ bgcolor: "#000", color: "#fff" }}>
//           © {year} by Night Bright Inc
//         </Typography>
//       </Box>
//     </Box>
//   );
// }
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

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#ffffff",
        color: "#000",
        px: 2,
        py: 4,
      }}
    >
      <Grid container spacing={4} sx={{ maxWidth: "1200px", mx: "auto" }}>
        {/* Logo and Tagline */}
        <Grid item xs={12} md={3}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#000000", fontSize: { xs: "1.4rem", sm: "1.8rem" } }}
          >
            Brand Logo
          </Typography>
          <Typography sx={{ mb: 2, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
            The all-in-one missionary support platform.
          </Typography>
          <Box>
            <IconButton href="https://instagram.com" target="_blank" sx={{ color: "#000", mr: 1 }}>
              <InstagramIcon />
            </IconButton>
            <IconButton href="https://youtube.com" target="_blank" sx={{ color: "#000", mr: 1 }}>
              <YouTubeIcon />
            </IconButton>
            <IconButton href="https://twitter.com" target="_blank" sx={{ color: "#000" }}>
              <TwitterIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Contact */}
        <Grid item xs={12} md={3}>
          <Typography sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1rem", sm: "1.1rem" } }}>
            Contact
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
            Redding, CA 96001
          </Typography>
          <Typography sx={{ mt: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
            General Inquiries:
            <br />
            <Link href="mailto:info@nightbright.org" color="inherit">
              info@nightbright.org
            </Link>
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} md={3}>
          <Typography sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1rem", sm: "1.1rem" } }}>
            Quick Links
          </Typography>
          {["Terms & Conditions", "Privacy Policy", "Become Funded", "Whitelabel", "Why We Give"].map(
            (link, index) => (
              <Link
                key={index}
                href="#"
                color="inherit"
                sx={{
                  display: "block",
                  mb: index !== 4 ? 1 : 0,
                  fontSize: { xs: "0.9rem", sm: "0.95rem" },
                }}
              >
                {link}
              </Link>
            )
          )}
        </Grid>

        {/* Newsletter */}
        <Grid item xs={12} md={3}>
          <Typography sx={{ fontWeight: "bold", mb: 2, fontSize: { xs: "1rem", sm: "1.1rem" } }}>
            Follow
          </Typography>
          <Typography sx={{ mb: 2, fontSize: { xs: "0.9rem", sm: "1rem" } }}>
            Sign up to get the latest news from Night Bright, Inc.
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <TextField
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                minWidth: "200px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  backgroundColor: "#e0e0e0",
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                fontSize: "0.8rem",
                borderRadius: 0,
                backgroundColor: "#000",
                color: "#fff",
                px: 2,
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Copyright */}
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="body2" sx={{ bgcolor: "#000", color: "#fff", py: 1 }}>
          © {year} by Night Bright Inc
        </Typography>
      </Box>
    </Box>
  );
}
