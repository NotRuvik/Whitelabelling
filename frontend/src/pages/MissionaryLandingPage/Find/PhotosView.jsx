import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

const PhotosView = ({ photos, onPhotoClick }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <Typography variant="body1" sx={{ my: 2 }}>
        There are no photos to display.
      </Typography>
    );
  }

  const handleThumbnailClick = (index) => {
    setPrevIndex(selectedIndex);
    setSelectedIndex(index);
  };

  const handleBigImageClick = () => {
    onPhotoClick(selectedIndex);
  };

  const isNext = selectedIndex > prevIndex;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Photos
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left thumbnails inside a fixed scroll box */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
            maxHeight: 400,
            minWidth: 100,
            pr: 1,
            scrollbarWidth: "none", // Firefox
            "&::-webkit-scrollbar": {
              display: "none", // Chrome, Safari
            },
          }}
        >
          {photos.map((photo, idx) => (
            <Box
              key={idx}
              component="img"
              src={photo}
              alt={`Thumbnail ${idx + 1}`}
              sx={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 1,
                flexShrink: 0, // ✅ Fixes size
                border:
                  idx === selectedIndex
                    ? "2px solid #0077cc"
                    : "2px solid transparent",
                cursor: "pointer",
                transition: "border 0.3s",
              }}
              onClick={() => handleThumbnailClick(idx)}
            />
          ))}
        </Box>

        {/* Big image with slide effect */}
        <Box
  sx={{
    flexGrow: 1,
    overflow: "hidden",
    position: "relative",
    borderRadius: 2,
    height: 400, // ✅ Match left panel
    cursor: "pointer",
  }}
  onClick={handleBigImageClick}
>
  <Box
    sx={{
      display: "flex",
      width: "200%",
      height: "100%",
      transform: isNext ? "translateX(-50%)" : "translateX(0)",
      transition: "transform 0.5s ease",
    }}
  >
    <Box
      component="img"
      src={photos[prevIndex]}
      alt={`Prev Photo`}
      sx={{
        width: "50%",
        height: "100%",
        objectFit: "cover", // ✅ Fills the box
        px: 1,
      }}
    />
    <Box
      component="img"
      src={photos[selectedIndex]}
      alt={`Selected Photo`}
      sx={{
        width: "50%",
        height: "100%",
        objectFit: "cover", // ✅ Fills the box
        px: 1,
      }}
    />
  </Box>
</Box>
      </Box>
    </Box>
  );
};

export default PhotosView;
