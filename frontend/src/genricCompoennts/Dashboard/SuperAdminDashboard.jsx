// import React from "react";
// import { Grid } from "@mui/material";
// import StatCard from "./StatCard";
// import ChartCard from "./ChartCard";

// const SuperAdminDashboard = ({ data }) => {
//   const { stats, npoGrowth, subscriptionGrowth } = data;

//   return (
//     <>
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {stats && (
//           <>
//             <Grid item xs={12} sm={6} md={4}>
//               <StatCard title="Total NPOs" {...stats.npos} />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <StatCard title="Total Missionaries" {...stats.missionaries} />
//             </Grid>
//             <Grid item xs={12} sm={6} md={4}>
//               <StatCard title="Total Causes" {...stats.causes} />
//             </Grid>
//           </>
//         )}
//       </Grid>

//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         {npoGrowth && (
//           <Grid item xs={12} lg={6}>
//             <ChartCard title="NPO Growth" {...npoGrowth} />
//           </Grid>
//         )}
//         {subscriptionGrowth && (
//           <Grid item xs={12} lg={6}>
//             <ChartCard title="Active Subscription Growth" {...subscriptionGrowth} />
//           </Grid>
//         )}
//       </Grid>
//     </>
//   );
// };

// export default SuperAdminDashboard;
import React from "react";
import { Grid, Typography } from "@mui/material";
import StatCard from "./StatCard";
import ChartCard from "./ChartCard";
import ActivityItem from "./ActivityItem"; // Import the updated component

const SuperAdminDashboard = ({ data }) => {
  const { stats, npoGrowth, subscriptionGrowth, activityFeed } = data;
console.log("data",data)
  return (
    <>
      {/* STATS AND CHARTS SECTION (NO CHANGE) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats && (
          <>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Total NPOs" {...stats.npos} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Total Missionaries" {...stats.missionaries} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard title="Total Causes" {...stats.causes} />
            </Grid>
          </>
        )}
      </Grid>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {npoGrowth && (
          <Grid item xs={12} lg={6}>
            <ChartCard title="NPO Growth" {...npoGrowth} />
          </Grid>
        )}
        {subscriptionGrowth && (
          <Grid item xs={12} lg={6}>
            <ChartCard title="Active Subscription Growth" {...subscriptionGrowth} />
          </Grid>
        )}
      </Grid>

      {/* 🎯 NEW ACTIVITY FEED SECTION */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Recent System Activity
      </Typography>
      <Grid container spacing={2}>
        {activityFeed && activityFeed.length > 0 ? (
          activityFeed.map((activity, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ActivityItem message={activity.message} time={activity.time} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No recent system activity to show.</Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default SuperAdminDashboard;