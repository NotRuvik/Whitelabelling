import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Link as MuiLink,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { publicMissionarySignup } from "../../../../services/auth.service";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  color: "black",
  outline: "none",
};

export default function MissionarySignupModal({
  open,
  handleClose,
  openLoginModal,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [agreements, setAgreements] = useState({
    terms: false,
    faith: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setAgreements({ ...agreements, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!agreements.terms || !agreements.faith) {
      setError("You must agree to the terms and statement of faith.");
      return;
    }

    setLoading(true);
    try {
      await publicMissionarySignup(formData);
      setSuccess("Success! You can now close this window and log in.");
      // Clear form
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      setAgreements({ terms: false, faith: false });
    } catch (err) {
      const message =
        err.response?.data?.message || "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };
  const handleSwitchToLogin = () => {
    handleClose(); // This closes the current (Signup) modal
    openLoginModal(); // This opens the Login modal
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "grey.500" }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                name="terms"
                checked={agreements.terms}
                onChange={handleCheckboxChange}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the terms & conditions{" "}
                <MuiLink href="/terms" target="_blank" underline="always">
                  View terms of use
                </MuiLink>
              </Typography>
            }
            sx={{ mt: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                name="faith"
                checked={agreements.faith}
                onChange={handleCheckboxChange}
              />
            }
            label={
              <Typography variant="body2">
                I agree to Night Bright's statement of faith{" "}
                <MuiLink
                  href="/faith-statement"
                  target="_blank"
                  underline="always"
                >
                  View statement of faith
                </MuiLink>
              </Typography>
            }
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: "black",
              "&:hover": { bgcolor: "#333" },
              p: 1.5,
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Submit"
            )}
          </Button>

          <Typography variant="body2" textAlign="center">
            <MuiLink href="#" onClick={handleSwitchToLogin} underline="hover">
              Already a member? Log In
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}
