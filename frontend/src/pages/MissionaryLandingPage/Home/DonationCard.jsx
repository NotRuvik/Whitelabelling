// import React from "react";
// import {
//   Box,
//   Button,
//   Container,
//   Typography,
//   Paper,
//   Avatar,
// } from "@mui/material";
// import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
// const DonationCard = () => {
//   return (
//     <Box
//       sx={{
//         backgroundColor: "#ffffff",
//         minHeight: "70vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         // px: 2,
//       }}
//     >
//       <Box
//         sx={{
//           backgroundColor: "#f2f1f1",
//           height: "60vh",
//           // width:700,
//           width: "100%",
//           margin: 5,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           px: 2,
//           borderRadius: "12px",
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             position: "relative",
//             textAlign: "center",
//             width: 600, // Sets width to 500px
//             height: 400, // Sets height to 300px
//             borderRadius: 6, // ✨ CHANGE: Significantly increased border radius for a softer look
//             backgroundColor: "#fff",
//             p: { xs: 3, md: 8 }, // ✨ CHANGE: Added responsive padding
//             pt: { xs: 6, md: 9 }, // ✨ CHANGE: Added more top padding to accommodate the icon
//           }}
//         >
//           {/* Top Icon in Circle */}
//           <Avatar
//             sx={{
//               // ✨ CHANGE: Updated color to a dark navy/charcoal
//               backgroundColor: "#1e293b",
//               width: 64, // ✨ CHANGE: Increased size
//               height: 64, // ✨ CHANGE: Increased size
//               position: "absolute",
//               top: -32, // ✨ CHANGE: Adjusted for new size
//               left: "50%",
//               transform: "translateX(-50%)",
//               border: "4px solid #fff", // ✨ CHANGE: Added a white border to lift it off the card
//             }}
//           >
//             {/* ✨ CHANGE: Swapped Rocket for a more appropriate icon */}
//             <img
//               src="https://em-content.zobj.net/source/twitter/376/party-popper_1f389.png"
//               alt="Party Popper"
//               style={{ width: "60%" }}
//             />
//           </Avatar>

//           <Box>
//             {/* ✨ CHANGE: Increased font size for more impact */}
//             <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
//               Can't wait to give to{" "}
//               <Box component="span" sx={{ color: "#facc15" }}>
//                 {" "}
//                 {/* ✨ CHANGE: Brighter yellow */}
//                 Nightbright?
//               </Box>
//             </Typography>

//             <Typography
//               variant="body1"
//               sx={{ mb: 4, color: "text.secondary", px: 2 }}
//             >
//               {" "}
//               {/* ✨ CHANGE: Adjusted variant and spacing */}
//               We completely understand. Simply click the button below to begin
//               supporting us directly!
//             </Typography>

//             <Button
//               variant="contained"
//               sx={{
//                 borderRadius: 999, // Pill shape
//                 pl: 4, // ✨ CHANGE: Use padding-left for text
//                 pr: 2, // ✨ CHANGE: Use padding-right for icon
//                 py: 1.5,
//                 textTransform: "none",
//                 fontSize: "1rem",
//                 fontWeight: "bold",
//                 backgroundColor: "#a78bfa", // Main purple color
//                 "&:hover": { backgroundColor: "#8b5cf6" },
//                 display: "inline-flex",
//                 alignItems: "center",
//               }}
//             >
//               Donate
//               {/* ✨ CHANGE: Replaced endIcon with a custom Box for better styling */}
//               <Box
//                 component="span"
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   width: 32,
//                   height: 32,
//                   borderRadius: "50%",
//                   backgroundColor: "rgba(0,0,0,0.1)", // Subtle darker circle for the icon
//                   ml: 2,
//                 }}
//               >
//                 <ArrowForwardIcon sx={{ fontSize: "1.2rem" }} />
//               </Box>
//             </Button>
//           </Box>
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default DonationCard;
import React from "react";
import { Box, Button, Typography, Paper, Avatar } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const DonationCard = () => {
  return (
    // 1. Main container for the grey background
    // Uses flexbox to perfectly center the card on the page.
    <Box
      sx={{
        backgroundColor: "#f8f9fa", // A light grey background like the image
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        p: 2, // Padding for small screens
        m: 8,
      }}
    >
      {/* 2. The white card itself */}
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          textAlign: "center",
          width: 600, // Sets width to 500px
          height: 400, // Sets height to 300px
          //  width: "100%",
          borderRadius: "16px", // Softer, more rounded corners
          backgroundColor: "#fff",
          p: 4, // Internal padding for content
          pt: 7, // Extra top padding to make space for the icon
        }}
      >
        {/* Top Icon in Circle */}
        <Avatar
          sx={{
            backgroundColor: "#1e293b", // Dark navy color
            width: 64,
            height: 64,
            position: "absolute",
            top: -32, // Positioned halfway outside the card
            left: "50%",
            transform: "translateX(-50%)",
            border: "4px solid #fff", // White border to lift it off
          }}
        >
          {/* Using an img tag for custom icons like the party popper */}
          <img
            src="https://em-content.zobj.net/source/twitter/376/party-popper_1f389.png"
            alt="Party Popper"
            style={{ width: "60%", height: "60%" }}
          />
        </Avatar>

        {/* Card Content */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1.5 }}>
            Can't wait to give to{" "}
            <Box component="span" sx={{ color: "#facc15" }}>
              Nightbright?
            </Box>
          </Typography>

          <Typography
            variant="body1"
            sx={{ mb: 4, color: "text.secondary", px: 2 }}
          >
            We completely understand. Simply click the button below to begin
            supporting us directly!
          </Typography>

          <Button
            variant="contained"
            sx={{
              borderRadius: 999, // Pill shape
              pl: 4,
              pr: 2,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "bold",
              backgroundColor: "#a78bfa",
              "&:hover": { backgroundColor: "#8b5cf6" },
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Donate
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.1)",
                ml: 2,
              }}
            >
              <ArrowForwardIcon sx={{ fontSize: "1.2rem" }} />
            </Box>
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DonationCard;
