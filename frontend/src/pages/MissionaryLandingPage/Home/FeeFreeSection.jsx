// import React from "react";
// import {
//   Box,
//   Grid,
//   Typography,

//   IconButton,
// } from "@mui/material";
// import FlashOnIcon from "@mui/icons-material/FlashOn";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

// const FeeFreeSection = () => {
//   return (
//     <Box sx={{ width: "100%",bgcolor: "#fff"  }}>
//       <Grid
//         container
//         sx={{
//           flexDirection: { xs: "column", md: "row" },
//           pl: { xs: 2, sm: 4, md: 13 },
//           py: { xs: 4, sm: 6, md: 8 },
//         }}
//       >
//         {/* Left Section */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             color: "#fff",
//             p: { xs: 2, sm: 4, md: 8 },
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             minHeight: { xs: 200, md: 300 },
//             bgcolor: "#000",
//           }}
//         >
//           <Box display="flex" alignItems="center" mb={2}>
//             <Typography
//               variant="h6"
//               fontWeight="bold"
//               mr={1}
//               sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" } }}
//             >
//               100% Fee Free
//             </Typography>
//             <FlashOnIcon sx={{ color: "#fdd835", fontSize: { xs: 20, md: 24 } }} />
//           </Box>

//           <Typography
//             variant="body2"
//             sx={{
//               color: "#ddd",
//               maxWidth: { xs: "100%", sm: 400 },
//               mb: 3,
//               fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
//             }}
//           >
//             Our platform is free to use and the donors pay the credit card fees.
//             Our missionaries receive 100% of the donations!
//           </Typography>

//           <Box display="flex" alignItems="center" gap={1}>
//             <IconButton
//               size="small"
//               sx={{
//                 backgroundColor: "#fdd835",
//                 color: "#000",
//                 ":hover": { backgroundColor: "#fbc02d" },
//               }}
//             >
//               <ArrowForwardIcon fontSize="small" />
//             </IconButton>
//             <Typography
//               variant="body2"
//               sx={{
//                 color: "#fdd835",
//                 fontWeight: 500,
//                 textTransform: "uppercase",
//                 fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
//               }}
//             >
//               FIND | FUND | RESOURCE
//             </Typography>
//           </Box>
//         </Grid>

//         {/* Right Section */}
//         <Grid
//           item
//           xs={12}
//           md={6}
//           sx={{
//             backgroundColor: "#efeded",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             p: { xs: 1, sm: 2 },
//           }}
//         >
//           <img
//             src="/path-to-your-image.jpg"
//             alt="Happy Pic"
//             style={{
//               maxWidth: "100%",
//               maxHeight: "100%",
//               objectFit: "contain",
//               borderRadius: "8px",
//             }}
//           />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default FeeFreeSection;

import React from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import sampleImage from "../../../Assests/Images/happyimage.avif";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const FeeFreeSection = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const navigate = useNavigate();

  const handleClick = () => {
    // Replace "demo-id" with actual missionary ID if needed
    navigate("/find-missionary-profile/demo-id");
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff" }}>
      <Grid
        container
        sx={{
          flexDirection: { xs: "column", md: "row" },
          py: { xs: 4, sm: 6, md: 8 },
          px: { xs: 4, sm: 4, md: 15 },
        }}
      >
        {/* Left Section (motion) */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            bgcolor: "#000",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            px: { xs: 3, sm: 6, md: 10 },
            py: { xs: 4, sm: 6 },
            minHeight: { md: "100%" },
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <Typography
                variant="h4"
                fontWeight="bold"
                mr={1}
                sx={{ fontSize: { xs: "1.8rem", sm: "2rem", md: "2.3rem" } }}
              >
                100% Fee Free
              </Typography>
              <FlashOnIcon
                sx={{ color: "#fdd835", fontSize: { xs: 30, md: 36 } }}
              />
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: "#ccc",
                maxWidth: 500,
                mb: 4,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" },
                lineHeight: 1.7,
              }}
            >
              Our platform is free to use and the donors pay the credit card
              fees. Our missionaries receive 100% of the donations!
            </Typography>

            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={handleClick}
                size="medium"
                sx={{
                  backgroundColor: "#fdd835",
                  color: "#000",
                  transition: "all 0.3s ease",
                  border: "2px solid transparent",
                  ":hover": {
                    backgroundColor: "#000",
                    color: "#fdd835",
                    border: "2px solid #fdd835",
                  },
                }}
              >
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#fdd835",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Find | Fund | Resource
              </Typography>
            </Box>
          </motion.div>
        </Grid>

        {/* Right Section (motion image) */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#efeded",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.img
            src={sampleImage}
            alt="Happy Pic"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              width: "100%",
              height: "100%",
              maxHeight: isMdUp ? "100%" : "300px",
              objectFit: "cover",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FeeFreeSection;
