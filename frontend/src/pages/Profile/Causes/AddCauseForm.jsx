import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AdvancedImageUpload from "./AdvancedImageUpload";
import { addCause, updateCause } from "../../../services/cause.service";
import { useAuth } from "../../../contexts/AuthContext";

// A styled version of TextField for consistent design
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
    "& fieldset": {
      borderColor: "#e0e0e0",
    },
    "&:hover fieldset": {
      borderColor: "#b0b0b0",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
  marginBottom: "16px",
}));

// A styled chip for category selection
const CategoryChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "selected",
})(({ selected }) => ({
  borderRadius: "16px",
  fontWeight: 500,
  border: "1px solid #be965a !important",
  color: selected ? "#fff" : "#be965a",
  backgroundColor: selected ? "#be965a" : "#fff",
  margin: "4px",
  transition: "all 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#be965a !important",
    color: "#fff !important",
  },
}));
const API_URL = process.env.REACT_APP_API_URL;
const AddCauseForm = ({ initialData, onSuccess, onCancel }) => {
  const isEditMode = Boolean(initialData);
  const { user } = useAuth();
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    goalAmount: "",
    deadline: null,
    videoUrl: "",
  });
  const [newMainImageFile, setNewMainImageFile] = useState(null);
  const [newOtherImageFiles, setNewOtherImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const categories = [
    "Aid",
    "Children",
    "Church Planting",
    "Conservation",
    "Construction",
    "Disaster Response",
    "Event",
    "Language School",
    "Marriage/Family",
    "Medical",
    "Sex Trafficking",
    "Unreached People/Evangelism",
    "Vocational Training",
    "Other",
  ];
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Generic handler to update state for all text inputs
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Toggles a category's selection status
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormValues({
        name: initialData.name || "",
        description: initialData.description || "",
        goalAmount: initialData.goalAmount || "",
        deadline: initialData.deadline ? new Date(initialData.deadline) : null,
        videoUrl: initialData.videoUrl || "",
      });
      setSelectedCategories(initialData.ministryType || []);
      setExistingImages(initialData.images || []); // Set all existing image URLs
    }
  }, [initialData, isEditMode]);
  const handleRemoveExistingImage = (imagePathToRemove) => {
    // Remove from the list of currently displayed existing images
    setExistingImages((prev) =>
      prev.filter((path) => path !== imagePathToRemove)
    );
    // Add to the list of images that will be deleted on the backend
    setImagesToDelete((prev) => [...prev, imagePathToRemove]);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.name || !formValues.goalAmount) {
      setError("Cause Title and Goal Amount are required.");
      return;
    }
    if (!isEditMode && !newMainImageFile) {
      setError("A Main Image is required when creating a new cause.");
      return;
    }
    if (isEditMode && existingImages.length === 0 && !newMainImageFile) {
      setError("A Main Image is required.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    Object.keys(formValues).forEach((key) =>
      formData.append(key, formValues[key] || "")
    );

    formData.append("categories", JSON.stringify(selectedCategories));
    if (imagesToDelete.length > 0) {
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    formData.append("existingImages", JSON.stringify(existingImages));
    if (newMainImageFile) formData.append("mainImage", newMainImageFile);
    newOtherImageFiles.forEach((file) => formData.append("otherImages", file));

    try {
      if (isEditMode) {
        await updateCause(initialData._id, formData);
        setSuccess("Cause updated successfully!");
      } else {
        await addCause(formData);
        setSuccess("Cause created successfully!");
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const displayedOtherImages = [
    ...existingImages.slice(1).map((url) => ({
      name: url,
      previewUrl: `${API_URL}${url}`,
      isExisting: true,
    })),
    ...newOtherImageFiles.map((file) => ({
      name: file.name,
      previewUrl: URL.createObjectURL(file),
      fileObject: file,
      isExisting: false,
    })),
  ];
  // 🔑 Always build displayed main image:
  const displayedMainImage = [];

  if (existingImages[0]) {
    displayedMainImage.push({
      name: existingImages[0],
      previewUrl: `${API_URL}${existingImages[0]}`,
      isExisting: true,
    });
  }
  if (newMainImageFile) {
    displayedMainImage.push({
      name: newMainImageFile.name,
      previewUrl: URL.createObjectURL(newMainImageFile),
      fileObject: newMainImageFile,
      isExisting: false,
    });
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 3, maxWidth: "800px", margin: "0 auto" }}
    >
      {!isEditMode && (
        <>
          <Typography variant="body1" paragraph>
            Start a new campaign to raise money for a specific missional event
            or trip.
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4 }}>
            Need instructions? Find them{" "}
            <a href="#" style={{ color: "#d9534f", fontWeight: "bold" }}>
              here!
            </a>
          </Typography>
        </>
      )}

      <StyledTextField
        fullWidth
        placeholder="Cause Title"
        name="name"
        value={formValues.name}
        onChange={handleChange}
        required
      />

      <StyledTextField
        fullWidth
        placeholder="Campaign Description"
        name="description"
        value={formValues.description}
        onChange={handleChange}
        multiline
        rows={4}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px", mb: 3 }}>
        <Box sx={{ width: "calc(50% - 8px)", mb: 2 }}>
          <AdvancedImageUpload
            label="Main Image"
            onFileSelect={(files) => setNewMainImageFile(files[0] || null)}
            initialImages={displayedMainImage} //initialImages={existingImages.slice(0, 1)}
            onRemoveExisting={() =>
              handleRemoveExistingImage(existingImages[0])
            }
          />
        </Box>
        <Box sx={{ width: "calc(50% - 8px)", mb: 2, }}>
          <AdvancedImageUpload
            label="Other Images"
            onFileSelect={setNewOtherImageFiles}
            initialImages={displayedOtherImages}
            //initialImages={existingImages.slice(1)}
            onRemoveExisting={handleRemoveExistingImage}
            multiple
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "16px", mb: 3 }}>
        <StyledTextField
          placeholder="Enter the Amount You Need to Raise"
          name="goalAmount"
          value={formValues.goalAmount}
          onChange={handleChange}
          type="number"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          sx={{ width: "calc(50% - 8px)" }}
          required
        />
        <DatePicker
          label="Select a deadline"
          value={formValues.deadline}
          onChange={(newValue) =>
            setFormValues((prev) => ({ ...prev, deadline: newValue }))
          }
          renderInput={(params) => (
            <StyledTextField {...params} sx={{ width: "calc(50% - 8px)" }} />
          )}
        />
      </Box>

      <StyledTextField
        fullWidth
        placeholder="Video URL (e.g., YouTube, Vimeo)"
        name="videoUrl"
        value={formValues.videoUrl}
        onChange={handleChange}
      />

      <Typography variant="body1" sx={{ my: 2, mx: 1 }}>
        Select all that apply to your ministry
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", mb: 4 }}>
        {categories.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            selected={selectedCategories.includes(category)}
            onClick={() => handleCategoryToggle(category)}
            variant="outlined"
          />
        ))}
      </Box>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        {isEditMode && (
          <Button
            variant="outlined"
            color="error"
            sx={{
              borderRadius: "50px",
              px: 5,
              mr: 2,
              textTransform: "none",
              fontWeight: 600,
              borderWidth: "2px",
              "&:hover": {
                borderWidth: "2px",
                bgcolor: "rgba(217, 83, 79, 0.04)",
              },
            }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <Button
          type="submit"
          variant="outlined"
          //color="#bfa76f"
          size="large"
          disabled={isSubmitting}
          sx={{
            borderRadius: "50px",
            px: 5,
            color: "#bfa76f",
            borderColor: "#bfa76f",
            textTransform: "none",
            fontWeight: 600,
            borderWidth: "2px",
            "&:hover": {
              borderWidth: "2px",

              bgcolor: "rgba(149, 133, 98, 0.1)",
            },
          }}
        >
          {isSubmitting ? (
            <CircularProgress size={24} />
          ) : isEditMode ? (
            "Update Cause"
          ) : (
            "Submit Cause"
          )}
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default AddCauseForm;
