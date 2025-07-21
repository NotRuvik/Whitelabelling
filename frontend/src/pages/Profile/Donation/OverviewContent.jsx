// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Grid,
//   Stack,
//   Divider,
//   Typography,
//   IconButton,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   CircularProgress,
// } from '@mui/material';
// import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
// import { getDonationStats } from '../../../services/donation.service';
// const OverviewContent = () => {
//   const [stats, setStats] = useState({
//     totalRaised: 0,
//     monthlyTotal: 0,
//     causeTotal: 0,
//     totalDonors: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   // ✨ CHANGE: State to manage which filter is selected.
//   // We only allow one selection at a time to match the API.
//   const [selectedFilter, setSelectedFilter] = useState('This Month');

//   const filterOptions = [
//     "This Month",
//     "Last Month",
//     "Last 90 days",
//     "This year",
//     "Last Year",
//   ];

//   // This effect runs when the component mounts and whenever the `selectedFilter` changes
//   useEffect(() => {
//     const fetchStats = async () => {
//       setLoading(true);
//       try {
//         // Convert the label to the API-friendly value (e.g., "This Month" -> "thisMonth")
//         const period = selectedFilter.charAt(0).toLowerCase() + selectedFilter.slice(1).replace(' ', '');
//         const response = await getDonationStats(period);
//         setStats(response.data.data);
//       } catch (error) {
//         console.error("Failed to fetch donation stats:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, [selectedFilter]);

//   // Handler for when a checkbox is clicked
//   const handleFilterChange = (event) => {
//     setSelectedFilter(event.target.name);
//   };

//   // Create the dynamic stats array for rendering
//   const statsCards = [
//     { title: "TOTAL RAISED", amount: `$${stats.totalRaised.toLocaleString()}`, subtitle: `${stats.totalDonors} total donors` },
//     { title: "MONTHLY TOTALS", amount: `$${stats.monthlyTotal.toLocaleString()}`, subtitle: `In the selected period` },
//     { title: "CAUSE TOTAL", amount: `$${stats.causeTotal.toLocaleString()}`, subtitle: "For all causes" },
//   ];

//   if (loading) {
//     return <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}><CircularProgress /></Box>;
//   }

//   return (
//     <Grid container spacing={4} alignItems="flex-start">
//       {/* Stats Section */}
//       <Grid item xs={12}>
//         <Grid container alignItems="center" justifyContent="space-evenly" sx={{ textAlign: "center" }} spacing={2}>
//           {statsCards.map((stat, index) => (
//             <React.Fragment key={stat.title}>
//               <Grid item xs={12} sm={4} md={3}>
//                 <Stack spacing={1} alignItems="center">
//                   <Typography variant="caption" sx={{ color: "#6d6d6d", fontWeight: 600 }}>{stat.title}</Typography>
//                   <Typography variant="h4" sx={{ color: "#C0A068", fontWeight: "bold" }}>{stat.amount}</Typography>
//                   <Typography variant="body2" sx={{ color: "#a0a0a0" }}>{stat.subtitle}</Typography>
//                 </Stack>
//               </Grid>
//               {index < statsCards.length - 1 && (
//                 <Grid item sx={{ display: { xs: "none", md: "block" } }}>
//                   <Divider orientation="vertical" flexItem sx={{ height: "80px" }} />
//                 </Grid>
//               )}
//             </React.Fragment>
//           ))}
//         </Grid>
//         <Grid item xs={12} md={8}>
//         <Typography
//           variant="body1"
//           sx={{ color: "#6d6d6d", mb: 1, fontWeight: "medium" }}
//         >
//           Filter items
//         </Typography>
//         <FormGroup>
//           {filterOptions.map((label) => (
//             <FormControlLabel
//               key={label}
//               control={
//                 <Checkbox
//                   checked={selectedFilter === label} // Checkbox is checked if it's the selected one
//                   onChange={handleFilterChange}
//                   name={label} // Use name to identify which checkbox was changed
//                   sx={{
//                     color: "#C0A068",
//                     "&.Mui-checked": {
//                       color: "#C0A068",
//                     },
//                   }}
//                 />
//               }
//               label={label}
//               sx={{ color: "#6d6d6d" }}
//             />
//           ))}
//         </FormGroup>
//       </Grid>
//        <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end" }}>
//         <IconButton sx={{ border: "1px solid #d0d0d0", borderRadius: "8px", color: "#a0a0a0" }}>
//           <DownloadOutlinedIcon />
//         </IconButton>
//       </Grid>
//       </Grid>
//     </Grid>
//   );
// };

// export default OverviewContent;
import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { getDonationStats } from "../../../services/donation.service";
import { exportToCSV } from "../../../utils/exportToCSV";
const filterOptions = [
  "This Month",
  "Last Month",
  "Last 90 days",
  "This year",
  "Last Year",
];

