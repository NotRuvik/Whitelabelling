import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const MissionaryCard = ({ missionary }) => {
  console.log("==========================?????????>>>>>>>>>", missionary);
  const { userId, baseId, country, _id, bio } = missionary;
  const name = userId ? `${userId.firstName} ${userId.lastName}` : "Name";
  const location = baseId?.location || "Unknown";
  const defaultImage =
    "https://static.wixstatic.com/media/fc3924_016887e883524a34897427a8fe9fb2c8~mv2.png/v1/fill/w_425,h_239,al_c,lg_1,q_85,enc_avif,quality_auto/Image-place-holder.png";
  const backendUrl = process.env.REACT_APP_API_URL;
  const profilePhoto = userId?.profilePhoto
    ? `${backendUrl}${userId.profilePhoto}`
    : defaultImage;
  const [isExpanded, setIsExpanded] = useState(false);

  const description =
    bio ||
    "Night Bright is a non-profit 501(c)3. We strive to make donating to your favorite causes an enjoyable experience that leads to a deeper connection with the thousands of beautiful people spreading the love of God throughout the globe. Please join us in making it easier to find, fund, and resource missions worldwide.";

  // Stop propagation to prevent navigation when clicking "Read more"
  const handleToggle = (e) => {
    e.preventDefault(); // Prevent the link from navigating
    e.stopPropagation(); // Stop the event from bubbling up to the RouterLink
    setIsExpanded(!isExpanded);
  };

  return (
    <RouterLink
      to={`/find-missionary-profile/${_id}`}
      style={{ textDecoration: "none" }}
    >
      <Card
        sx={{
          width: 320, // fixed width
          minHeight: 350, // fixed height
          m: 2,
          borderRadius: "12px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          color: "#333",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "transform 0.3s ease-in-out, boxShadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: 120,
            width: 120,
            objectFit: "cover",
            margin: "0 auto",
            mt: 2,
            borderRadius: "50%",
            border: "3px solid #E5A749",
          }}
          image={profilePhoto}
          alt={name}
        />
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            {name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationOn sx={{ fontSize: 18, mr: 0.5, color: "#00AEEF" }} />
            <Typography variant="body2" sx={{ fontStyle: "italic" }}>
              {country || "N/A"} | {location}
            </Typography>
          </Box>

          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              flexGrow: 1,
              mb: 1,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: isExpanded ? "none" : 4,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {description}
            </Typography>
            {!isExpanded && description.length > 120 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "30px",
                  background: "linear-gradient(rgba(255,255,255,0), #fff)",
                }}
              />
            )}
          </Box>

          {description.length > 105 && (
            <Button
              onClick={handleToggle}
              sx={{
                p: 0,
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 600,
                color: "#E5A749",
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              {isExpanded ? "Show less" : "Read more"}
            </Button>
          )}
        </CardContent>
      </Card>
    </RouterLink>
  );
};

export default MissionaryCard;
