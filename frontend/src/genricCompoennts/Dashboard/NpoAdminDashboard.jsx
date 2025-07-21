// import React, { useState, useEffect } from "react";
// import { Grid, Typography, Box, CircularProgress } from "@mui/material";
// import StatCard from "./StatCard";
// import ChartCard from "./ChartCard"; 
// import DonorsTable from "./DonorsTable"; 
// import { listDonors } from "../../services/donor.service";
// import DonationsChart from "./DonationsChart";
// import ActivityItem from "./ActivityItem";
// const NpoAdminDashboard = ({ data }) => {
//   const { stats, donationChartData, activityFeed } = data;

//   // State for the donors list
//   const [donors, setDonors] = useState([]);
//   const [pagination, setPagination] = useState({ page: 1, limit: 10 });
//   const [loadingDonors, setLoadingDonors] = useState(true);

//   useEffect(() => {
//     const fetchDonors = async () => {
//       setLoadingDonors(true);
//       try {
//         const response = await listDonors({
//           page: pagination.page,
//           limit: pagination.limit,
//         });
//         setDonors(response.data.data.data);
//         setPagination(response.data.data.pagination);
//       } catch (error) {
//         console.error("Failed to fetch donors:", error);
//       } finally {
//         setLoadingDonors(false);
//       }
//     };

//     fetchDonors();
//   }, [pagination.page, pagination.limit]);

//   const handlePageChange = (newPage) => {
//     setPagination((prev) => ({ ...prev, page: newPage }));
//   };

//   const handleRowsPerPageChange = (newLimit) => {
//     setPagination({ page: 1, limit: newLimit });
//   };
//   // Filter only missionary-related activity (adjust based on actual structure)
//   const missionaryActivity = activityFeed?.filter((a) =>
//     a.message?.toLowerCase().includes("missionary")
//   );
//   return (
//     <>
//       {/* Stats Section */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {stats && (
//           <>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard title="My Missionaries" {...stats.missionaries} />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard title="My Causes" {...stats.causes} />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Revenue (This Month)"
//                 value={`$${stats.monthlyRevenue.value.toFixed(2)}`}
//                 change={`$${stats.monthlyRevenue.change.toFixed(2)}`}
//                 isIncrease={stats.monthlyRevenue.isIncrease}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6} md={3}>
//               <StatCard
//                 title="Unique Donors (This Month)"
//                 value={stats.monthlyDonors.value}
//                 change={stats.monthlyDonors.change}
//                 isIncrease={stats.monthlyDonors.isIncrease}
//               />
//             </Grid>
//           </>
//         )}
//       </Grid>
//       <Box sx={{ mb: 4 }}>
//         <DonationsChart
//           title="Donations (Last 30 Days)"
//           chartData={donationChartData || []}
//         />
//       </Box>
//       <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//         Recent Missionary Activity
//       </Typography>

//       <Box
//         display="flex"
//         flexWrap="wrap"
//         gap={2}
//         sx={{ justifyContent: { xs: "center", sm: "flex-start" } }}
//       >
//         {missionaryActivity && missionaryActivity.length > 0 ? (
//           missionaryActivity.map((activity, index) => (
//             <Box
//               key={index}
//               flexBasis={{
//                 xs: "100%", // full width on mobile
//                 sm: "48%", // 2 cards side by side on tablets
//                 md: "31.5%", // 3 cards side by side on desktops
//               }}
//             >
//               <ActivityItem message={activity.message} time={activity.time} />
//             </Box>
//           ))
//         ) : (
//           <Typography>No recent missionary activity.</Typography>
//         )}
//       </Box>
//       {/* Donors List Section */}
//       {/* <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
//         Recent Donors
//       </Typography>
      
//       {loadingDonors ? (
//         <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
//             <CircularProgress />
//         </Box>
//       ) : (
//         <DonorsTable
//           donors={donors}
//           pagination={pagination}
//           onPageChange={handlePageChange}
//           onRowsPerPageChange={handleRowsPerPageChange}
//         />
//       )} */}
//     </>
//   );
// };

// export default NpoAdminDashboard;
import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import StatCard from "./StatCard";
import DonationsChart from "./DonationsChart";
import ActivityItem from "./ActivityItem";

const NpoAdminDashboard = ({ data }) => {
  // Destructure all the necessary data passed from the parent component
  const { stats, donationChartData, activityFeed, recentDonations } = data;

  // Filter for missionary-related activity
  const missionaryActivity = activityFeed?.filter((a) =>
    a.message?.toLowerCase().includes("missionary")
  );

  return (
    <>
      {/* Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="My Missionaries" {...stats.missionaries} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="My Causes" {...stats.causes} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Revenue (This Month)"
                value={`$${stats.monthlyRevenue.value.toFixed(2)}`}
                change={`$${stats.monthlyRevenue.change.toFixed(2)}`}
                isIncrease={stats.monthlyRevenue.isIncrease}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Unique Donors (This Month)"
                value={stats.monthlyDonors.value}
                change={stats.monthlyDonors.change}
                isIncrease={stats.monthlyDonors.isIncrease}
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Chart Section */}
      <Box sx={{ mb: 4 }}>
        <DonationsChart
          title="Donations (Last 30 Days)"
          chartData={donationChartData || []}
        />
      </Box>

      {/* Activity Feeds Section */}
      <Grid container spacing={4}>
        {/* Missionary Activity */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Recent Missionary Activity
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {missionaryActivity && missionaryActivity.length > 0 ? (
              missionaryActivity.map((activity, index) => (
                <ActivityItem
                  key={`missionary-${index}`}
                  message={activity.message}
                  time={activity.time}
                />
              ))
            ) : (
              <Typography>No recent missionary activity.</Typography>
            )}
          </Box>
        </Grid>

<Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Recent Donations
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {recentDonations && recentDonations.length > 0 ? (
              recentDonations.map((donation, index) => (
                <ActivityItem
                  key={`donation-${index}`}
                  // Construct a clear, detailed message from the specific donation data
                  message={`${donation.donorName} donated $${donation.amount.toFixed(2)} to ${donation.targetName}.`}
                  time={donation.date}
                />
              ))
            ) : (
              <Typography>No recent donations to display.</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default NpoAdminDashboard;
