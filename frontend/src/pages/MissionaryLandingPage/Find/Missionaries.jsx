import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Link as MuiLink,
  CircularProgress,
  Pagination,
  Paper,
} from "@mui/material";
import { LocationOn } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { getPublicMissionaries } from "../../../services/missionary.service";
import MissionaryCard from "./MissionaryCard";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
const ministryTypes = [
  // "Church Planting",
  // "Community Development",
  // "Medical Missions",
  // "Education",
];

const FindMissionary = () => {
  const [missionaries, setMissionaries] = useState([]);
  const baseLocations = Array.from(
    new Set(missionaries.map((m) => m.baseId?.location).filter(Boolean))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [allBaseLocations, setAllBaseLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ministryType, setMinistryType] = useState("");
  const [continent, setContinent] = useState("");

  useEffect(() => {
    const fetchMissionaries = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = {
          page: pagination.currentPage,
          limit: 12,
        };
        if (searchQuery) params.search = searchQuery;
        if (ministryType) params.ministry = ministryType;
        if (continent) params.continent = continent;

        const response = await getPublicMissionaries(params);

        console.log("🚀 Full API Response:", response);

        const missionariesData = Array.isArray(response?.data?.data?.data)
          ? response.data.data.data
          : [];

        setMissionaries(missionariesData);

        const paginationData = response?.data?.data?.pagination || {
          currentPage: 1,
          totalPages: 1,
        };
        setPagination(paginationData);
      } catch (err) {
        console.error("❌ Failed to fetch missionaries:", err);
        setError("Failed to load data. Please try again later.");
        setMissionaries([]);
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => {
      fetchMissionaries();
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, ministryType, continent, pagination.currentPage]);

  const handlePageChange = (_, value) => {
    setPagination((prev) => ({ ...prev, currentPage: value }));
  };
  useEffect(() => {
    const fetchBaseLocations = async () => {
      const response = await getPublicMissionaries({ limit: 1000 }); // or make a dedicated endpoint!
      const all = Array.from(
        new Set(
          response?.data?.data?.data
            ?.map((m) => m.baseId?.location)
            .filter(Boolean)
        )
      );
      setAllBaseLocations(all);
    };
    fetchBaseLocations();
  }, []);
  return (
    <Box sx={{ backgroundColor: "#f9f8f8", py: 5 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 5, // Use margin-bottom for spacing
            backgroundColor: "transparent", // Make paper background transparent
            display: "flex",
            alignItems: "center",
            gap: 2, // Use consistent gap
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {/* Search Input */}
          <TextField
            placeholder="Search by Missionary, Country, or Cause Title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              width: { xs: "100%", sm: "45%" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#ffffff", // Set background color of the input itself
              },
            }}
          />

          {/* "filter by" Text */}
          <Typography
            sx={{
              color: "#be965a",
              textTransform: "uppercase",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "1px",
              flexShrink: 0, // Prevent text from wrapping
            }}
          >
            filter by
          </Typography>

          {/* Ministry Types Dropdown */}
          <FormControl sx={{ m: 1, minWidth: 200 }} size="small">
            <Select
              value={ministryType}
              onChange={(e) => setMinistryType(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                borderRadius: "8px",
                backgroundColor: "#ffffff",
              }}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {ministryTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Base Selection Dropdown */}
          <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
            <Select
              value={continent}
              onChange={(e) => setContinent(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              renderValue={(selected) => {
                if (selected === "") {
                  return <Typography color="#000000">Select Base</Typography>;
                }
                return selected;
              }}
            >
              <MenuItem value="">
                All Bases
              </MenuItem>
              {allBaseLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
                        <CircularProgress />   
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center">
                        {error}
          </Typography>
        ) : missionaries.length === 0 ? (
          <Typography sx={{ textAlign: "center", my: 5 }}>
                        No missionaries found.    
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {missionaries.map((m) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={m._id}
                display="flex"
                justifyContent="center"
              >
                <MissionaryCard missionary={m} />
              </Grid>
            ))}
          </Grid>
        )}
                {/* Pagination */}   
        {!loading && missionaries.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FindMissionary;
