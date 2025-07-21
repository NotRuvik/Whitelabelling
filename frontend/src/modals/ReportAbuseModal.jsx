import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  FormControl,
  MenuItem,
  TextField,
  InputLabel,
  Select,
  Button,
  CircularProgress
} from "@mui/material";
import { submitAbuseReport } from "../services/report.service";
import SnackbarAlert from "../genricCompoennts/MUI/SnackbarAlert";
const ReportAbuseModal = ({ open, onClose, target, reportType }) => {
  const [abuseType, setAbuseType] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  // State for handling API call status
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const resetForm = () => {
    setAbuseType('');
    setDescription('');
    setEmail('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let reportData = {
      reporterEmail: email,
      abuseType,
      description,
      reportType,
    };

    if (reportType === "missionary" && target) {
      reportData.reportedMissionary = { missionaryId: target._id };
    } else if (reportType === "cause" && target) {
      reportData.reportedCause = { causeId: target._id };
    } else {
      setSnackbar({
        open: true,
        message: "Target information is missing. Cannot submit report.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    try {
      await submitAbuseReport(reportData);
      setSnackbar({
        open: true,
        message: "Report submitted successfully. Thank you for your feedback.",
        severity: "success",
      });
      // Automatically close the modal after a few seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Failed to submit report. Please try again.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    // <Modal open={open} onClose={onClose}>
    //   <Box
    //     sx={{
    //       position: "absolute",
    //       top: "50%",
    //       left: "50%",
    //       transform: "translate(-50%, -50%)",
    //       maxWidth: 700,
    //       width: "90%",
    //       bgcolor: "background.paper",
    //       boxShadow: 24,
    //       p: 4,
    //       borderRadius: "8px",
    //       fontFamily: "'Arial', sans-serif",
    //       backgroundColor: "#ffffff",
    //     }}
    //   >
    //     <Typography
    //       variant="h4"
    //       component="h1"
    //       sx={{
    //         textAlign: "center",
    //         color: "#333",
    //         mb: 4,
    //         fontWeight: "bold",
    //       }}
    //     >
    //       Report Abuse
    //     </Typography>
    //     <Box component="form" onSubmit={handleSubmit}>
    //       <Box sx={{ mb: 2 }}>
    //         <FormControl fullWidth required>
    //           <InputLabel id="abuse-type-label">Abuse Type</InputLabel>
    //           <Select
    //             labelId="abuse-type-label"
    //             id="abuse-type"
    //             value={abuseType}
    //             label="Abuse Type"
    //             onChange={(e) => setAbuseType(e.target.value)}
    //             sx={{
    //               backgroundColor: "#fff",
    //               borderRadius: "12px",
    //             }}
    //           >
    //             <MenuItem value="">
    //               <em>Select Abuse Type</em>
    //             </MenuItem>
    //             <MenuItem value="harassment">Harassment</MenuItem>
    //             <MenuItem value="spam">Spam</MenuItem>
    //             <MenuItem value="offensive-content">Offensive Content</MenuItem>
    //             <MenuItem value="scam">Scam</MenuItem>
    //             <MenuItem value="other">Other</MenuItem>
    //           </Select>
    //         </FormControl>
    //       </Box>
    //       <Box sx={{ mb: 2 }}>
    //         <TextField
    //           id="description"
    //           label="Description of Incident"
    //           multiline
    //           rows={4}
    //           required
    //           fullWidth
    //           placeholder="Describe the abuse in detail..."
    //           value={description}
    //           onChange={(e) => setDescription(e.target.value)}
    //           sx={{
    //             backgroundColor: "#fff",
    //             "& .MuiOutlinedInput-root": {
    //               borderRadius: "12px",
    //             },
    //           }}
    //         />
    //       </Box>
    //       <Box sx={{ mb: 3 }}>
    //         <TextField
    //           id="contact-email"
    //           label="Your Contact Info (Optional)"
    //           type="email"
    //           fullWidth
    //           placeholder="Your email address (for follow-up)"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           sx={{
    //             backgroundColor: "#fff",
    //             "& .MuiOutlinedInput-root": {
    //               borderRadius: "12px",
    //             },
    //           }}
    //         />
    //       </Box>
    //       <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
    //         <Button
    //           onClick={onClose}
    //           variant="outlined"
    //           sx={{
    //             padding: "6px 16px",
    //             fontSize: "14px",
    //             borderRadius: "999px",
    //             borderColor: "#888",
    //             color: "#888",
    //              "&:hover": {
    //               backgroundColor: "#f5f5f5",
    //               borderColor: "#555",
    //                color: "#555",
    //             },
    //           }}
    //         >
    //           Cancel
    //         </Button>
    //          <Button
    //           type="submit"
    //           variant="contained"
    //           sx={{
    //             padding: "6px 16px",
    //             fontSize: "14px",
    //             borderRadius: "999px",
    //             backgroundColor: "#B68642",
    //             color: "#fff",
    //             boxShadow: "none",
    //             "&:hover": {
    //               backgroundColor: "#A67535",
    //             },
    //           }}
    //         >
    //           Submit Report
    //         </Button>
    //       </Box>
    //     </Box>
    //   </Box>
    // </Modal>
    <>
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: 700,
            width: "90%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              textAlign: "center",
              color: "#333",
              mb: 4,
              fontWeight: "bold",
            }}
          >
            Report Abuse
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <FormControl fullWidth required sx={{ mb: 2 }}>
              <InputLabel id="abuse-type-label">Abuse Type</InputLabel>
              <Select
                labelId="abuse-type-label"
                value={abuseType}
                label="Abuse Type"
                onChange={(e) => setAbuseType(e.target.value)}
                sx={{ backgroundColor: "#fff", borderRadius: "12px" }}
              >
                <MenuItem value="">
                  <em>Select Abuse Type</em>
                </MenuItem>
                <MenuItem value="harassment">Harassment</MenuItem>
                <MenuItem value="spam">Spam</MenuItem>
                <MenuItem value="offensive-content">Offensive Content</MenuItem>
                <MenuItem value="scam">Scam</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="description"
              label="Description of Incident"
              multiline
              rows={4}
              required
              fullWidth
              placeholder="Describe the abuse in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 2,
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />

            <TextField
              id="contact-email"
              label="Your Contact Info (Optional)"
              type="email"
              fullWidth
              placeholder="Your email address (for follow-up)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 3,
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-root": { borderRadius: "12px" },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                onClick={handleClose}
                variant="outlined"
                disabled={loading}
                sx={{ borderRadius: "999px" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  borderRadius: "999px",
                  backgroundColor: "#B68642",
                  "&:hover": { backgroundColor: "#A67535" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit Report"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ReportAbuseModal;
