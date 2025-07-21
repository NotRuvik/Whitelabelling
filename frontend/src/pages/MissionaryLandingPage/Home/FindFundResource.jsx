import React from "react";
import { Container, Grid, Typography, Box } from "@mui/material";

const cardData = [
  {
    title: "FIND",
    description:
      "Missionaries work with thousands of churches and organizations worldwide. Our goal is to create a central hub to discover, equip, fund, and connect them.",
  },
  {
    title: "FUND",
    description:
      "Giving to missions should not be limited to one-time and on-going giving. What about family needs, special trips, activities, or life wants. We help uncap your giving desires.",
  },
  {
    title: "RESOURCE",
    description:
      "Engage with other missionaries in meaningful discussions, share valuable insights from your experiences, and build partnerships that strengthen your missional work.",
  },
];

const FindFundResource = () => {
  return (
    <Box  sx={{ backgroundColor: "white", py: 20}}>
      <Grid container spacing={4} justifyContent="center">
        {cardData.map((card, index) => (
          <Grid item xs={12} sm={4} md={4} key={index}>
            <Box
              sx={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "24px",
                textAlign: "center",
                height: "350px",
                width:"300px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: "bold",
                  color: "#333",
                  letterSpacing: "0.05em",
                }}
              >
                {card.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  lineHeight: 1.7,
                  fontSize: "0.95rem",
                }}
              >
                {card.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FindFundResource;