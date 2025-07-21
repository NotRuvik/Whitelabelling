import React from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from "@mui/material";

// --- Reusable Settings Card Component ---
const SettingsCard = ({ title, children }) => (
  <Paper variant="outlined" sx={{ p: 3, height: "100%", borderRadius: 4 }}>
    <Typography variant="h6" color="primary" gutterBottom>
      {title}
    </Typography>
    {children}
  </Paper>
);
const LabeledTextField = ({ label, ...props }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
      {label}
    </Typography>
    <TextField {...props} fullWidth size="small" />
  </Box>
);

const SettingsPage = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom mb={4}>
        Account Security & Settings
      </Typography>
      <Grid container spacing={3}>
        {/* --- ROW 1 --- */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <SettingsCard title="Change Password">
            <LabeledTextField
              label="Last Remember Password"
              type="password"
              fullWidth
            />
            <LabeledTextField label="New Password" type="password" fullWidth />
            <FormControlLabel
              control={<Checkbox />}
              label="Logout from all other Web/Mobile Session Now."
            />
          </SettingsCard>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <SettingsCard title="Two-Way Authentication">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Security Question" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Answer" fullWidth />
              </Grid>
            </Grid>
            <FormControlLabel
              control={<Checkbox />}
              label="Logout from all other Web/Mobile Session Now."
            />
          </SettingsCard>
        </Grid>

        {/* --- ROW 2 --- */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <SettingsCard title="Stripe Credentials">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Client ID" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Secret Key" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Publishable Key" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Redirect URIs" fullWidth />
              </Grid>
            </Grid>
          </SettingsCard>
        </Grid>

        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <SettingsCard title="SMTP Credentials">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Username" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Password or key" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="SMTP Server Address" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Port" fullWidth />
              </Grid>
            </Grid>
          </SettingsCard>
        </Grid>

        {/* --- ROW 3 --- */}
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
          <SettingsCard title="Charges & Commissions">
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Platform Charges" fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <LabeledTextField label="Commissions" fullWidth />
              </Grid>
            </Grid>
          </SettingsCard>
        </Grid>

        {/* --- Buttons --- */}
        <Grid item xs={12}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button variant="outlined" color="inherit">
              Reset
            </Button>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
