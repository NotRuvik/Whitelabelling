import React, { useState, useEffect } from "react";
import {
  Stack,
  Grid,
  Typography,
  TextField,
  Slider,
  Select,
  MenuItem,
  Button,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
} from "@mui/material";
import { listDonations } from "../../../services/donation.service";
import { listDonors } from "../../../services/donor.service";
import { getCausesForMyOrg } from "../../../services/cause.service";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { CustomPagination } from "../../../genricCompoennts/CustomTableParts";

const DonationCard = ({ donation }) => (
  <Paper
    elevation={0}
    sx={{
      p: 6,
      borderRadius: 3,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      mb: 2,
      backgroundColor: "#fafafa",
    }}
  >
    <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Date
      </Typography>
      <Typography variant="body1">
        {donation.createdAt
          ? new Date(donation.createdAt).toLocaleDateString()
          : "N/A"}
      </Typography>
    </Box>

    <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Amount
      </Typography>
      <Typography variant="body1">
        ${Number(donation.amount || 0).toFixed(2)}
      </Typography>
    </Box>

    <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Type
      </Typography>
      <Typography variant="body1">{donation.donationType || "N/A"}</Typography>
    </Box>

    <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {donation.targetType === "Cause" ? "Cause" : "Missionary"}
      </Typography>
      <Typography variant="body1">
        {donation.targetId?.name || "N/A"}
      </Typography>
    </Box>

    <Box sx={{ flex: "1 1 150px", minWidth: "150px" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Donor
      </Typography>
      <Typography variant="body1">
        {donation.donorName || "Anonymous"}
      </Typography>
    </Box>
  </Paper>
);

const DonorCard = ({ donor }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      mb: 2,
      backgroundColor: "#fafafa",
    }}
  >
    <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Name
      </Typography>
      <Typography variant="body1">{donor.name || "Anonymous"}</Typography>
    </Box>

    <Box sx={{ flex: "1 1 200px", minWidth: "200px" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Contact
      </Typography>
      <Typography variant="body1">{donor.email || "N/A"}</Typography>
    </Box>

    <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Number of Donations
      </Typography>
      <Typography variant="body1">
        {typeof donor.numDonations === "number" ? donor.numDonations : "N/A"}
      </Typography>
    </Box>

    <Box sx={{ flex: "1 1 120px", minWidth: "120px" }}>
      <Typography variant="caption" color="text.secondary" display="block">
        Total Donated
      </Typography>
      <Typography variant="body1">
        ${Number(donor.totalContribution || 0).toFixed(2)}
      </Typography>
    </Box>
  </Paper>
);

const FilterableContent = ({ mode }) => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [causes, setCauses] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    search: "",
    amountRange: [0, 10000],
    donationType: "",
    causeId: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(localFilters);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.currentPage,
          search: appliedFilters.search,
          donationType: appliedFilters.donationType,
          causeId: appliedFilters.causeId,
        };

        let response;
        if (mode === "donations") {
          params.minAmount = appliedFilters.amountRange[0];
          params.maxAmount = appliedFilters.amountRange[1];
          response = await listDonations(params);
        } else {
          params.minContribution = appliedFilters.amountRange[0];
          params.maxContribution = appliedFilters.amountRange[1];
          response = await listDonors(params);
        }

        setData(response.data.data.data);
        setPagination(response.data.data.pagination);
      } catch (error) {
        console.error(`Failed to fetch ${mode}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appliedFilters, mode, pagination.currentPage]);

  useEffect(() => {
    getCausesForMyOrg()
      .then((res) => setCauses(res.data.data))
      .catch(console.error);
  }, []);

  const handleLocalFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(localFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage + 1 }));
  };

  const isDonationsMode = mode === "donations";
  const headerLabel = isDonationsMode ? "PAYMENT FILTERS" : "DONOR FILTERS";
  const sliderLabel = isDonationsMode
    ? "Filter by Amount Donated"
    : "Filter by Total Contribution";
  const tableHeaders = isDonationsMode
    ? ["Donor", "Amount", "Type", "Target", "Date"]
    : ["Donor", "Email", "Total Contributed", "Types", "Last Donation"];

  return (
    <Stack spacing={4}>
      {/* Filter Controls */}
      <Stack spacing={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search donor name, amount and cause name "
          //placeholder={`Search ${isDonationsMode ? "donations" : "donors"}...`}
          value={localFilters.search}
          onChange={(e) => handleLocalFilterChange("search", e.target.value)}
          sx={{
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              height: 45,
            },
            "& input": {
              padding: "14px 14px",
            },
          }}
        />
        <Typography gutterBottom fontWeight="bold" color="#C0A068">
          {headerLabel}
        </Typography>
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          gap={2}
        >
          {/* Slider */}
          <Box flex="1 1 200px" minWidth="200px">
            <Typography gutterBottom color="text.secondary">
              {sliderLabel}
            </Typography>
            <Slider
              value={localFilters.amountRange}
              onChange={(e, newValue) =>
                handleLocalFilterChange("amountRange", newValue)
              }
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              sx={{
                color: "#C0A068",
                height: 6,
                "& .MuiSlider-thumb": {
                  height: 20,
                  width: 20,
                  backgroundColor: "#fff",
                  border: "2px solid #C0A068",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  "&:hover": {
                    boxShadow: "0 0 0 8px rgba(192,160,104,0.16)",
                  },
                },
                "& .MuiSlider-track": {
                  border: "none",
                },
                "& .MuiSlider-rail": {
                  opacity: 0.3,
                  backgroundColor: "#bfbfbf",
                },
                "& .MuiSlider-valueLabel": {
                  backgroundColor: "#C0A068",
                  color: "#fff",
                  borderRadius: "4px",
                  fontWeight: 500,
                },
              }}
            />
          </Box>

          {/* Select Type */}
          <Box flex="1 1 150px" minWidth="150px">
            <Select
              fullWidth
              value={localFilters.donationType}
              onChange={(e) =>
                handleLocalFilterChange("donationType", e.target.value)
              }
              displayEmpty
              size="small"
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: 45,
                },
              }}
            >
              <MenuItem value="">
                <em>Select Type</em>
              </MenuItem>
              <MenuItem value="one-time">One-time</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </Box>

          {/* Select Cause */}
          <Box flex="1 1 200px" minWidth="200px">
            <Select
              fullWidth
              value={localFilters.causeId}
              onChange={(e) =>
                handleLocalFilterChange("causeId", e.target.value)
              }
              displayEmpty
              size="small"
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  height: 45,
                },
              }}
            >
              <MenuItem value="">
                <em>Select Cause Title</em>
              </MenuItem>
              {causes.map((cause) => (
                <MenuItem key={cause._id} value={cause._id}>
                  {cause.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Apply Filters */}
          <Box flex="1 1 150px" minWidth="150px">
            <Button
              fullWidth
              variant="outlined"
              onClick={handleApplyFilters}
              sx={{
                color: "#ff3c3c",
                border: "2px solid #ff3c3c",
                borderRadius: "999px",
                textTransform: "none",
                fontWeight: 500,
                py: 1,
                fontSize: "16px",
                backgroundColor: "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#ff3c3c",
                  color: "#fff",
                  borderColor: "#ff3c3c",
                },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Stack>

      {/* {loading ? (
        <CircularProgress sx={{ mx: "auto" }} />
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableCell key={header}>
                      <b>{header}</b>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) =>
                  isDonationsMode ? (
                    <DonationRow key={item._id || index} donation={item} />
                  ) : (
                    <DonorRow key={item.donorId || index} donor={item} />
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            count={pagination.totalDonations || pagination.totalDonors || 0}
            rowsPerPage={10}
            page={pagination.currentPage - 1} 
            onPageChange={(event, newPage) =>
              setPagination((prev) => ({
                ...prev,
                currentPage: newPage + 1, 
              }))
            }
          />
        </Paper>
      )} */}
      {loading ? (
        <CircularProgress sx={{ mx: "auto" }} />
      ) : (
        <Box>
          {data.map((item, index) =>
            isDonationsMode ? (
              <DonationCard key={item._id || index} donation={item} />
            ) : (
              <DonorCard key={item.donorId || index} donor={item} />
            )
          )}

          <CustomPagination
            count={pagination.totalDonors || pagination.totalDonations || 0}
            rowsPerPage={10}
            page={pagination.currentPage - 1}
            onPageChange={(event, newPage) =>
              setPagination((prev) => ({
                ...prev,
                currentPage: newPage + 1,
              }))
            }
          />
        </Box>
      )}
    </Stack>
  );
};

export default FilterableContent;
