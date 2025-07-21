// src/pages/AddMissionaryModal.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Typography,
  MenuItem
} from "@mui/material";
import {addAndRegisterMissionary } from "../services/missionary.service";

const AddMissionaryModal = ({ open, onClose, onAdd, role, bases }) => {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    baseId: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("First Name, Last Name, and Email are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await addAndRegisterMissionary(formData);
     // await addMissionary(formData);
      // Call the onAdd prop function passed from the parent to refresh the list
      onAdd();
      handleClose(); // Close the modal on success
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "An unexpected error occurred.";
      setError(errorMessage);
      console.error("Failed to add missionary:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(initialState); // Reset form on close
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Missionary</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                 <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
               First Name
              </Typography>
              <TextField
                required
                fullWidth
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
                 <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
               Last Name
              </Typography>
              <TextField
                required
                fullWidth
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
               Email Address
              </Typography>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
             {role != 'npo_admin' && (
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
                  Assign to Base (Optional)
                </Typography>
                <TextField
                  select
                  fullWidth
                  id="baseId"
                  name="baseId"
                  value={formData.baseId}
                  onChange={handleChange}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {bases.map((base) => (
                    <MenuItem key={base._id} value={base._id}>
                      {base.location}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
               Country / Base Location
              </Typography>
              <TextField
                fullWidth
                name="country"
                id="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Grid>
           
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Missionary"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMissionaryModal;
