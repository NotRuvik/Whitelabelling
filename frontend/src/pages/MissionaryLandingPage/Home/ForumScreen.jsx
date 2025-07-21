import React from "react";
import { Box, Typography, Divider, Grid } from "@mui/material";
import sampleImage from "../../../Assests/Images/image4.avif";

const ForumComponent = () => {
  return (
    <Box sx={{ margin: "0 auto", p: { xs: 2, sm: 3, md: 4 }, backgroundColor: "#000" }}>
      {/* Main Header */}
      <Box sx={{ mx: { xs: 2, sm: 8, md: 15 } }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "#fff",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          Forum
        </Typography>
        <Typography
          sx={{
            textAlign: "center",
            color: "#fff",
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
            px: { xs: 1, sm: 2 },
          }}
        >
          Our extensive forum allows you to connect with other missionaries from around the globe. Discover more about our forums.
        </Typography>
      </Box>

      <Divider sx={{ my: { xs: 2, sm: 3 }, bgcolor: "#fff" }} />
      <Grid
        container
        justifyContent="center"
        sx={{ px: { xs: 2, sm: 4, md: 8 }, mx: "auto" }}
      >
        <Grid item xs={12} sm={6} md={4}>
          <img
            src={sampleImage}
            alt="Forum"
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "8px",
              maxHeight: { xs: 150, sm: 200, md: 250 },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForumComponent;