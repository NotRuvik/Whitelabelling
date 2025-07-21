import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

const API_URL = process.env.REACT_APP_API_URL;

const AdvancedImageUpload = ({
  label,
  onFileSelect,
  initialImages = [],
  multiple = false,
  onRemoveExisting,
}) => {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // useEffect(() => {
  //   // This logic to set initial images is correct
  //   if (initialImages.length > 0) {
  //     const existing = initialImages.map(url => ({
  //       name: url,
  //       previewUrl: url.startsWith('http') ? url : `${API_URL}${url}`,
  //       isExisting: true,
  //     }));
  //     setFiles(existing);
  //   } else {
  //       setFiles([]);
  //   }
  // }, [initialImages]);
  useEffect(() => {
    if (initialImages.length > 0) {
      setFiles(initialImages);
    } else {
      setFiles([]);
    }
  }, [initialImages]);

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.previewUrl && file.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(file.previewUrl);
        }
      });
    };
  }, [files]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files || []);
    if (newFiles.length === 0) return;

    const enrichedFiles = newFiles.map((file) => ({
      fileObject: file,
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      isExisting: false,
    }));

    const updatedFiles = multiple
      ? [...files, ...enrichedFiles]
      : enrichedFiles;
    setFiles(updatedFiles);

    onFileSelect(
      updatedFiles.filter((f) => f.fileObject).map((f) => f.fileObject)
    );
  };

  const handleRemoveFile = (indexToRemove) => {
    const fileToRemove = files[indexToRemove];

    // 2. Call the onRemoveExisting function if the file was from the server
    if (fileToRemove.isExisting && onRemoveExisting) {
      // Pass back the original database path (e.g., /uploads/causes/...)
      onRemoveExisting(fileToRemove.name);
    }

    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);

    // Pass the updated list of NEW files back to the parent
    onFileSelect(
      updatedFiles.filter((f) => f.fileObject).map((f) => f.fileObject)
    );

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: "text.secondary",
          display: "block",
          mb: 0.5,
          textAlign: "left",
        }}
      >
        {label}
      </Typography>
      <Button
        component="label"
        sx={{
          borderRadius: "12px",
          height: "56px",
          borderColor: "gray",
          color: "#be965a",
          "&:hover": {borderColor: "#be965a"}, 
        }}
        variant="outlined"
        fullWidth
        startIcon={<AddIcon />}
      >
        {multiple ? "Add Images" : "Select Image"}
        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple={multiple}
        />
      </Button>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {files.map((file, index) => (
          <Grid item key={index}>
            <Box sx={{ position: "relative", width: 80, height: 80 }}>
              <Avatar
                src={file.previewUrl}
                variant="rounded"
                sx={{ width: "100%", height: "100%" }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemoveFile(index)}
                sx={{
                  position: "absolute",
                  top: -8,
                  right: -8,
                  backgroundColor: "white",
                  boxShadow: 1,
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdvancedImageUpload;
