import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const NpoDetailPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Get row data passed via navigate

  const data = state?.npo || {}; // Fallback if no data

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        &lt; Back
      </Button>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">{data.name || 'Org Name'}</Typography>
            <Typography variant="body2">Location: Texas</Typography>
            <Typography variant="body2">Domain: Health Care</Typography>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography align="right" variant="body1" fontWeight="bold">
              Active Subscription Plan
            </Typography>
            <Typography align="right" variant="body2">
              Basic: Max 4 Causes and Donation $1200
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2">Organization Name</Typography>
          <Typography>{data.name}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2">Registered</Typography>
          <Typography>{data.registered}</Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle2">Status</Typography>
          <Typography>{data.status}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NpoDetailPage;
