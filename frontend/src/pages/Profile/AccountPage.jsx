import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  MenuItem,
  Link as MuiLink,
  Select,
  useMediaQuery,
  useTheme,
  Modal,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import {
  getMyProfile,
  updateMyProfile,
  uploadProfilePicture,
  uploadVerificationDocument,
  deleteVerificationDocument,
} from "../../services/missionary.service";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StarIcon from "@mui/icons-material/Star";
import {
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { SurveyScreen } from "./YearlyService";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { format } from "date-fns";
import { updateUserDetails } from "../../services/userService";
const LabeledTextField = ({ label, ...props }) => (
  <Box>
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      {...props}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          height: "46px",
          marginBottom: "15px",
          backgroundColor: props.disabled ? "#f4f6f8" : "#fff",
        },
      }}
    />
  </Box>
);

const labels = ["Yearly Survey", "Pastoral Reference", "Family Reference"];

const AccountPage = () => {
  const { user, updateAuthUser } = useAuth();
  // const [formData, setFormData] = useState({
  //   phone: "",
  //   websiteUrl: "",
  //   startedDate: "",
  //   ministryTaxId: "",
  //   country: "",
  //   commission: "",
  //   continent: "",
  //   verificationDocumentUrl: "",
  // });
    const [formData, setFormData] = useState({});
  const documentInputRef = useRef(null);
  // const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openInstructions, setOpenInstructions] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [view, setView] = useState("account");
  const [pastoralFile, setPastoralFile] = useState(null);
  const [familyFile, setFamilyFile] = useState(null);

  const pastoralInputRef = React.useRef();
  const familyInputRef = React.useRef();
  // const loadProfile = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await getMyProfile();
  //     const profileData = response.data.data;
  //     const data = response.data.data;
  //     setFormData({
  //       ...profileData,
  //       startedDate: profileData.startedDate
  //         ? profileData.startedDate.split("T")[0]
  //         : "",
  //       ministryName: profileData.organizationId?.name || "",
  //       websiteUrl: data.websiteUrl || "",
  //       startedDate: data.startedDate ? data.startedDate.split("T")[0] : "",
  //       ministryTaxId: data.ministryTaxId || "",
  //       phone: data.user?.phone || "",
  //       country: data.user?.country || "",
  //       continent: data.user?.continent || "",
  //       commission: data.userId.commission || "",
  //       verificationDocumentUrl: data.verificationDocumentUrl || "",
  //     });
  //   } catch (err) {
  //     setError("Failed to load profile.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   loadProfile();
  // }, [user]);
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const { data } = await getMyProfile();
        const missionary = data.data;
        setFormData({
          phone: missionary?.user?.phone || "",
          country: missionary?.user?.country || "",
          continent: missionary?.user?.continent || "",
          missionaryCommission: missionary?.user?.missionaryCommission || "",
          startedDate: missionary?.startedDate?.split("T")[0] || "",
          websiteUrl: missionary?.websiteUrl || "",
          ministryTaxId: missionary?.ministryTaxId || "",
          verificationDocumentUrl: missionary?.verificationDocumentUrl || "",
          ministryName: missionary?.organizationId?.name || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSaving(true);
  //   setError("");
  //   setSuccess("");
  //   try {
  //     await updateMyProfile(formData);
  //     setSuccess("Profile updated successfully!");
  //   } catch (err) {
  //     console.error(err);
  //     setError(err.response?.data?.message || "Failed to save profile.");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  // Updated handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSaving(true);
  setError("");
  setSuccess("");

  try {
    // This updates missionary-specific fields
    const missionaryData = {
      phone: formData.phone,
      websiteUrl: formData.websiteUrl,
      startedDate: formData.startedDate,
      ministryTaxId: formData.ministryTaxId,
      country: formData.country,
      continent: formData.continent,
      // Add any other fields that belong to the missionary model
    };
    await updateMyProfile(missionaryData);

    // This specifically updates the commission on the user model
    if (formData.missionaryCommission !== undefined) {
      await updateUserDetails({
        id: user._id,
        missionaryCommission: formData.missionaryCommission,
      });
    }

    setSuccess("Profile updated successfully!");

  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Failed to save profile.");
  } finally {
    setIsSaving(false);
  }
};
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await uploadProfilePicture(file);
      const { profilePhotoUrl } = response.data.data.user;

      updateAuthUser({
        ...user,
        profilePhotoUrl: profilePhotoUrl,
      });

      setSuccess("Profile picture updated!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload photo.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleDocumentUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsSaving(true);
    try {
      const response = await uploadVerificationDocument(file);
      setFormData((prev) => ({
        ...prev,
        verificationDocumentUrl: response.data.data.verificationDocumentUrl,
      }));
      setSuccess("Document uploaded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handler for document deletion
  const handleDocumentDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your verification document?"
      )
    )
      return;
    setIsSaving(true);
    try {
      await deleteVerificationDocument();
      setFormData((prev) => ({ ...prev, verificationDocumentUrl: "" }));
      setSuccess("Document deleted successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete document.");
    } finally {
      setIsSaving(false);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handlePhoneChange = (phone) => {
    setFormData({ ...formData, phone: phone });
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSaving(true);
  //   setError("");
  //   setSuccess("");
  //   try {
  //     await updateMyProfile(formData);
  //     setSuccess("Profile updated successfully!");
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Failed to save profile.");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  const handleSaveCommission = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateUserDetails({
        id: user._id,
        commission: formData.commission,
      });
      setSuccess("Commission updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update commission.");
    } finally {
      setIsSaving(false);
    }
  };

  // Show survey view
  if (view === "survey") {
    return (
      <Box sx={{ py: 3, marginX: 15 }}>
        {/* <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <BackButton onClick={() => setView("account")} />
        </Box> */}
        <SurveyScreen setView={setView} />
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ py: 3, marginX: 15 }}>
        <Typography variant="body2" sx={{ mb: 3 }}>
          *Only after all the required fields are completed can users donate to
          you.{" "}
          <MuiLink
            component="button"
            onClick={() => setOpenInstructions(true)}
            underline="always"
            sx={{ color: "text.primary", fontWeight: "bold" }}
          >
            See instructions.
          </MuiLink>
        </Typography>

        {/* Each Box below represents a single row, using Flexbox for layout */}
        <Box
          sx={{
            display: "flex",
            gap: 12,
            flexDirection: { xs: "column", sm: "row" },
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <LabeledTextField
              label="Full Name"
              value={`${user?.firstName || ""} ${user?.lastName || ""}`}
              disabled
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            {/* <LabeledTextField
              label="Phone number"
              placeholder="Phone number"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
            /> */}
            <PhoneInput
              country={"us"}
              value={formData.phone || ""}
             onChange={(phone) =>
    setFormData((prev) => ({ ...prev, phone: phone }))
  }
             // onChange={handlePhoneChange}
              name="phone"
              // onBlur={handleBlur}
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: false,
              }}
              inputStyle={{
                width: "100%",
                height: 44,
                borderRadius: 8,
              }}
              buttonStyle={{
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
              containerStyle={{
                width: "100%",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 12,
            flexDirection: { xs: "column", sm: "row" },
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <LabeledTextField
              label="Email"
              value={user?.email || ""}
              disabled
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LabeledTextField
              label="Website URL"
              placeholder="Website URL"
              name="websiteUrl"
              value={formData.websiteUrl || ""}
              onChange={(e) =>
    setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))
  }
              //onChange={handleChange}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 12,
            flexDirection: { xs: "column", sm: "row" },
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <LabeledTextField
              label="When you became a missionary"
              name="startedDate"
              type="date"
              value={formData.startedDate || ""}
              onChange={(e) =>
    setFormData((prev) => ({ ...prev, startedDate: e.target.value }))
  }
              //onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <LabeledTextField
              label="Ministry's name you are missionary for"
              name="ministryName"
              value={formData.ministryName || ""}
              disabled
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 12,
            flexDirection: { xs: "column", sm: "row" },
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <LabeledTextField
              label="Ministry's Tax ID number you are a mission..."
              placeholder="Ministry's Tax ID"
              name="ministryTaxId"
              value={formData.ministryTaxId || ""}
              onChange={(e) =>
    setFormData((prev) => ({ ...prev, ministryTaxId: e.target.value }))
  }
              //onChange={handleChange}
            />
          </Box>
          <Box sx={{ flex: 1, alignSelf: "flex-end", pb: "1px" }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              onClick={() => documentInputRef.current.click()}
              sx={{
                height: 46,
                marginBottom: "15px",
                borderColor: "rgba(0, 0, 0, 0.23)",
                color: "text.primary",
                borderRadius: "12px",
                textTransform: "none",
                justifyContent: "flex-start",
                px: 1.5,
              }}
            >
              <AddIcon sx={{ mr: 1 }} />
              Drivers License or Passport
            </Button>
            {formData.verificationDocumentUrl && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px dashed grey",
                  borderRadius: "8px",
                  px: 2,
                  py: 1,
                  mb: 2,
                }}
              >
                <Typography
                  component="a"
                  href={`${process.env.REACT_APP_API_URL}${formData.verificationDocumentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    textDecoration: "none",
                    color: "text.primary",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {formData.verificationDocumentUrl
                    .toLowerCase()
                    .endsWith(".pdf")
                    ? "View Uploaded PDF"
                    : "View Uploaded Image"}
                </Typography>

                <IconButton
                  onClick={handleDocumentDelete}
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}

            <input
              type="file"
              hidden
              ref={documentInputRef}
              onChange={handleDocumentUpload}
              accept="image/jpeg, image/png, image/gif, image/webp, application/pdf"
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 12,
            flexDirection: { xs: "column", sm: "row" },
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <LabeledTextField
              label="Country"
              placeholder="Country"
              name="country"
              value={formData.country || ""}
              onChange={(e) =>
    setFormData((prev) => ({ ...prev, country: e.target.value }))
  }
              //onChange={handleChange}
            />
          </Box>
          <Box sx={{ flex: 1, alignSelf: "flex-end", pb: "1px" }}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                height: 46,
                marginBottom: "15px",
                backgroundColor: "#ef4444",
                color: "white",
                borderRadius: "12px",
                textTransform: "none",
                p: 0.5,
                "&:hover": { backgroundColor: "#dc2626" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexGrow: 1,
                  pl: 1,
                }}
              >
                <AddIcon sx={{ mr: 1 }} />
                Profile Picture
              </Box>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "white",
                  borderRadius: "8px",
                }}
              />
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 12,
            flexDirection: { xs: "column", sm: "row" },
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Select
              fullWidth
              name="continent"
              value={formData.continent || ""}
              onChange={(e) =>
    setFormData((prev) => ({ ...prev, continent: e.target.value }))
  }
             // onChange={handleChange}
              displayEmpty
              size="small"
              sx={{
                height: 46,
                marginBottom: "15px",
                borderRadius: "12px",
                backgroundColor: "#fee2e2",
                "& .MuiOutlinedInput-notchedOutline": { border: 0 },
              }}
            >
              <MenuItem value="" disabled>
                <em>Choose a continent</em>
              </MenuItem>
              {[
                "Africa",
                "Asia",
                "Europe",
                "North America",
                "Oceania",
                "South America",
              ].map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ flex: 1, alignSelf: "flex-end", pb: "1px" }}>
            <Button
              variant="text"
              endIcon={<ChevronRightIcon />}
              sx={{
                height: 46,
                marginBottom: "15px",
                textTransform: "none",
                color: "#9e9e9e",
                borderBottom: "1px solid #ccc",
                borderRadius: 0,
                p: 0,
                lineHeight: 1,
              }}
            >
              Deactivate Account
            </Button>
          </Box>
        </Box>
        <Box sx={{ width: "45%" }}>
          <LabeledTextField
            label="Commission (%)"
            name="missionaryCommission"
            value={formData.missionaryCommission}
            onChange={(e) => {
              let input = e.target.value;
              input = input.replace(/[^0-9.]/g, "");
              const parts = input.split(".");
              if (parts.length > 2) {
                input = parts[0] + "." + parts[1];
              }
              if (parts[1]) {
                parts[1] = parts[1].slice(0, 2);
                input = parts[0] + "." + parts[1];
              }
              setFormData((prev) => ({ ...prev, missionaryCommission: input }));
            }}
            placeholder="0"
            inputMode="decimal"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary" }}
          >
            * Missionary can set commission percentage
          </Typography>
        </Box>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          {/* <Button
            type="submit"
            variant="outlined"
            color="error"
            size="medium"
            disabled={isSaving}
            onClick={handleSaveCommission}
            sx={{ borderRadius: "20px", px: 4, textTransform: "none" }}
          >
            {isSaving ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save Details"
            )}
          </Button> */}
          <Button
    type="submit"
    variant="contained"
    size="medium"
    disabled={isSaving}
    sx={{ borderRadius: "20px", px: 4, textTransform: "none" }}
  >
    {isSaving ? (
      <CircularProgress size={24} color="inherit" />
    ) : (
      "Save Details"
    )}
  </Button>
        </Box>

        {/* Verification Stars Section */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="subtitle2"
            sx={{ color: "#b38b00", fontWeight: 600, mb: 1 }}
          >
            Earn Verification Stars
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <StarIcon sx={{ color: "#FFD700", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Earn a star for every piece of verification you provide. Visitors
              will not have access to this information.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              mb: 2,
              justifyContent: "center",
            }}
          >
            {labels.map((label, i) => {
              const isSurvey = label === "Yearly Survey";
              const isPastoral = label === "Pastoral Reference";
              const isFamily = label === "Family Reference";
              const handleFileClick = () => {
                if (isPastoral) pastoralInputRef.current.click();
                if (isFamily) familyInputRef.current.click();
              };
              return (
                <Button
                  key={i}
                  variant="outlined"
                  onClick={() => {
                    if (isSurvey) {
                      setView("survey");
                    } else {
                      handleFileClick();
                    }
                  }}
                  startIcon={<AddIcon />}
                  sx={{
                    borderColor: "#b38b00",
                    color: "#b38b00",
                    textTransform: "none",
                    borderRadius: 2,
                    px: 4,
                    fontSize: "1rem",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "#fff7e6",
                      borderColor: "#b38b00",
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",

            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            mt: 4,
          }}
        >
          <Typography
            variant="caption"
            fontSize={13}
            color="text.secondary"
            fontStyle="italic"
          >
            Last submitted:
          </Typography>
          <Typography
            variant="caption"
            fontSize={13}
            color="text.secondary"
            //fontStyle="italic"
          >
            Join Date:{" "}
            {formData.startedDate
              ? format(new Date(formData.startedDate), "MMMM d, yyyy")
              : "N/A"}
          </Typography>
        </Box>

        {/* Alerts */}
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
      </Box>

      {/* Instructions Modal */}
      <Modal open={openInstructions} onClose={() => setOpenInstructions(false)}>
        <Box
          sx={{
            maxWidth: 800,
            bgcolor: "white",
            mx: "auto",
            p: 12,
            boxShadow: 24,
            position: "relative",
            overflowY: "auto",
            maxHeight: "100vh",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <IconButton
            onClick={() => setOpenInstructions(false)}
            sx={{ position: "absolute", top: 12, right: 12 }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h2"
            sx={{ fontWeight: 600, textAlign: "center", mb: 2 }}
          >
            Go Live!
          </Typography>
          <Box
            sx={{
              height: "12px",
              width: 250,
              bgcolor: "#FFD700",
              mx: "auto",
              mb: 6,
            }}
          />
          <Typography variant="body2" sx={{ mb: 2 }}>
            Individuals will not be able to donate to your cause, and your site
            will not be live until all fields below are completed.
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Tab: My Account
          </Typography>
          <Typography variant="body2" component="ol" sx={{ pl: 2, mb: 4 }}>
            <li>Upload a profile picture.</li>
            <br />
            <li>
              Upload a State-issued photo ID. This helps us verify that you are
              a real person, and it protects our donors.
            </li>
            <br />
            <li>Add your full name.</li>
            <br />
            <li>
              Select the continent you serve on. We do not require you to say
              which country to help protect your identity, but we need your
              continent.
            </li>
            <br />
            <li>Complete the yearly verification survey.</li>
            <br />
            <li>Add the ministry’s name and tax ID number.</li>
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Tab: My Page
          </Typography>
          <Typography
            variant="body2"
            component="ol"
            sx={{ pl: 2, mb: 4 }}
            start={7}
          >
            <li>
              Add your profile name or a pseudo name if you are in a country
              where you are worried about using your real name.
            </li>
            <br />
            <li>
              Add a description to the "ABOUT" section so donors know who you
              are, what you do, and who you serve.
            </li>
            <br />
            <li>
              Choose one or two words to describe your ministry. This will help
              donors filter you by what you do and who you serve.
            </li>
          </Typography>

          <Typography variant="subtitle2" fontWeight="bold">
            Tab: My Wallet
          </Typography>
          <Typography variant="body2" sx={{ mb: 6 }}>
            10. Add your bank info under "My Wallet" so donors can pay you
            directly.
          </Typography>

          <Typography variant="body2">
            <strong>LASTLY</strong>, don’t forget to hit the{" "}
            <Box component="span" sx={{ fontWeight: "bold", color: "#FFD700" }}>
              GO LIVE
            </Box>{" "}
            button!!!
          </Typography>
          <Box
            sx={{
              height: "4px",
              width: 60,
              bgcolor: "#FFD700",
              mx: "auto",
              mt: 3,
            }}
          />
        </Box>
      </Modal>
      <input
        type="file"
        accept=".pdf,.doc,.docx,image/*"
        hidden
        ref={pastoralInputRef}
        onChange={(e) => setPastoralFile(e.target.files[0])}
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx,image/*"
        hidden
        ref={familyInputRef}
        onChange={(e) => setFamilyFile(e.target.files[0])}
      />
    </>
  );
};

export default AccountPage;
