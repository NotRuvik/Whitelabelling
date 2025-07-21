import React, { useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  Link as MuiLink,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useAuth } from "../../../../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
export function LoginModal({ open, handleClose, openSignupModal }) {
  const { login, forgotPassword, loginWithProvider } = useAuth();
  const [view, setView] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchToSignup = () => {
    handleClose();
    openSignupModal();
  };
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      await loginWithProvider(
        "google",
        { token: credentialResponse.credential },
        "missionary"
      );
      handleClose();
    } catch (err) {
      setError(err.message || "Google Login Failed.");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData.email, formData.password, "missionary");
      handleClose();
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const successMessage = await forgotPassword(formData.email);
      setSuccess(
        successMessage ||
          "If an account exists for that email, a reset link has been sent."
      );
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  // Reset state when modal closes or view changes
  const onModalClose = () => {
    handleClose();
    setTimeout(() => {
      setView("login");
      setError("");
      setSuccess("");
      setFormData({ email: "", password: "" });
    }, 300);
  };
  return (
    <Modal open={open} onClose={onModalClose}>
      <Box
        sx={{
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
        }}
      >
        <IconButton
          onClick={onModalClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {view === "login" ? (
          <>
            {/* --- LOGIN VIEW --- */}
            <Typography
              variant="h4"
              component="h2"
              textAlign="center"
              sx={{ mb: 1 }}
            >
              Log In
            </Typography>
            <Typography variant="body2" textAlign="center" sx={{ mb: 2 }}>
              New to this site?{" "}
              <MuiLink
                href="#"
                onClick={handleSwitchToSignup}
                underline="always"
              >
                Sign Up
              </MuiLink>
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
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
              <MuiLink
                href="#"
                variant="body2"
                sx={{ display: "block", textAlign: "right", mb: 2 }}
                onClick={() => setView("forgotPassword")}
              >
                Forgot password?
              </MuiLink>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: "black",
                  "&:hover": { bgcolor: "#333" },
                  p: 1.5,
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Log In"}
              </Button>
            </Box>
            <Divider sx={{ my: 3 }}>or </Divider>
            <Box sx={{ mb: 3 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError("Google Login Failed");
                  console.error("Login Failed");
                }}
                width="100%"
                useOneTap={false}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              startIcon={<FacebookIcon />}
              sx={{ bgcolor: "#1877F2", "&:hover": { bgcolor: "#166FE5" } }}
            >
              Log in with Facebook
            </Button>
          </>
        ) : (
          <>
            {/* --- FORGOT PASSWORD VIEW --- */}
            <Typography
              variant="h4"
              component="h2"
              textAlign="center"
              sx={{ mb: 1 }}
            >
              Reset Password
            </Typography>
            <Typography variant="body2" textAlign="center" sx={{ mb: 2 }}>
              Enter your email to receive a reset link.
            </Typography>
            <Box component="form" onSubmit={handleForgotPasswordSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  bgcolor: "black",
                  "&:hover": { bgcolor: "#333" },
                  p: 1.5,
                  mt: 2,
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
              </Button>
            </Box>
            <Button onClick={() => setView("login")} sx={{ mt: 2 }}>
              Back to Log In
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}
