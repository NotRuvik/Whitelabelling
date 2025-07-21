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
  Chip,
  Select,
  Checkbox,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { updateUserDetails } from "../services/userService";
import { useAuth } from "../../src/contexts/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
// Reusable Labeled TextField Component
const LabeledTextField = ({
  label,
  value,
  onChange,
  name,
  disabled,
  type = "text",
  select = false,
  children,
}) => (
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
          height: "40px", // Consistent height for all text fields
          width: "200px", // Explicit width
          maxWidth: "200px", // Enforce max width
          // Ensure inner input element also aligns vertically
          "& input": {
            padding: "10px 14px", // Adjust padding to fine-tune vertical alignment
          },
          "& .MuiSelect-select": {
            padding: "10px 14px", // Adjust padding for select to match text input
          },
        },
        // Ensure dropdown options have sufficient width
        "& .MuiSelect-select": {
          minWidth: 150, // Minimum width for the selected value in dropdowns
        },
      }}
    >
      {children}
    </TextField>
  </Box>
);

const NpoProfilePage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  console.log("useruser", user);
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
    npoCommission: "",
    commission: [], // not "" or null
    newCommission: "",
    whiteLabelBrandLogo: null,
    whiteLabelBrandLogoPreview: null,
    profilePhoto: null,
    profilePhotoPreview: null,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");

  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const handleGoBack = () => {
    navigate(-1);
  };

  // useEffect(() => {
  //   const fetchOrganizationDetails = async () => {
  //     if (user && user.organizationId) {
  //       try {
  //         const response = await api.get(
  //           `/organizations/${user.organizationId}`
  //         );
  //         const orgData = response.data.data;
  //         setOrganization(orgData);

  //         const formattedDate = user.createdAt
  //           ? new Date(user.createdAt).toISOString().split("T")[0]
  //           : "";
  //         setFormData({
  //           firstName: user.firstName || "",
  //           lastName: user.lastName || "",
  //           email: user.email || "",
  //           yearOfRegistration: formattedDate || "",
  //           phone: user.phone || "",
  //           continent: user.continent || "",
  //           location: user.location || "",
  //           brandName: user?.organizationId?.brandName || "",

  //           // brandName: orgData.name || "",
  //           themeColor: orgData.themeColor || "",
  //           whiteLabelBrandLogo: null,
  //           whiteLabelBrandLogoPreview: orgData.logoUrl
  //             ? `${backendUrl}${orgData.logoUrl}`
  //             : null,
  //           profilePhoto: null,
  //           profilePhotoPreview: user.profilePhotoUrl
  //             ? `${backendUrl}${user.profilePhotoUrl}`
  //             : null,
  //         });
  //       } catch (err) {
  //         console.error("Failed to fetch organization details", err);
  //         setError("Could not load your organization's profile.");
  //       } finally {
  //         setPageLoading(false);
  //       }
  //     } else if (user) {
  //       setPageLoading(false);
  //     }
  //   };

  //   fetchOrganizationDetails();
  // }, [user, backendUrl]);

  useEffect(() => {
    if (user) {
      const formattedDate = user.createdAt
        ? new Date(user.createdAt).toISOString().split("T")[0]
        : "";

      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        yearOfRegistration: formattedDate || "",
        phone: user.phone || "",
        continent: user.continent || "",
        location: user.location || "",
        brandName: user?.organizationId?.brandName || "",
        npoCommission: user?.npoCommission || "",
        commission: Array.isArray(user?.commission)
          ? user.commission
          : user.commission
          ? [parseFloat(user.commission)]
          : [],
        themeColor: user.themeColor || "",
        whiteLabelBrandLogo: null, // Always start with null for file input
        whiteLabelBrandLogoPreview: user.whiteLabelBrandLogoUrl
          ? `${backendUrl}${user.whiteLabelBrandLogoUrl}`
          : null,
        profilePhoto: null, // Reset file input
        profilePhotoPreview: user.profilePhotoUrl
          ? `${backendUrl}${user.profilePhotoUrl}`
          : null, // Set initial preview
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
  const handlePhoneChange = (value, data, event, formattedValue) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
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
      id: user._id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      continent: formData.continent,
      location: formData.location,
      commission: formData.commission,
      npoCommission: formData.npoCommission,
      brandName: formData.brandName,
      themeColor: formData.themeColor,
      whiteLabelBrandLogo: formData.whiteLabelBrandLogo,
      profilePhoto: formData.profilePhoto,
    };

    try {
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
  const handleConnectStripe = async () => {
    if (!user?.organizationId) {
      setConnectError("Organization ID not found. Cannot connect to Stripe.");
      return;
    }

    setIsConnecting(true);
    setConnectError("");

    try {
      const response = await api.post(
        `/stripe/connect/onboard/${user.organizationId}`
      );

      const { url } = response.data.data;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("Could not retrieve the Stripe onboarding link.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "An error occurred while connecting to Stripe.";
      setConnectError(errorMessage);
      console.error("Stripe Connect Error:", err);
      setIsConnecting(false);
    }
  };

  const handleDisconnectStripe = async () => {
    try {
      await api.post("/stripe/connect/disconnect/npo");
      window.location.reload();
    } catch (err) {
      setError("Failed to disconnect Stripe.");
    }
  };

  const handleManageStripe = async () => {
    try {
      const res = await api.post("/stripe/connect/manage/npo");
      const url = res.data.data.url;
      if (url) window.location.href = url;
    } catch (err) {
      setError("Failed to load Stripe management link.");
    }
  };

  const isNpoUser = user?.role === "npo_admin";
  const isSuperUser = user?.role === "super_admin";
  const isMissionaryUser = user?.role === "missionary";
  const isDonorUser = user?.role === "donor";

  return (
    <Box
      sx={{ bgcolor: "#fff", minHeight: "100vh", py: 5, borderRadius: "12px" }}
    >
      <Container maxWidth="lg">
        {/* Welcome Section - Separate Box */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            bgcolor: "#f9f9f9",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            {" "}
            {/* Added justifyContent */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {" "}
              {/* Group Avatar and Name/Status */}
              <Avatar
                src={
                  formData.profilePhotoPreview ||
                  (user?.profilePhotoUrl
                    ? `${backendUrl}${user.profilePhotoUrl}`
                    : "")
                }
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
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#6e6e6e" }}
                >
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
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  textAlign: "center",
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
                  height: "40px",
                  minwidth: "150px",
                  maxWidth: "250px",
                  borderRadius: "8px",
                  textTransform: "none",
                  color: "text.secondary",
                  borderColor: "rgba(0, 0, 0, 0.23)",
                  "&:hover": {
                    borderColor: "rgba(0, 0, 0, 0.87)",
                  },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {formData.profilePhoto
                  ? formData.profilePhoto.name
                  : "Upload Photo"}
                <input
                  type="file"
                  hidden
                  name="profilePhoto"
                  onChange={handleProfilePhotoUpload}
                  accept="image/*"
                />
              </Button>
              {formData.profilePhotoPreview && (
                <Box
                  sx={{
                    mt: 1,
                    textAlign: "center",
                    width: "150px",
                    maxWidth: "150px",
                  }}
                >
                  <img
                    src={formData.profilePhotoPreview}
                    alt="Profile Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100px",
                      borderRadius: "4px",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        {/* Profile Update Form Section - Separate Box */}
        <Box
          sx={{
            p: 3,
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            bgcolor: "#f9f9f9",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#6e6e6e", mb: 3 }}
          >
            Update Profile Information
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {" "}
              {/* Inner Grid container for form fields */}
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
              {/* <Grid item xs={12} sm={4} md={3}>
                <LabeledTextField
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                />
              </Grid> */}
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
                    Phone Number
                  </Typography>
                  <PhoneInput
                    country={"us"}
                    value={formData.phone || ""}
                    onChange={handlePhoneChange}
                    //name="phone"
                    placeholder=""
                    inputProps={{
                      name: "phone",
                      required: true,
                      autoFocus: false,
                    }}
                    inputStyle={{
                      width: "200px",
                      maxWidth: "200px",
                      height: "40px",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      border: "1px solid #c4c4c4",
                      fontSize: "0.875rem",
                    }}
                    containerStyle={{
                      width: "200px",
                      maxWidth: "200px",
                    }}
                    buttonStyle={{
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                    }}
                  />
                </Box>
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
                      <MenuItem value="Asia" sx={{ minWidth: 150 }}>
                        Asia
                      </MenuItem>
                      <MenuItem value="Europe" sx={{ minWidth: 150 }}>
                        Europe
                      </MenuItem>
                      <MenuItem value="North America" sx={{ minWidth: 150 }}>
                        North America
                      </MenuItem>
                      <MenuItem value="South America" sx={{ minWidth: 150 }}>
                        South America
                      </MenuItem>
                      <MenuItem value="Africa" sx={{ minWidth: 150 }}>
                        Africa
                      </MenuItem>
                      <MenuItem value="Australia" sx={{ minWidth: 150 }}>
                        Australia
                      </MenuItem>
                      <MenuItem value="Antarctica" sx={{ minWidth: 150 }}>
                        Antarctica
                      </MenuItem>
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
                      <MenuItem value="blue" sx={{ minWidth: 150 }}>
                        Blue
                      </MenuItem>
                      <MenuItem value="green" sx={{ minWidth: 150 }}>
                        Green
                      </MenuItem>
                      <MenuItem value="red" sx={{ minWidth: 150 }}>
                        Red
                      </MenuItem>
                      <MenuItem value="purple" sx={{ minWidth: 150 }}>
                        Purple
                      </MenuItem>
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
                          height: "40px", // Consistent height
                          width: "200px", // Explicit width
                          maxWidth: "200px", // Enforce max width
                          borderRadius: "8px",
                          textTransform: "none",
                          color: "text.secondary",
                          borderColor: "rgba(0, 0, 0, 0.23)",
                          "&:hover": {
                            borderColor: "rgba(0, 0, 0, 0.87)",
                          },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {formData.whiteLabelBrandLogo
                          ? formData.whiteLabelBrandLogo.name
                          : "Upload Logo"}
                        <input
                          type="file"
                          hidden
                          name="whiteLabelBrandLogo"
                          onChange={handleLogoUpload}
                          accept="image/*"
                        />
                      </Button>

                      {formData.whiteLabelBrandLogoPreview && (
                        <Box
                          sx={{
                            mt: 1,
                            textAlign: "center",
                            width: "200px",
                            maxWidth: "200px",
                          }}
                        >
                          <img
                            src={formData.whiteLabelBrandLogoPreview}
                            alt="Brand Logo Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "150px",
                              borderRadius: "4px",
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </>
              )}
              {isSuperUser && (
                <Grid item xs={12} sm={8} md={6}>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, mb: 0.5, display: "block" }}
                  >
                    Commission Rates (%)
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <TextField
                      size="small"
                      placeholder="Add %"
                      value={formData.newCommission}
                      onChange={(e) => {
                        let input = e.target.value.replace(/[^0-9.]/g, "");
                        const parts = input.split(".");
                        if (parts.length > 2) input = parts[0] + "." + parts[1];
                        if (parts[1])
                          input = parts[0] + "." + parts[1].slice(0, 2);
                        setFormData((prev) => ({
                          ...prev,
                          newCommission: input,
                        }));
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                      sx={{ width: "120px" }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        const val = parseFloat(formData.newCommission);
                        if (
                          !isNaN(val) &&
                          val >= 0 &&
                          val <= 100 &&
                          !formData.commission.includes(val)
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            commission: [...prev.commission, val],
                            newCommission: "",
                          }));
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Box>

                 <Box
  sx={{
    mt: 1,
    display: "flex",
    gap: 1,
    flexWrap: "nowrap",              // prevent wrapping
    maxWidth: "200px",
    maxHeight: "40px",
    overflowX: "auto",               // enable horizontal scroll
    overflowY: "hidden",
    scrollbarWidth: "none",         // Firefox
    "&::-webkit-scrollbar": {
      display: "none",              // Chrome, Safari
    },
  }}
>
  {Array.isArray(formData.commission) &&
    formData.commission.map((val, idx) => (
      <Chip
        key={idx}
        label={`${val}%`}
        onDelete={() => {
          setFormData((prev) => ({
            ...prev,
            commission: prev.commission.filter((c) => c !== val),
          }));
        }}
        size="small"
      />
    ))}
</Box>

                </Grid>
              )}
              {/* {isSuperUser && (
                <Grid item xs={12} sm={8} md={6}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    Commission Rates (%)
                  </Typography>

                  <Select
                    multiple
                    value={formData.commission}
                    onChange={(e) => {
                      const {
                        target: { value },
                      } = e;

                      // Ensure only numbers, unique, and within 0–100
                      const filtered = [...new Set(value)]
                        .map((v) => parseFloat(v))
                        .filter((v) => !isNaN(v) && v >= 0 && v <= 100);

                      setFormData((prev) => ({
                        ...prev,
                        commission: filtered,
                      }));
                    }}
                    renderValue={(selected) =>
                      selected.map((v) => `${v}%`).join(", ")
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 40 * 4.5, // 4.5 items height
                          overflowY: "auto",
                          "&::-webkit-scrollbar": {
                            width: 0,
                            height: 0,
                          },
                          scrollbarWidth: "none", // Firefox
                          msOverflowStyle: "none", // IE
                        },
                      },
                    }}
                    sx={{
                      width: "100%",
                      maxWidth: 200,
                      height: "40px",
                      paddingTop: "20px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        //height: "auto",
                      },
                      "& .MuiSelect-select": {
                        padding: "10px 14px",
                        minHeight: "40px",
                      },
                    }}
                    size="small"
                    displayEmpty
                  >
                    {[0, 5, 10, 12, 15, 20, 25, 30, 50, 100].map((val) => (
                      <MenuItem key={val} value={val}>
                        <Checkbox
                          checked={formData.commission.indexOf(val) > -1}
                        />
                        <Typography variant="body2">{val}%</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              )} */}
              {isNpoUser && (
                <Grid item xs={12} sm={4} md={3}>
                  <LabeledTextField
                    label="Commission (%)"
                    name="npoCommission"
                    value={formData.npoCommission}
                    onChange={(e) => {
                      let input = e.target.value;

                      // Remove all invalid chars first
                      input = input.replace(/[^0-9.]/g, "");

                      // Only keep the first decimal point, remove extra
                      const parts = input.split(".");
                      if (parts.length > 2) {
                        input = parts[0] + "." + parts[1];
                      }

                      // Limit to 2 decimal places
                      if (parts[1]) {
                        parts[1] = parts[1].slice(0, 2);
                        input = parts[0] + "." + parts[1];
                      }

                      handleChange({
                        target: {
                          name: "npoCommission",
                          value: input,
                        },
                      });
                    }}
                    placeholder="0"
                    inputMode="decimal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              )}
            </Grid>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                color="inherit"
                size="medium"
                onClick={handleGoBack}
                sx={{ borderRadius: 5, px: 4, textTransform: "none" }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="medium"
                disabled={isSaving}
                sx={{ borderRadius: 5, px: 4, textTransform: "none" }}
              >
                {isSaving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
        {isNpoUser && (
          <Box
            sx={{
              mt: 3,
              bgcolor: "#fff",
            }}
          >
            {/* UPDATED: Check for the stripeConnectId on the 'organization' state object */}
            {user.organizationId?.stripeConnectId ? (
              <Alert
                severity="success"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                }}
                icon={false}
              >
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <img
                    src="https://stripe.com/img/v3/home/twitter.png" // Or your own Stripe logo
                    alt="Stripe Logo"
                    style={{ width: 32, height: 32, marginRight: 12 }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#14532d" }}
                    >
                      Payments Connected
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#166534" }}>
                      Your organization is ready to receive donations via
                      Stripe.
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 60 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ ml: 2 }}
                      onClick={handleManageStripe}
                    >
                      Edit Info
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      sx={{ ml: 2 }}
                      onClick={handleDisconnectStripe}
                    >
                      Disconnect
                    </Button>
                  </Box>
                </Box>
              </Alert>
            ) : (
              <Alert
                severity="warning"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "nowrap",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#fff7ed",
                  border: "1px solid #fdba74",
                }}
                icon={false}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="https://stripe.com/img/v3/home/twitter.png"
                    alt="Stripe Logo"
                    style={{
                      width: 32,
                      height: 32,
                      marginRight: 12,
                      borderRadius: 50,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, color: "#78350f" }}
                    >
                      Payments Not Connected
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#92400e" }}>
                      Connect your Stripe account to start receiving donations.
                    </Typography>
                  </Box>

                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      ml: 2,
                      backgroundColor: "#0a2540",
                      whiteSpace: "nowrap",
                    }}
                    onClick={handleConnectStripe}
                  >
                    Connect Stripe
                  </Button>
                </Box>
              </Alert>
            )}
          </Box>
        )}
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
