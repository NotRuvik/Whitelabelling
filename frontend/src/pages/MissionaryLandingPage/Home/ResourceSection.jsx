import React from "react";
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Grid } from "@mui/material";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import sampleImage from "../../../Assests/Images/image3.avif";

const ResourceSection = () => {
  const resources = [
    { name: "Prayer", icon: <EmojiPeopleIcon sx={{ color: "#FFC107" }} /> },
    { name: "Emotional Support", icon: <FavoriteIcon sx={{ color: "#FFC107" }} /> },
    { name: "Finances", icon: <AttachMoneyIcon sx={{ color: "#FFC107" }} /> },
    { name: "Services", icon: <VolunteerActivismIcon sx={{ color: "#FFC107" }} /> },
    { name: "Vacations", icon: <BeachAccessIcon sx={{ color: "#FFC107" }} /> },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        p: { xs: 1, sm: 2 },
        gap: { xs: 1, sm: 2 },
        backgroundColor: "#fff",
      }}
    >
      {/* Left Panel - Image */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{ pl: { xs: 2, sm: 10, md: 20 }, pr: { xs: 2, sm: 10, md: 15 } }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <img
              src={sampleImage}
              style={{
                width: "100%",
                height: { xs: 200, sm: 250, md: 300 },
                borderRadius: "8px",
                objectFit: "cover",
              }}
              alt="Resource"
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Right Section - Text and List */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mr: 1,
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              color: "black"
            }}
          >
            Resource
          </Typography>
          <FlashOnIcon sx={{ color: "#FFC107", fontSize: { xs: 24, md: 30 } }} />
        </Box>
        <Typography
          variant="body1"
          sx={{
            mb: 3,
            color: "text.secondary",
            fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
          }}
        >
          Our platform offers numerous ways to connect with and assist missionaries
          beyond monthly donations. We strongly believe in support that extends to
          the individuals behind the missions, not solely the causes they strive for.
        </Typography>
        <List>
          {resources.map((resource, index) => (
            <ListItem key={index} sx={{ py: 0.5, color: "text.secondary" }}>
              <ListItemIcon>{resource.icon}</ListItemIcon>
              <ListItemText
                primary={resource.name}
                primaryTypographyProps={{
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ResourceSection;