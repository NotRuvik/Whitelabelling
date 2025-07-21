// import React from "react";
// import { Container, Grid, Typography, Button } from "@mui/material";
// import { styled } from "@mui/system";
// import sampleImage from "../../../Assests/Images/image1.avif";
// import NavBar from "../components/NavBar";
// import "../MissionaryLanding.css";
// import FindFundResource from "./FindFundResource";
// import MissionaryFinder from "./MissionaryFinder";
// import ResourceSection from "./ResourceSection";
// import ForumScreen from "./ForumScreen";
// import ForumComponent from "./ForumScreen";
// import DonationCard from "./DonationCard";
// import FeeFreeSection from "./FeeFreeSection";

// const ImageBox = styled("div")(({ highlight }) => ({
//   border: highlight ? "3px solid #FFD940" : "none",
//   padding: "5px",
//   borderRadius: "8px",
// }));

// const Home = () => {
//   const images = [{ src: sampleImage, highlight: false }];

//   return (
//     <div>
//       <Grid
//         container
//         spacing={20}
//         alignItems="center"
//         sx={{  backgroundColor: "black", marginTop: "-40px" }}
//       >
//         {/* Left side text and buttons */}
//         <Grid item xs={12} md={6} mx={25} >
//           <Typography variant="h2" className="heading">
//             Find, fund,
//             <br />& resource
//           </Typography>
//           <Typography className="subheading" sx={{ mt: 3, mb: 4 }}>
//             Make the globe a bit brighter by helping
//             <br /> find and fund Christian missionary causes
//             <br /> around the globe.
//           </Typography>
//           <Button variant="contained" className="yellow-btn">
//             Get Funded
//           </Button>
//           <Button
//             variant="contained"
//             className="purple-btn"
//             endIcon={<span>→</span>}
//           >
//             Donate
//           </Button>
//         </Grid>

//         {/* Right side image grid */}
//         <Grid item xs={12} md={6} py={8} px={10}>
//           <Grid container spacing={2}>
//             {images.map((img, idx) => (
//               <Grid item xs={4} key={idx}>
//                 <ImageBox highlight={img.highlight}>
//                   <img
//                     src={img.src}
//                     alt={`user-${idx}`}
//                     style={{ width: "100%", borderRadius: "8px" }}
//                   />
//                 </ImageBox>
//               </Grid>
//             ))}
//           </Grid>
//         </Grid>
//       </Grid>
//       <FindFundResource />
//       <MissionaryFinder />
//       <ResourceSection />
//       <ForumComponent />
//       <DonationCard />
//       <FeeFreeSection />
//     </div>
//   );
// };

// export default Home;
import React from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import sampleImage from "../../../Assests/Images/image1.avif";
import FindFundResource from "./FindFundResource";
import MissionaryFinder from "./MissionaryFinder";
import ResourceSection from "./ResourceSection";
import ForumComponent from "./ForumScreen";
import DonationCard from "./DonationCard";
import FeeFreeSection from "./FeeFreeSection";
import "../MissionaryLanding.css";

const ImageBox = styled("div")(({ highlight }) => ({
  border: highlight ? "3px solid #FFD940" : "none",
  padding: "5px",
  borderRadius: "8px",
}));

const Home = () => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down("sm"));

  const images = [{ src: sampleImage, highlight: false }];

  return (
    <Box sx={{ backgroundColor: "black", pt: 8 }}>
      <Container maxWidth="xl">
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{
            pb: 8,
            flexDirection: { xs: "column-reverse", md: "row" },
          }}
        >
          {/* Left text and buttons */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              className="heading"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
              }}
            >
              Find, fund,
              <br />& resource
            </Typography>
            <Typography
              className="subheading"
              sx={{
                color: "white",
                mt: 3,
                mb: 4,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
              }}
            >
              Make the globe a bit brighter by helping
              <br /> find and fund Christian missionary causes
              <br /> around the globe.
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                className="yellow-btn"
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Get Funded
              </Button>
              <Button
                variant="contained"
                className="purple-btn"
                endIcon={<span>→</span>}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                Donate
              </Button>
            </Box>
          </Grid>

          {/* Right image */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2} justifyContent="center">
              {images.map((img, idx) => (
                <Grid item xs={10} sm={8} md={6} key={idx}>
                  <ImageBox highlight={img.highlight}>
                    <Box
                      component="img"
                      src={img.src}
                      alt={`user-${idx}`}
                      sx={{
                        width: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                        maxHeight: { xs: 200, sm: 300, md: 350 },
                      }}
                    />
                  </ImageBox>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Other Sections */}
      <FindFundResource />
      <MissionaryFinder />
      <ResourceSection />
      <ForumComponent />
      <DonationCard />
      <FeeFreeSection />
    </Box>
  );
};

export default Home;
