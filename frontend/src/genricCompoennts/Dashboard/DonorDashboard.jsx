import React from "react";
import { Grid, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import StatCard from "./StatCard";

const DonorDashboard = ({ data }) => {
  const { stats, recentDonations } = data;

  return (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats && (
          <>
            <Grid item xs={12} sm={6}>
              <StatCard title="Total Amount Donated" value={`$${stats.totalDonated.value.toFixed(2)}`} change={0} isIncrease={true}/>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StatCard title="Total Donations Made" {...stats.donationCount} />
            </Grid>
          </>
        )}
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Recent Donations
      </Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentDonations && recentDonations.length > 0 ? (
              recentDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
                  <TableCell>{donation.recipient}</TableCell>
                  <TableCell sx={{ textTransform: 'capitalize' }}>{donation.type}</TableCell>
                  <TableCell align="right">${donation.amount.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">You have not made any donations yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DonorDashboard;