import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { updateUserDetails } from "../services/userService";
import { useAuth } from "../../src/contexts/AuthContext"; // Assuming this path is correct
import { useNavigate } from "react-router-dom";

// Reusable Labeled TextField Component
const LabeledTextField = ({ label, value, onChange, name, disabled, type = "text", select = false, children }) => (
  <Box>
    <Typography
      variant="caption"
      sx={{
        fontWeight: 600,
        color: "text.secondary",
        display: "block",
        mb: 0.5, // Small margin below label
      }}
    >
      {label}
    </Typography>
    <TextField
      // Removed fullWidth to allow explicit width setting
      variant="outlined"
      size="small"
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      type={type}
      select={select}
      InputLabelProps={type === "date" ? { shrink: true } : {}}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          height: '40px', // Consistent height for all text fields
          width: '200px', // Explicit width
          maxWidth: '200px', // Enforce max width
          // Ensure inner input element also aligns vertically
          '& input': {
            padding: '10px 14px', // Adjust padding to fine-tune vertical alignment
          },
          '& .MuiSelect-select': {
            padding: '10px 14px', // Adjust padding for select to match text input
          },
        },
        // Ensure dropdown options have sufficient width
        "& .MuiSelect-select": {
            minWidth: 150, // Minimum width for the selected value in dropdowns
        }
      }}
    >
      {children}
    </TextField>
  </Box>
);

