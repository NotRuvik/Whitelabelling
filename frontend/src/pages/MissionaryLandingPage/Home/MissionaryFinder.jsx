// import React from "react";
// import { Grid, Typography, Button, Box } from "@mui/material";
// import sampleImage from "../../../Assests/Images/image2.avif";
// import { styled } from "@mui/system";

// const ImageBox = styled("div")(({ highlight }) => ({
//   border: highlight ? "3px solid #FFD940" : "none",
//   padding: "5px",
//   borderRadius: "8px",
// }));

// const images = [{ src: sampleImage, highlight: false }];

// const MissionaryFinder = () => {
//   return (
//     <Box
//       sx={{
//         backgroundColor: "white",
//         display: "flex",
//         flexDirection: { xs: "column", md: "row" },
//         paddingX: 25,
//         paddingBottom: 10,
//         gap: { xs: 1, sm: 10 },
//       }}
//     >
//       {/* Left Panel */}
//       <Box
//         sx={{
//           backgroundColor: "#FFD940",
//           borderRadius: 4,
//           px: { xs: 2, sm: 4, md: 8 },
//           py: { xs: 2, sm: 3, md: 4 },
//           height: { xs: "auto", md: 400 },
//           width: { xs: "100%", md: 500 },
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "flex-start",
//         }}
//       >
//         <Typography
//           variant="h5"
//           sx={{
//             fontWeight: "bold",
//             mb: 2,
//             fontFamily: "ui-sans-serif",
//             fontSize: { xs: "1.2rem", sm: "1.5rem", md: "1.75rem" },
//           }}
//         >
//           BEGIN FINDING & FUNDING
//         </Typography>
//         <Typography
//           variant="body1"
//           sx={{
//             mb: 3,
//             fontFamily: "ui-sans-serif",
//             fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
//           }}
//         >
//           Find missionaries and Christian causes across the globe. Whether you want
//           to donate monthly or one-time, you can like, follow, and discover mission
//           movements on any continent and covering any discipline.
//         </Typography>
//         <Button
//           variant="contained"
//           sx={{
//             backgroundColor: "#fff",
//             color: "#FFD940",
//             fontWeight: "bold",
//             borderRadius: "10px",
//             fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
//             "&:hover": { border: "1px solid #e8a628", color: "#e8a628" },
//           }}
//         >
//           Search Now!
//         </Button>
//       </Box>
//       <Grid
//         item
//         xs={12}
//         md={6}
//         sx={{ px: { xs: 2, sm: 4, md: 8 }, mt: { xs: 2, md: 0 } }}
//       >
//         <Grid container spacing={2}>
//           {images.map((img, idx) => (
//             <Grid item xs={12} sm={6} md={4} key={idx}>
//               <ImageBox highlight={img.highlight}>
//                 <img
//                   src={img.src}
//                   alt={`user-${idx}`}
//                   style={{
//                     width: "100%",
//                     height: { xs: 200, sm: 300, md: 350 },
//                     borderRadius: "8px",
//                     objectFit: "cover",
//                   }}
//                 />
//               </ImageBox>
//             </Grid>
//           ))}
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default MissionaryFinder;
import React from "react";
import { Grid, Typography, Button, Box } from "@mui/material";
import sampleImage from "../../../Assests/Images/image2.avif";
import { styled } from "@mui/system";

const ImageBox = styled("div")(({ highlight }) => ({
  border: highlight ? "3px solid #FFD940" : "none",
  padding: "5px",
  borderRadius: "8px",
}));

const images = [
  { src: sampleImage, highlight: false },
  // { src: sampleImage, highlight: true },
  // { src: sampleImage, highlight: false },
];

const MissionaryFinder = () => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        px: { xs: 2, sm: 4, md: 10, lg: 20 },
        py: { xs: 4, md: 10 },
        gap: { xs: 4, md: 10 },
      }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          backgroundColor: "#FFD940",
          borderRadius: 4,
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 3, sm: 4, md: 5 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontFamily: "ui-sans-serif",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          }}
        >
          BEGIN FINDING & FUNDING
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            fontFamily: "ui-sans-serif",
            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
          }}
        >
          Find missionaries and Christian causes across the globe. Whether you want
          to donate monthly or one-time, you can like, follow, and discover mission
          movements on any continent and covering any discipline.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#fff",
            color: "#FFD940",
            fontWeight: "bold",
            borderRadius: "10px",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            px: 3,
            py: 1,
            "&:hover": {
              backgroundColor: "transparent",
              border: "1px solid #e8a628",
              color: "#e8a628",
            },
          }}
        >
          Search Now!
        </Button>
      </Box>

      {/* Right Panel - Images */}
      <Box sx={{ flex: 1 }}>
        <Grid container spacing={2}>
          {images.map((img, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <ImageBox highlight={img.highlight}>
                <Box
                  component="img"
                  src={img.src}
                  alt={`user-${idx}`}
                  sx={{
                    width: "100%",
                    height: { xs: 200, sm: 250, md: 300 },
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </ImageBox>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default MissionaryFinder;
