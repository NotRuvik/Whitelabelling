import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import {
  resolveReportBlock,
  resolveReportDismiss,
  resolveCauseReportBlockMissionary,
} from "../services/report.service";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700, // Increased width for more details
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "12px",
  maxHeight: "90vh",
  overflowY: "auto",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  scrollbarWidth: "none",
};

const ResolveReportModal = ({ open, onClose, report, onReportResolved }) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset state when a new report is selected
  useEffect(() => {
    if (report) {
      setNotes("");
      setError("");
      setLoading(false);
    }
  }, [report]);

  const handleResolve = async (action) => {
    if (!notes) {
      setError("Admin notes are required to resolve a report.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (action === "dismiss") {
        await resolveReportDismiss(report._id, notes);
      } else if (action === "block") {
        // Decide which block function to call based on the report type
        if (report.reportType === "missionary") {
          await resolveReportBlock(report._id, notes);
        } else if (report.reportType === "cause") {
          await resolveCauseReportBlockMissionary(report._id, notes);
        }
      }
      onReportResolved(); // Refetch data in the parent component
      onClose(); // Close the modal
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!report) return null;

  const reportedContent =
    report.reportType === "missionary"
      ? report.reportedMissionary
      : report.reportedCause;
  const missionaryUser =
    report.reportType === "missionary"
      ? reportedContent?.userId
      : reportedContent?.missionaryId?.userId;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2" fontWeight="bold">
          Take Action on Report
        </Typography>
        <Chip
          label={`ID: ${report._id}`}
          size="small"
          sx={{
            textTransform: "capitalize",
            backgroundColor: "#4caf50", // green
            color: "#fff",
          }}
        />

        <Divider sx={{ my: 2 }} />

        {/* --- Report Details Section --- */}
        <Box mb={2}>
          <Typography fontWeight="bold" gutterBottom>
            Report Details
          </Typography>
          <Chip
            label={report.abuseType}
            color="warning"
            size="small"
            sx={{ mr: 1, textTransform: "capitalize" }}
          />
          <Chip
            label={report.reportType}
            color="info"
            size="small"
            sx={{ textTransform: "capitalize" }}
          />

          <Typography variant="body2" mt={2}>
            <strong>Reported Content:</strong>{" "}
            {report.reportType === "missionary" && missionaryUser
              ? `${missionaryUser.firstName} ${missionaryUser.lastName}`
              : `Cause: "${reportedContent?.name}"`}
          </Typography>
          <Typography variant="body2">
            <strong>Reporter:</strong> {report.reporterEmail || "Anonymous"}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography fontWeight="bold" gutterBottom>
            Description Provided:
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxHeight: "150px",
              overflowY: "auto",
              p: 1,
              border: "1px solid #eee",
              borderRadius: 1,
              bgcolor: "#f9f9f9",
            }}
          >
            {report.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold" gutterBottom>
          Resolution
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Admin Resolution Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box
          sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleResolve("dismiss")}
            disabled={loading}
          >
            Dismiss
          </Button>
          {(report.reportType === "missionary" ||
            report.reportType === "cause") && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleResolve("block")}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Block Missionary"}
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ResolveReportModal;
