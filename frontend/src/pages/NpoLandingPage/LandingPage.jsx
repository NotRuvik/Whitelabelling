import React from "react";
import "./LandingPage.css"; // Plain CSS
import backgroundPeopleImage from "../../Assests/heroimage dark.avif";
import backgroundImage from "../../Assests/tim-marshall-cAtzHUz7Z8g-unsplash.jpg";
import testimonialImage from "../../Assests/image3.png";
import findImages from "../../Assests/notes.png";
import fundImages from "../../Assests/calendar.png";
import ResourceImages from "../../Assests/smilies.png";
import NpoNavbar from "./NpoNavbar";
import NpoFooter from "./NpoFooter";
import { Box, Typography, Button,Grid, Stack, Container, Card, CardContent } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const navigate = useNavigate();
  const highlightColor = "#FFD700";
  return (
    <Box>
      <NpoNavbar />

      {/* Landing Section */}
      <Box
        sx={{
          position: "relative",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "100% 100%", 
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat", 
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            textAlign: "left",
            px: 4,
            maxWidth: "1200px",
            width: "100%",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Text Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
              Empowering <span style={{ color: highlightColor }}>Non Profits</span>{" "}
              to Make a Greater Impact
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Join thousands of changemakers using NightBright to collect
              donations, manage fundraising campaigns, and build meaningful
              donor relationships — all in one place. Whether you're a small
              charity or a global mission, our tools help you scale your impact
              effortlessly.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: highlightColor,
                color: "#000",
                fontWeight: "bold",
                borderRadius: "30px",
                px: 4,
                py: 1,
              }}
            >
              Learn More →
            </Button>
          </Box>

          {/* Image Section */}
          <Box sx={{ flex: 1,  }}>
            <img
              src={backgroundPeopleImage}
              alt="People"
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "16px",
              }}
            />
          </Box>
        </Box>
      </Box>
      {/* How It Works, Testimonials, Footer */}
    <Box
      sx={{
        backgroundColor: "#ffffff",
        py: 8,
        px: 2,
        mx: "auto",
        maxWidth: "1200px",
        borderRadius: 4,
      }}
    >
      {/* <Typography
        variant="h4"
        align="center"
        sx={{ mb: 6, fontWeight: 700 }}
      >
        How We Can <Box component="span" sx={{ color: "#1E40AF" }}>Help</Box> You?
      </Typography> */}
<Typography variant="h4"
        align="center"
        sx={{ mb: 6, fontWeight: 700 }}>
  How We Can <Box component="span" sx={{ color: highlightColor }}>Help</Box> You ?
</Typography>
<Typography  align="center" variant="body1" sx={{ my: 2 }}>
  Empower your nonprofit to accept donations online, reach more supporters, and manage your causes — all at one place.
</Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        justifyContent="center"
        alignItems="stretch"
        flexWrap="wrap"
      >
        {/* Card 1 */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            flex: { xs: "1 1 100%", md: "1 1 0" },
            maxWidth: { md: "33%" },
          }}
        >
          <Stack spacing={2} alignItems="flex-start">
            <Box
              sx={{
                backgroundColor: "#EEF2FF",
                width: 60,
                height: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 30, color: "#1E40AF" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Our Journey
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Since our beginning, we’ve grown with our clients — delivering reliable and innovative solutions for lasting impact.
            </Typography>
          </Stack>
        </Box>

        {/* Card 2 */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            flex: { xs: "1 1 100%", md: "1 1 0" },
            maxWidth: { md: "33%" },
          }}
        >
          <Stack spacing={2} alignItems="flex-start">
            <Box
              sx={{
                backgroundColor: "#FEF3C7",
                width: 60,
                height: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrackChangesIcon sx={{ fontSize: 30, color: "#F59E0B" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Our Purpose
            </Typography>
            <Typography variant="body1" color="text.secondary">
              We aim to align our goals with our partners’, focusing on delivering measurable results and meaningful change.
            </Typography>
          </Stack>
        </Box>

        {/* Card 3 */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 3,
            p: 4,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            flex: { xs: "1 1 100%", md: "1 1 0" },
            maxWidth: { md: "33%" },
          }}
        >
          <Stack spacing={2} alignItems="flex-start">
            <Box
              sx={{
                backgroundColor: "#FCE7F3",
                width: 60,
                height: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VisibilityIcon sx={{ fontSize: 30, color: "#DB2777" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Our Vision
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Looking ahead, we see a future where our services empower businesses to grow and communities to thrive globally.
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>

      {/* FEATURES */}
      <Box sx={{ py: 10, bgcolor: "#fff" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
          >
            Why Choose{" "}
            <Box component="span" sx={{ color: highlightColor }}>
              Us ?
            </Box>
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              "Simple and fast registration for NPOs",
              "Custom missionary pages for easy sharing",
              "Secure and reliable payment processing",
              "Built-in donor management and reporting",
              "Customizable donation goals and campaigns",
              "Community forum to connect donors and share updates",
              "Dynamic theme colors chosen by each NPO to match their brand"
            ].map((feature, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 2,
                    p: 3,
                  }}
                >
                  <Typography variant="body1">{feature}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CALL TO ACTION */}
      <Box sx={{ py: 10, textAlign: "center", bgcolor: "black" }}>
        <Container>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#fff"
            gutterBottom
          >
            Ready to Start Accepting Donations?
          </Typography>
          <Typography variant="h6" color="#ffffff" sx={{ mb: 4 }}>
            Join hundreds of nonprofits and missionaries growing their impact.
          </Typography>


           <Button
      variant="contained"
      size="large"
      onClick={() => navigate("/npoRegister")}  
      sx={{
        bgcolor: highlightColor,
        color: "#ffffff",
        "&:hover": { bgcolor: "#E0E7FF" },
        borderRadius: 2,
        px: 4,
        py: 1.5,
      }}
    >
      Register Your NPO Now
    </Button>
        </Container>
      </Box>
      <NpoFooter />
    </Box>
  );
};

export default LandingPage;
