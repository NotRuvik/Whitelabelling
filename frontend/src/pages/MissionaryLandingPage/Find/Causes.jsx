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
  Chip,
  LinearProgress,
  Paper,
} from "@mui/material";
import { getPublicCauses } from "../../../services/cause.service";
import { getBaseLocations } from "../../../services/base.service";
import { Link as RouterLink } from "react-router-dom";
// Mock Data for filters
const ministryTypes = [
  "Evangelism",
  "Church Planting",
  "Community Development",
  "Medical Missions",
  "Education",
];
const CauseCard = ({ cause }) => {
  const [expanded, setExpanded] = useState(false);

  const defaultImage = "https://i.imgur.com/6bT6Y2Q.png";
  const progress =
    cause.goalAmount > 0 ? (cause.raisedAmount / cause.goalAmount) * 100 : 0;

  const BASE_URL = process.env.REACT_APP_API_URL
  const missionaryName = cause.missionaryId?.userId
    ? `${cause.missionaryId.userId.firstName} ${cause.missionaryId.userId.lastName}`
    : "N/A";

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <Card
      sx={{
        flex: "1 1 calc(33.33% - 32px)", // 3 per row with spacing
        maxWidth: "100%",
        minHeight: 450, // fixed height
        m: 2,
        borderRadius: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.3s ease-in-out",
        "&:hover": { transform: "translateY(-5px)" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        component={RouterLink}
        to={`/cause/${cause._id}`}
        sx={{ textDecoration: "none" }}
      >
        <CardMedia
          component="img"
          sx={{ height: 200, objectFit: "cover" }}
          image={
            cause.images && cause.images.length > 0
              ? `${BASE_URL}${cause.images[0]}`
              : defaultImage
          }
          alt={cause.name}
        />
      </Box>
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          noWrap
        >
          {cause.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "#b6894a", mr: 1 }}
          >
            goal ${cause.goalAmount.toLocaleString()}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              flexGrow: 1,
              height: 8,
              borderRadius: 5,
              backgroundColor: "#f0e6d2",
              "& .MuiLinearProgress-bar": { backgroundColor: "#c7a34b" },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", mb: 0.5 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, width: "100px", color: "text.secondary" }}
          >
            Location:
          </Typography>
          <Typography variant="body2">
            {cause.missionaryId?.userId?.location || "N/A"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", mb: 1 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, width: "100px", color: "text.secondary" }}
          >
            Ministry Type:
          </Typography>

          <Typography variant="body2">
            {Array.isArray(cause.ministryType)
              ? `${cause.ministryType[0]}${
                  cause.ministryType.length > 1
                    ? ` +${cause.ministryType.length - 1}`
                    : ""
                }`
              : cause.ministryType || "N/A"}
          </Typography>
        </Box>
        {/* Description container */}
        <Box
          sx={{
            position: "relative",
            mb: 1,
            height: expanded ? 100 : 40, // Fixed height
            overflowY: expanded ? "scroll" : "hidden",
            transition: "all 0.3s",
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "block",
              lineHeight: 1.5,
            }}
          >
            {cause.description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "left" }}>
          <Button
            onClick={handleToggleExpand}
            sx={{
              color: "#b6894a",
              fontWeight: 600,
              textTransform: "none",
              px: 0,
            }}
          >
            {expanded ? "Read less" : "Read more"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
const FindCauses = () => {
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);

  // Filter States
  const [filters, setFilters] = useState({
    search: "",
    ministryType: "",
    isCompleted: false,
    location: "", 
  });

    useEffect(() => {
    getBaseLocations()
      .then((res) => setLocations(res.data.data || []))
      .catch(console.error);
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [ministryType, setMinistryType] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // useEffect(() => {
  //   const fetchCauses = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const params = { page: pagination.currentPage, limit: 9, ...filters };
  //       if (searchQuery) params.search = searchQuery;
  //       if (ministryType) params.ministryType = ministryType;
  //       if (isCompleted) params.isCompleted = "true";

  //       const response = await getPublicCauses(params);
  //       setCauses(response.data.data.data || []);
  //       const fetchedCauses = response.data.data.data || [];

  //       setCauses(fetchedCauses);
  //       setPagination(response.data.data.pagination);

  //       // Extract unique locations
  //       const extractedLocations = Array.from(
  //         new Set(
  //           fetchedCauses
  //             .map((cause) => cause?.missionaryId?.userId?.location?.trim())
  //             .filter(Boolean)
  //         )
  //       );
  //      // setLocations(extractedLocations);
  //       setPagination(response.data.data.pagination);
  //     } catch (err) {
  //       console.error("Failed to fetch causes:", err);
  //       setError("Failed to load data. Please try again later.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const handler = setTimeout(() => fetchCauses(), 500); // Debounce search
  //   return () => clearTimeout(handler);
  // }, [filters, pagination.currentPage]);
  
   useEffect(() => {
    const fetchCauses = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          page: pagination.currentPage,
          limit: 9,
          search: filters.search,
          ministryType: filters.ministryType,
          isCompleted: filters.isCompleted,
          location: filters.location,
        };
        const response = await getPublicCauses(params);
        setCauses(response.data.data.data || []);
        setPagination(response.data.data.pagination);
      } catch (err) {
        console.error("Failed to fetch causes:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const handler = setTimeout(() => fetchCauses(), 500);
    return () => clearTimeout(handler);
  }, [filters, pagination.currentPage]);
    const handleFilterChange = (key, value) => {
    setPagination(p => ({ ...p, currentPage: 1 }));
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  const handlePageChange = (event, value) => {
    setPagination((prev) => ({ ...prev, currentPage: value }));
  };
 const ministryTypes = ["Evangelism", "Church Planting", "Community Development", "Medical Missions", "Education"];
  return (
    <Box sx={{ backgroundColor: "#f9f8f8", py: 5 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 4,
            backgroundColor: "#f9f8f8",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "flex-start",
          }}
        >
          <TextField
            placeholder="Search by Cause Name , Missionary or Continent"
            variant="outlined"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            sx={{
              flex: "1 1 280px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#fff",
              },
              "& input::placeholder": {
                color: "#00263a",
                opacity: 1,
                fontWeight: 500,
              },
            }}
          />

           <Typography sx={{ fontWeight: 600, color: "#b6894a" }}>Completed</Typography>
          <Box onClick={() => handleFilterChange('isCompleted', !filters.isCompleted)} sx={{ width: 36, height: 20, borderRadius: "20px", backgroundColor: filters.isCompleted ? "#a47900" : "#ccc", display: "flex", alignItems: "center", cursor: "pointer", px: "2px" }}>
            <Box sx={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "#fff", transition: "all 0.3s", transform: filters.isCompleted ? "translateX(16px)" : "translateX(0px)" }} />
          </Box>

          <Typography sx={{ fontWeight: 600, color: "#b6894a", ml: 1 }}>
            filter by
          </Typography>

          <FormControl variant="standard" sx={{ minWidth: 160 }}>
            <Select
              value={filters.ministryType} onChange={(e) => handleFilterChange('ministryType', e.target.value)}
              disableUnderline
              displayEmpty
              renderValue={(selected) =>
                selected ? selected : "Select Ministry Type"
              }
              sx={{
                fontWeight: 500,
                color: "#00263a",
                "& .MuiSelect-icon": {
                  color: "#00263a",
                },
              }}
            >
              <MenuItem value="">
                <em>All Types</em>
              </MenuItem>
              {ministryTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="standard" sx={{ minWidth: 160 }}>
            <Select
              value={filters.location}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              disableUnderline
              displayEmpty
              renderValue={(selected) => (selected ? selected : "Select Base")}
              sx={{
                fontWeight: 500,
                color: "#00263a",
                "& .MuiSelect-icon": {
                  color: "#00263a",
                },
              }}
            >
              <MenuItem value="">
                <em>All Locations</em>
              </MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 10 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" textAlign="center" sx={{ my: 10 }}>
            {error}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            {causes.length > 0 ? (
              causes
                .filter((cause) => {
                  if (!location) return true;
                  const loc = cause?.missionaryId?.userId?.location?.trim();
                  return loc === location;
                })
                .map((cause) => (
                  <Box
                    key={cause._id}
                    sx={{
                      flex: {
                        xs: "1 1 100%", // 1 per row on mobile
                        sm: "1 1 48%", // 2 per row on tablet
                        md: "1 1 31%", // 3 per row on desktop
                      },
                      maxWidth: "360px",
                      minWidth: "280px",
                    }}
                  >
                    <CauseCard cause={cause} />
                  </Box>
                ))
            ) : (
               <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "300px",
      width: "100%",
    }}
  >
    <Typography sx={{ color: "#000", textAlign: "center" }}>
      No causes found matching your criteria.
    </Typography>
  </Box>
            )}
          </Box>
        )}

        {!loading && !error && causes.length > 0 && (
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

export default FindCauses;
