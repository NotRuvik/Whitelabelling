import React, { useState, useRef } from "react";
import {
  Stack,
  Typography,
  Divider,
  TextField,
  Chip,
  Grid,
  Button,
  Box,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon, Add as AddIcon } from "@mui/icons-material";
import {
  getMyProfile,
  updateMyProfile,
  uploadPageImages,
  deletePageImage,
} from "../../../services/missionary.service";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from "react";
const backendUrl = process.env.REACT_APP_API_URL;
const MainPageContent = () => {
  const { user, updateAuthUser } = useAuth();
  const ministryChips = [
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
  const [profileName, setProfileName] = useState("");
  const [about, setAbout] = useState("");
  const [selectedChips, setSelectedChips] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [socials, setSocials] = useState({
    facebookUrl: "",
    instagramUrl: "",
    videoUrl: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMyProfile();
        const data = response.data.data;
        const fullName = `${data.user?.firstName || ""} ${
          data.user?.lastName || ""
        }`.trim();
        setProfileName(fullName);

        setAbout(data.bio || "");
        setSelectedChips(new Set(data.ministryFocus || []));
        setSocials({
          facebookUrl: data.facebookUrl || "",
          instagramUrl: data.instagramUrl || "",
          videoUrl: data.videoUrl || "",
        });
        setImages(data.images || []);
      } catch (err) {
        setError("Could not load profile data.");
      }
    };
    loadProfile();
  }, []);

  const handleImageDelete = async (imageUrlToDelete) => {
    setIsSaving(true);
    try {
      await deletePageImage(imageUrlToDelete);
      setImages((prevImages) =>
        prevImages.filter((img) => img !== imageUrlToDelete)
      );
      setSuccess("Image deleted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete image.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await uploadPageImages(files);
      // Update state with the new complete list of images from the server
      setImages(response.data.data.images);
      setSuccess("Images uploaded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload images.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleChipClick = (chip) => {
    setSelectedChips((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chip)) newSet.delete(chip);
      else newSet.add(chip);
      return newSet;
    });
  };

  const handleSocialsChange = (e) => {
    setSocials({ ...socials, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!profileName.trim()) newErrors.profileName = true;
    if (!about.trim()) newErrors.about = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSaving(true);
    setSuccess("");
    setError("");

    const payload = {
      profileName,
      bio: about,
      ministryFocus: Array.from(selectedChips),
      ...socials,
    };

    try {
      const response = await updateMyProfile(payload);
      const updatedUser = response.data.data.user;
      if (
        user.firstName !== updatedUser.firstName ||
        user.lastName !== updatedUser.lastName
      ) {
        updateAuthUser({
          ...user,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
        });
      }
      setSuccess("Profile details saved successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save details.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        This information will be displayed on your public page, along with your
        name, continent, country (optional), and campaigns.
      </Typography>

      <Divider />

      <TextField
        placeholder="Profile Name or Pseudo Name"
        variant="outlined"
        fullWidth
        value={profileName}
        onChange={(e) => setProfileName(e.target.value)}
        error={!!errors.profileName}
        helperText={errors.profileName && "Please fill out this field."}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#fff",
          },
        }}
      />

      <TextField
        placeholder="ABOUT: Tell us about who you are, what you do, and who you serve."
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        error={!!errors.about}
        helperText={errors.about && "Please fill out this field."}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#fff",
          },
        }}
      />

      <Stack spacing={1}>
        <Typography variant="body2" color="text.secondary">
          Select all that apply to your ministry
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {ministryChips.map((label) => (
            <Chip
              key={label}
              label={label}
              onClick={() => handleChipClick(label)}
              variant={selectedChips.has(label) ? "filled" : "outlined"}
              sx={{
                borderRadius: "16px",
                px: 1.5,
                ...(selectedChips.has(label) && {
                  backgroundColor: "#C0A068",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#a98c5a" },
                }),
              }}
            />
          ))}
        </Box>
      </Stack>

      <Box
  sx={{
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
  }}
>
  {/* Facebook URL */}
  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" } }}>
    <TextField
      fullWidth
      placeholder="https://www.facebook.com/"
      name="facebookUrl"
      value={socials.facebookUrl}
      onChange={handleSocialsChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          backgroundColor: "#fff",
        },
      }}
    />
  </Box>

  {/* Instagram URL */}
  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" } }}>
    <TextField
      fullWidth
      placeholder="Instagram URL"
      name="instagramUrl"
      value={socials.instagramUrl}
      onChange={handleSocialsChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          backgroundColor: "#fff",
        },
      }}
    />
  </Box>

  {/* About Video URL */}
  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" } }}>
    <TextField
      fullWidth
      placeholder="About Video URL"
      name="videoUrl"
      value={socials.videoUrl}
      onChange={handleSocialsChange}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          backgroundColor: "#fff",
        },
      }}
    />
  </Box>

  {/* Upload Images Section */}
  <Box sx={{ flex: { xs: "1 1 100%", md: "1 1 48%" } }}>
    {/* <Typography
      variant="subtitle2"
      sx={{ fontWeight: 600, color: "#444", mb: 1 }}
    >
      Upload Images
    </Typography> */}

    <Button
      fullWidth
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={() => fileInputRef.current.click()}
      sx={{
        borderRadius: "12px",
        textTransform: "none",
        color: "#8a6e3c",
        height: 52,
        borderColor: "#C0A068",
        "&:hover": {
          borderColor: "#a98c5a",
          backgroundColor: "rgba(192, 160, 104, 0.04)",
        },
      }}
    >
      Upload Images
    </Button>

    <input
      type="file"
      ref={fileInputRef}
      hidden
      multiple
      accept="image/*"
      onChange={handleImageUpload}
    />

    {images.length > 0 && (
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          textDecoration: "underline",
          color: "#5f5f5f",
          cursor: "default",
        }}
      >
        {images.length} file{images.length > 1 ? "s" : ""} selected ✔
      </Typography>
    )}
  </Box>
</Box>

      {images.length > 0 && (
        <Box>
          {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            My Page Images
          </Typography> */}
          <Grid container spacing={2}>
            {images.map((imgUrl, index) => (
              <Grid item key={index} xs={6} sm={4} md={3}>
                {/* ✅ Wrap image in a relative Box to position the delete button */}
                <Box
                  sx={{
                    position: "relative",
                    "&:hover .delete-button": {
                      opacity: 1,
                    } /* Show on hover */,
                  }}
                >
                  <Box
                    component="img"
                    src={`${backendUrl}${imgUrl}`}
                    alt={`Missionary page content ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: 150,
                      borderRadius: "12px",
                      objectFit: "cover",
                    }}
                  />
                  {/* ✅ The Delete Button */}
                  <IconButton
                    className="delete-button"
                    size="small"
                    onClick={() => handleImageDelete(imgUrl)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      opacity: 0 /* Hide by default */,
                      transition: "opacity 0.2s",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      <Box sx={{ textAlign: "center", pt: 2 }}>
        <Button
          variant="outlined"
          onClick={handleSave}
          sx={{
            color: "#e57373",
            borderColor: "#e57373",
            borderRadius: "20px",
            textTransform: "none",
            px: 4,
            "&:hover": {
              borderColor: "#e57373",
              backgroundColor: "rgba(229, 115, 115, 0.04)",
            },
          }}
        >
          Save Details
        </Button>
      </Box>
      {success && <Alert severity="success">{success}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
    </Stack>
  );
};

export default MainPageContent;