const OverviewContent = () => {
  const [overview, setOverview] = useState({ stats: {}, donations: [] });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("This Month");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const period =
        selectedFilter.charAt(0).toLowerCase() +
        selectedFilter.slice(1).replace(/ /g, "");
      try {
        const response = await getDonationStats(period);
        setOverview(response.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedFilter]);

   const handleDownloadCSV = () => {
    if (!overview.donations?.length) return;

    const csvData = overview.donations.map((d) => {
        // ✨ NEW: CSV data generation now includes the custom type logic
        let displayType = "N/A";
        if (d.targetType === "Cause") {
            displayType = "Cause";
        } else if (d.targetType === "Missionary") {
            displayType = d.donationType || "N/A";
        }

        return {
            Date: new Date(d.createdAt).toLocaleDateString(),
            Target: d.targetId?.name || "N/A",
            Type: displayType, // Use the new logic here
            Amount: d.amount,
            TargetType: d.targetType,
        };
    });

    exportToCSV(csvData, `donations_${selectedFilter.replace(' ', '_')}.csv`);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.name);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  const { stats, donations } = overview;

  return (
    <Box sx={{ px: 4, py: 4 }}>
      {/* Stats row */}
      <Stack
        direction="row"
        spacing={4}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        {[
          {
            title: "TOTAL RAISED",
            amount: `$${stats.totalRaised?.toLocaleString()}`,
            subtitle: `${stats.totalDonors} total donors`,
          },
          {
            title: "MONTHLY TOTALS",
            amount: `$${stats.monthlyTotal?.toLocaleString()}`,
            subtitle: `${stats.monthlyDonors} donors `,
          },
          {
            title: "CAUSE TOTAL",
            amount: `$${stats.causeTotal?.toLocaleString()}`,
            subtitle: `${stats.causeDonors} cause donors`,
          },
        ].map((stat, i) => (
          <React.Fragment key={stat.title}>
            <Stack alignItems="center" spacing={0.5}>
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "#666" }}
              >
                {stat.title}
              </Typography>
              <Typography
                variant="h4"
                sx={{ color: "#C0A068", fontWeight: "bold" }}
              >
                {stat.amount}
              </Typography>
              <Typography variant="body2" sx={{ color: "#888" }}>
                {stat.subtitle}
              </Typography>
            </Stack>
            {i < 2 && <Divider orientation="vertical" flexItem />}
          </React.Fragment>
        ))}
      </Stack>

      {/* Main content */}
      <Stack direction="row" spacing={4}>
        {/* Filter list */}
        <Box>
          <Typography
            variant="body1"
            sx={{ mb: 1, fontWeight: 600, color: "#666" }}
          >
            Filter items
          </Typography>
          <FormGroup>
            {filterOptions.map((label) => (
              <FormControlLabel
                key={label}
                control={
                  <Checkbox
                    checked={selectedFilter === label}
                    onChange={handleFilterChange}
                    name={label}
                    sx={{
                      color: "#C0A068",
                      "&.Mui-checked": { color: "#C0A068" },
                    }}
                  />
                }
                label={label}
                sx={{ color: "#666" }}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Donations list */}
        {/* <Box
          sx={{
            flex: 1,
            maxHeight: "500px",
            overflowY: "scroll",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {(donations || []).slice(0, 10).map((donation) => (
            <Box
              key={donation._id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid rgba(169, 165, 165, 0.7)",
                borderRadius: "8px",
                px: 4,
                py: 2.5,
                mb: 2,
                background: "#fff",
              }}
            >
              <Typography variant="body2" sx={{ flex: 1, mr: 2 }}>
                {new Date(donation.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ flex: 2, mr: 2 }}>
                {donation.targetId?.name || "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ flex: 1, mr: 2 }}>
                {donation.donationType}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "red", fontWeight: 600 }}
              >
                ${donation.amount?.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box> */}
<Box
                 sx={{
            flex: 1,
            maxHeight: "500px",
            overflowY: "scroll",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
            >
                {donations.length > 0 ? (
                    donations.slice(0, 10).map((donation) => {
                        // ✨ NEW: Logic to determine the display type
                        let displayType = "N/A";
                        if (donation.targetType === "Cause") {
                            displayType = "Cause";
                        } else if (donation.targetType === "Missionary") {
                            displayType = donation.donationType || "N/A"; // e.g., 'one-time', 'monthly'
                        }

                        return (
                            <Stack
                                key={donation._id}
                                direction="row"
                                alignItems="center"
                                spacing={2}
                                sx={{
                                border: "1px solid rgba(169, 165, 165, 0.7)",
                                borderRadius: "8px",
                                px: 2.5,
                                py: 2,
                                mb: 2,
                                background: "#fff",
                                }}
                            >
                                <Typography variant="body2" sx={{ width: '20%' }}>
                                    {new Date(donation.createdAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" sx={{ width: '40%', fontWeight: 500 }}>
                                    {donation.targetId?.name || "N/A"}
                                </Typography>
                                <Typography variant="body2" sx={{ width: '20%', textTransform: 'capitalize' }}>
                                    {displayType}
                                </Typography>
                                <Typography variant="body2" sx={{ width: '20%', color: "red", fontWeight: 600, textAlign: 'right' }}>
                                    ${donation.amount?.toFixed(2)}
                                </Typography>
                            </Stack>
                        );
                    })
                ) : (
                    <Typography sx={{ textAlign: 'center', color: '#888', mt: 5 }}>
                        No donations found for the selected period.
                    </Typography>
                )}
            </Box>
        {/* Download button */}
        <Box>
          <IconButton
            onClick={handleDownloadCSV}
            sx={{
              border: "1px solid #d0d0d0",
              borderRadius: "8px",
              color: "#888",
            }}
          >
            <DownloadOutlinedIcon />
          </IconButton>
        </Box>
      </Stack>
    </Box>
  );
};

export default OverviewContent;
