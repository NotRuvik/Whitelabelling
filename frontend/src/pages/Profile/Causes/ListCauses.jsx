import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Link,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getCauses, deleteCause } from "../../../services/cause.service";

const CauseCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px", // or theme.shape.borderRadius * 2
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  backgroundColor: "#ffffff",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.1)",
  },
}));
const CauseButton = styled(Button)(({ theme, colorvariant }) => ({
  borderRadius: "20px",
  textTransform: "none",
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  minWidth: 80,
  ...(colorvariant === "edit" && {
    backgroundColor: "#bfa76f",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#a58f5a",
    },
  }),
  ...(colorvariant === "delete" && {
    backgroundColor: "#F44336",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#D32F2F",
    },
  }),
}));

const ListOfCauses = ({onEdit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [causes, setCauses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [causeToDelete, setCauseToDelete] = useState(null);
  const [expanded, setExpanded] = useState({});

  const backendUrl = process.env.REACT_APP_IMAGE_URL;

  useEffect(() => {
    const fetchCauses = async () => {
      setIsLoading(true);
      try {
        const response = await getCauses();
        setCauses(response.data.data);
      } catch (err) {
        setError("Failed to load causes. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCauses();
  }, []);

  const handleOpenDeleteDialog = (causeId) => {
    setCauseToDelete(causeId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCauseToDelete(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!causeToDelete) return;
    try {
      await deleteCause(causeToDelete);
      setCauses((prev) => prev.filter((cause) => cause._id !== causeToDelete));
    } catch (err) {
      setError("Failed to delete cause. Please try again.");
      console.error(err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const toggleDescription = (causeId) => {
    setExpanded((prev) => ({
      ...prev,
      [causeId]: !prev[causeId],
    }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      <Grid
        container
        spacing={3}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {causes.map((cause) => {
          const isExpanded = expanded[cause._id];
          const hasLongDescription = cause.description?.length > 100;
          const description =
            hasLongDescription && !isExpanded
              ? `${cause.description.substring(0, 100)}...`
              : cause.description;

          return (
            <Grid item xs={12} sm={6} md={4} key={cause._id}>
              <CauseCard
                sx={{
                  width: 300,
                  height: 500,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  image={
                    cause.images?.[0]
                      ? `${backendUrl}${cause.images[0]}`
                      : "https://via.placeholder.com/640x360?text=No+Image"
                  }
                  alt={cause.name}
                  // sx={{
                  //   objectFit: "cover",
                  //   height: "40%",
                  // }}
                  sx={{
                    objectFit: "cover",
                    height: "40%",
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                  }}
                />
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    {cause.name}
                  </Typography> */}
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "#333" }}
                  >
                    {cause.name}
                  </Typography>

                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" sx={{ color: "#888" }}>
                      Raised: ${cause.raisedAmount?.toLocaleString() || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#BE965A" }}>
                      Amount to raise: ${cause.goalAmount?.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      mb: 1.5,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        maxHeight: isExpanded ? 120 : 60,
                        overflowY: isExpanded ? "auto" : "hidden",
                        fontSize: "0.875rem",
                        pr: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "#444", lineHeight: 1.5 }}
                      >
                        {description}
                      </Typography>
                    </Box>

                    {hasLongDescription && (
                      <Box>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => toggleDescription(cause._id)}
                          sx={{
                            fontWeight: 500,
                            mt: 1,
                            color: "#555",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {isExpanded ? "Show less" : "Read more..."}
                        </Link>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1.5, mt: "auto" }}>
                    <CauseButton colorvariant="edit" onClick={() => onEdit(cause)} fullWidth={isMobile}>
                      Edit
                    </CauseButton>
                    <CauseButton
                      colorvariant="delete"
                      onClick={() => handleOpenDeleteDialog(cause._id)}
                      fullWidth={isMobile}
                    >
                      Delete
                    </CauseButton>
                  </Box>
                </CardContent>
              </CauseCard>
            </Grid>
          );
        })}
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this cause? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListOfCauses;
