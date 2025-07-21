import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";
import { format } from "date-fns";

const StatCard = ({ title, value }) => (
  <Card
    sx={{
      height: "100%",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}
  >
    <CardContent>
      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
        {title}
      </Typography>
      <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const WalletPage = () => {
  const { user } = useAuth();
  const [report, setReport] = useState(null);
  const [missionaryProfile, setMissionaryProfile] = useState(null); // State for full profile
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const fetchMissionaryData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        // Fetch both the report and the full missionary profile in parallel
        const [reportRes, profileRes] = await Promise.all([
          api.get("/donations/my-fundraising-report"),
          api.get("/missionaries/me"), // This endpoint gets the logged-in missionary's full profile
        ]);

        setReport(reportRes.data.data);
        setMissionaryProfile(profileRes.data.data); // Save the full profile, including stripeConnectId
      } catch (err) {
        console.error("Failed to fetch missionary data:", err);
        setError(
          err.response?.data?.message || "Could not load your wallet data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMissionaryData();
  }, [user]);

  const handleConnectStripe = async () => {
    setIsConnecting(true);
    setError("");
    try {
      // This API call initiates the Stripe onboarding for the logged-in missionary
      const response = await api.post("/stripe/connect/onboard/missionary");
      const { url } = response.data.data;
      if (url) {
        window.location.href = url; // Redirect to Stripe for onboarding
      } else {
        throw new Error("Could not retrieve the Stripe onboarding link.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while connecting to Stripe."
      );
      setIsConnecting(false);
    }
  };

  const handleDisconnectStripe = async () => {
    try {
      await api.post("/stripe/connect/disconnect/missionary");
      window.location.reload(); // Refresh to update UI
    } catch (err) {
      console.error("Disconnect failed:", err);
      setError(err.response?.data?.message || "Failed to disconnect Stripe.");
    }
  };

  const handleManageStripe = async () => {
    try {
      const res = await api.post("/stripe/connect/manage/missionary");
      const url = res.data.data.url;
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      setError("Failed to open Stripe management page.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !isConnecting) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                My Payouts & Fundraising
            </Typography> */}

      {/* Stripe Connect Onboarding Section */}
      <Card
        sx={{
          mb: 4,
          p: 2,
          borderRadius: "12px",
          bgcolor: missionaryProfile?.stripeConnectId ? "#f0fdf4" : "#fffbeb",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: missionaryProfile?.stripeConnectId
                  ? "#14532d"
                  : "#b45309",
              }}
            >
              {missionaryProfile?.stripeConnectId
                ? "Payouts Enabled"
                : "Enable Payouts"}
            </Typography>
            <Typography
              sx={{
                color: missionaryProfile?.stripeConnectId
                  ? "#166534"
                  : "#d97706",
              }}
            >
              {missionaryProfile?.stripeConnectId
                ? "Your account is connected to Stripe and ready to receive payouts."
                : "Connect your bank account with Stripe to receive the funds you raise."}
            </Typography>
          </Box>
          {!missionaryProfile?.stripeConnectId && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleConnectStripe}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Connect with Stripe"
              )}
            </Button>
          )}
          {missionaryProfile?.stripeConnectId && (
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={handleManageStripe}>
                Edit Stripe Info
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleDisconnectStripe}
              >
                Disconnect Stripe
              </Button>
            </Box>
          )}
        </Box>
        {error && isConnecting && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Card>

      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Raised"
            value={`$${report?.stats.totalRaised.toFixed(2) || "0.00"}`}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Donations"
            value={report?.stats.donationCount || 0}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Unique Donors"
            value={report?.stats.donorCount || 0}
          />
        </Grid>
      </Grid>

      {/* Recent Donations List */}
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Recent Donations
      </Typography>
      <Card sx={{ borderRadius: "12px" }}>
        <List sx={{ p: 0 }}>
          {report?.recentDonations.length > 0 ? (
            report.recentDonations.map((donation, index) => (
              <React.Fragment key={donation._id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: "medium" }}>
                        {donation.isAnonymous
                          ? "Anonymous Donor"
                          : donation.donorName}
                      </Typography>
                    }
                    secondary={`Donated to: ${donation.targetName}`}
                  />
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: "bold" }}
                    >{`$${donation.amount.toFixed(2)}`}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(donation.createdAt), "MMM dd, yyyy")}
                    </Typography>
                  </Box>
                </ListItem>
                {index < report.recentDonations.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No recent donations found." />
            </ListItem>
          )}
        </List>
      </Card>
    </Box>
  );
};

export default WalletPage;