const NpoProfilePage = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    yearOfRegistration: "",
    phone: "",
    continent: "",
    location: "",
    brandName: "",
    themeColor: "",
    whiteLabelBrandLogo: null,
    whiteLabelBrandLogoPreview: null,
    profilePhoto: null, 
    profilePhotoPreview: null,
  });
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
  };
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // Ensure process.env.REACT_APP_API_URL is correctly configured in your environment
  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      // Format the createdAt date into ISO-MM-DD for date input
      const formattedDate = user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "";

      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        yearOfRegistration: formattedDate || "",
        phone: user.phone || "",
        continent: user.continent || "",
        location: user.location || "",
        brandName: user?.organizationId?.brandName || "",
        themeColor: user.themeColor || "",
        whiteLabelBrandLogo: null, // Always start with null for file input
        whiteLabelBrandLogoPreview: user.whiteLabelBrandLogoUrl ? `${backendUrl}${user.whiteLabelBrandLogoUrl}` : null,
        profilePhoto: null, // Reset file input
        profilePhotoPreview: user.profilePhotoUrl ? `${backendUrl}${user.profilePhotoUrl}` : null, // Set initial preview
      });
    }
  }, [user, backendUrl]);

  if (!user) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        whiteLabelBrandLogo: file,
        whiteLabelBrandLogoPreview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        whiteLabelBrandLogo: null,
        whiteLabelBrandLogoPreview: null,
      }));
    }
  };

  // New handler for profile photo upload
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profilePhoto: file,
        profilePhotoPreview: URL.createObjectURL(file),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        profilePhoto: null,
        profilePhotoPreview: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    const updatedUserData = {
      id: user._id, // Pass the user ID
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      continent: formData.continent,
      location: formData.location,
      brandName: formData.brandName,
      themeColor: formData.themeColor,
      whiteLabelBrandLogo: formData.whiteLabelBrandLogo, // if any file, include it
      profilePhoto: formData.profilePhoto, // if any file, include it
    };

    try {
        // Call the updateUserDetails service function
        const response = await updateUserDetails(updatedUserData);
        setSuccess("Profile updated successfully!");
        // Optionally, refetch user data or update context after successful save
      } catch (err) {
        setError("Failed to update profile. Please try again.");
        console.error("Profile update error:", err);
      } finally {
        setIsSaving(false);
      }
    };

  const isNpoUser = user?.role === "npo_admin";

  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh", py: 5, borderRadius:"12px" }}>
      <Container maxWidth="lg">
        {/* Welcome Section - Separate Box */}
        <Box sx={{ mb: 4, p: 3, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between', mb: 2 }}> {/* Added justifyContent */}
            <Box sx={{ display: "flex", alignItems: "center" }}> {/* Group Avatar and Name/Status */}
              <Avatar
                src={formData.profilePhotoPreview || (user?.profilePhotoUrl ? `${backendUrl}${user.profilePhotoUrl}` : "")}
                sx={{
                  width: 90,
                  height: 90,
                  mr: 3,
                  bgcolor: "#e0e0e0",
                  fontSize: 40,
                }}
              >
                {user?.firstName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography
                  variant="caption"
                  sx={{ color: "gray", fontSize: 22, fontWeight: 500 }}
                >
                  Welcome
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#6e6e6e" }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 600, color: "#6e6e6e" }}
                >
                  Status: {user?.isBlocked ? "Inactive" : "Active"}
                </Typography>
              </Box>
            </Box>

            {/* Profile Photo Upload Component */}
            <Box sx={{ textAlign: 'right' }}> 
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  textAlign:"center",
                  color: "text.secondary",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Upload Profile Photo
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  height: '40px',
                  minwidth: '150px', 
                  maxWidth: '250px',
                  borderRadius: "8px",
                  textTransform: 'none',
                  color: 'text.secondary',
                  borderColor: 'rgba(0, 0, 0, 0.23)',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {formData.profilePhoto ? formData.profilePhoto.name : "Upload Photo"}
                <input
                  type="file"
                  hidden
                  name="profilePhoto"
                  onChange={handleProfilePhotoUpload}
                  accept="image/*"
                />
              </Button>
              {formData.profilePhotoPreview && (
                <Box sx={{ mt: 1, textAlign: 'center', width: '150px', maxWidth: '150px' }}>
                  <img
                    src={formData.profilePhotoPreview}
                    alt="Profile Preview"
                    style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '4px' }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Profile Update Form Section - Separate Box */}
        <Box sx={{ p: 3, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f9f9f9' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#6e6e6e", mb: 3 }}>
            Update Profile Information
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}> {/* Inner Grid container for form fields */}
              {/* User Information Fields - 3 items per row */}
              <Grid item xs={12} sm={4} md={3}>
                <LabeledTextField
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <LabeledTextField
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <LabeledTextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={3}>
                <LabeledTextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                />
              </Grid>

              {/* Conditionally show the White Label Fields for NPO users only */}
              {isNpoUser && (
                <>
                  <Grid item xs={12} sm={4} md={3}>
                    <LabeledTextField
                      label="Continent"
                      name="continent"
                      value={formData.continent}
                      onChange={handleChange}
                      select
                    >
                      <MenuItem value="" sx={{ minWidth: 150 }}>
                        <em>Choose a Continent</em>
                      </MenuItem>
                      <MenuItem value="Asia" sx={{ minWidth: 150 }}>Asia</MenuItem>
                      <MenuItem value="Europe" sx={{ minWidth: 150 }}>Europe</MenuItem>
                      <MenuItem value="North America" sx={{ minWidth: 150 }}>North America</MenuItem>
                      <MenuItem value="South America" sx={{ minWidth: 150 }}>South America</MenuItem>
                      <MenuItem value="Africa" sx={{ minWidth: 150 }}>Africa</MenuItem>
                      <MenuItem value="Australia" sx={{ minWidth: 150 }}>Australia</MenuItem>
                      <MenuItem value="Antarctica" sx={{ minWidth: 150 }}>Antarctica</MenuItem>
                    </LabeledTextField>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <LabeledTextField
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <LabeledTextField
                      label="Year of Registration"
                      name="yearOfRegistration"
                      value={formData.yearOfRegistration}
                      onChange={handleChange}
                      type="date"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <LabeledTextField
                      label="Brand Name"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <LabeledTextField
                      label="White Label Theme color"
                      name="themeColor"
                      value={formData.themeColor}
                      onChange={handleChange}
                      select
                    >
                      <MenuItem value="" sx={{ minWidth: 150 }}>
                        <em>Choose a Color</em>
                      </MenuItem>
                      <MenuItem value="blue" sx={{ minWidth: 150 }}>Blue</MenuItem>
                      <MenuItem value="green" sx={{ minWidth: 150 }}>Green</MenuItem>
                      <MenuItem value="red" sx={{ minWidth: 150 }}>Red</MenuItem>
                      <MenuItem value="purple" sx={{ minWidth: 150 }}>Purple</MenuItem>
                    </LabeledTextField>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3}>
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: "text.secondary",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        White Label Brand Logo
                      </Typography>
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        sx={{
                          height: '40px', // Consistent height
                          width: '200px', // Explicit width
                          maxWidth: '200px', // Enforce max width
                          borderRadius: "8px",
                          textTransform: 'none',
                          color: 'text.secondary',
                          borderColor: 'rgba(0, 0, 0, 0.23)',
                          '&:hover': {
                            borderColor: 'rgba(0, 0, 0, 0.87)',
                          },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {formData.whiteLabelBrandLogo ? formData.whiteLabelBrandLogo.name : "Upload Logo"}
                        <input
                          type="file"
                          hidden
                          name="whiteLabelBrandLogo"
                          onChange={handleLogoUpload}
                          accept="image/*"
                        />
                      </Button>
                      {formData.whiteLabelBrandLogoPreview && (
                        <Box sx={{ mt: 1, textAlign: 'center', width: '200px', maxWidth: '200px' }}>
                          <img
                            src={formData.whiteLabelBrandLogoPreview}
                            alt="Brand Logo Preview"
                            style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '4px' }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                size="medium"
                onClick={handleGoBack} 
                sx={{ borderRadius: 5, px: 4, textTransform: 'none' }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
                disabled={isSaving}
                sx={{ borderRadius: 5, px: 4, textTransform: 'none' }}
              >
                {isSaving ? <CircularProgress size={24} color="inherit" /> : "Update"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Success or Error Message */}
        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
        {error && !isSaving && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </Box>
  );
};

export default NpoProfilePage;
