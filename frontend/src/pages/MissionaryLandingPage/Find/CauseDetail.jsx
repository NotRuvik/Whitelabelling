import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  LinearProgress,
  Grid,
  Link,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getPublicCauseById } from "../../../services/cause.service";
import { Drawer } from "@mui/material";
import DonationFlow from "./Donation/DonationFlow";
import Chip from "@mui/material/Chip";
import PhotosView from "./PhotosView";
import ImageCarousel from "./ImageCarousel";
import ReportAbuseModal from "../../../modals/ReportAbuseModal";
const API_URL = process.env.REACT_APP_API_URL;
const backendUrl = process.env.REACT_APP_API_URL;
const CauseDetail = () => {
  const { causeId } = useParams();
  const navigate = useNavigate();
  const [cause, setCause] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donationOpen, setDonationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("image");
  const [openMinistryDialog, setOpenMinistryDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(cause?.images?.[0]);
  const [openFullGallery, setOpenFullGallery] = useState(false);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const handlePhotoClick = (index) => {
    setCarouselStartIndex(index);
    setIsCarouselOpen(true);
  };
  const handleOpenDialog = () => setOpenMinistryDialog(true);
  const handleCloseDialog = () => setOpenMinistryDialog(false);
  const toggleDonationDrawer = (open) => () => {
    setDonationOpen(open);
  };
  const handleReportModalOpen = () => {
    setReportModalOpen(true);
  };

  const handleReportModalClose = () => {
    setReportModalOpen(false);
  };

  useEffect(() => {
    const fetchCause = async () => {
      if (!causeId) return;
      setLoading(true);
      try {
        const response = await getPublicCauseById(causeId);
        setCause(response.data.data);
        setSelectedImage(response.data.data?.images?.[0]);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cause:", err);
        setError("Failed to load cause details. Please try again.");
        setLoading(false);
      }
    };
    fetchCause();
  }, [causeId]);
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center" sx={{ my: 5 }}>
        {error}
      </Typography>
    );
  }

  if (!cause) return null;
  const imageUrl = cause?.images?.[0]
    ? cause.images[0].startsWith("http")
      ? cause.images[0]
      : `${backendUrl}/${cause.images[0]}`
    : "/default-cause.png";

  const progress = (cause.raisedAmount / cause.goalAmount) * 100;
  const isDonationDisabled =
    cause.isCompleted || cause.raisedAmount >= cause.goalAmount;

  const mainImage =
    imageUrl ||
    "https://static.wixstatic.com/media/48ffae_4d4e1d5e9f9b4e3188bf83e7fbb58082~mv2.jpg/v1/fill/w_851,h_481,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Image-empty-state.jpg";
  return (
    <Box sx={{ backgroundColor: "#ffffff" }}>
      <Container maxWidth="md" sx={{ backgroundColor: "#ffffff" }}>
        <Button
          // component={RouterLink}
          // to={`/find-missionary-profile/${cause.missionaryId._id}`}
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIosNew />}
          sx={{
            color: "#be965a",
            textTransform: "none",
            fontWeight: "bold",
            mt: 10,
          }}
        >
          Back
        </Button>
        <Box sx={{ my: 2, borderBottom: 1, borderColor: "divider" }}>
          <Link
            href="#"
            underline="none"
            onClick={() => setActiveTab("image")}
            sx={{
              display: "inline-block",
              p: 2,
              fontWeight: "bold",
              color: activeTab === "image" ? "black" : "text.secondary",
              borderBottom: activeTab === "image" ? 2 : 0,
              borderColor: "black",
              cursor: "pointer",
            }}
          >
            Image
          </Link>
          <Link
            href="#"
            underline="hover"
            onClick={() => setActiveTab("gallery")}
            sx={{
              p: 2,
              fontWeight: "bold",
              color: activeTab === "gallery" ? "black" : "text.secondary",
              borderBottom: activeTab === "gallery" ? 2 : 0,
              borderColor: "black",
              cursor: "pointer",
            }}
          >
            Gallery
          </Link>
          <Link
            href="#"
            underline="hover"
            onClick={() => setActiveTab("video")}
            sx={{
              p: 2,
              fontWeight: "bold",
              color: activeTab === "video" ? "black" : "text.secondary",
              borderBottom: activeTab === "video" ? 2 : 0,
              borderColor: "black",
              cursor: "pointer",
            }}
          >
            Video
          </Link>
        </Box>
        {activeTab === "image" && (
          <Box
            component="img"
            src={mainImage}
            alt={cause.name}
            sx={{
              width: "100%",
              mb: 3,
              objectFit: "cover",
              maxHeight: "500px",
            }}
          />
        )}

        {activeTab === "gallery" && (
          <PhotosView
            photos={cause.images?.map((img) =>
              img.startsWith("http") ? img : `${API_URL}/${img}`
            )}
            onPhotoClick={handlePhotoClick}
          />
        )}
        <ImageCarousel
          open={isCarouselOpen}
          onClose={() => setIsCarouselOpen(false)}
          images={cause.images?.map((img) =>
            img.startsWith("http") ? img : `${API_URL}/${img}`
          )}
          startIndex={carouselStartIndex}
        />
        {activeTab === "video" && cause.videoUrl && (
          <Box
            mb={3}
            sx={{
              position: "relative",
              paddingTop: "56.25%" /* 16:9 aspect ratio */,
            }}
          >
            <iframe
              src={
                cause.videoUrl.includes("youtube.com/watch")
                  ? `https://www.youtube.com/embed/${new URLSearchParams(
                      new URL(cause.videoUrl).search
                    ).get("v")}`
                  : cause.videoUrl
              }
              title="Cause Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </Box>
        )}

        <Typography
          sx={{ color: "black" }}
          variant="h3"
          fontWeight="bold"
          gutterBottom
        >
          {cause.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, md: 3 },
            mb: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": { backgroundColor: "#C09355" },
              }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                fontWeight="bold"
              >
                ${cause.raisedAmount.toLocaleString()}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                ${cause.goalAmount.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={toggleDonationDrawer(true)}
            disabled={isDonationDisabled}
            sx={{
              backgroundColor: "#C09355",
              borderRadius: "50px",
              p: 3,
              py: 1,
              whiteSpace: "nowrap",
              "&:hover": { backgroundColor: "#af8244" },
              "&.Mui-disabled": {
                backgroundColor: "#cccccc",
                color: "#888888",
                cursor: "not-allowed",
              },
            }}
          >
            {isDonationDisabled ? "Fully Funded" : "Donate"}
            <ArrowForwardIcon sx={{ ml: 1, fontSize: "20px" }} />
          </Button>
          <Button
            variant="outlined"
            onClick={handleReportModalOpen}
            sx={{
              borderRadius: "50px", // same pill shape as Donate
              px: 3, // same horizontal padding
              py: 1, // same vertical padding
              whiteSpace: "nowrap",
              color: "#C09355",
              borderColor: "#C09355",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(192, 147, 85, 0.1)",
                borderColor: "#af8244",
              },
            }}
          >
            Report Abuse
          </Button>
        </Box>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid #eee",
            margin: "24px 0",
          }}
        />

        <Box
          sx={{
            display: "flex",
            color: "#af8244",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Avatar
            src={`${backendUrl}/${cause.missionaryId.userId.profilePhotoUrl}`}
          />
          <Typography fontWeight="bold">{`${cause.missionaryId.userId.firstName} ${cause.missionaryId.userId.lastName}`}</Typography>
        </Box>

        <Grid
          container
          spacing={2}
          sx={{
            mb: 4,
            color: "text.secondary",
            width: "100%",
          }}
        >
          {[
            {
              label: "Created Date",
              value: new Date(cause.createdAt).toLocaleDateString("en-US"),
            },
            {
              label: "Deadline",
              value: new Date(cause.deadline).toLocaleDateString("en-US"),
            },
            { label: "Continent", value: cause.missionaryId.userId.location },
            {
              label: "Ministry Type",
              value: (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                      cursor: "pointer",
                    }}
                    onClick={handleOpenDialog}
                  >
                    {cause.ministryType?.length ? (
                      <>
                        <Chip label={cause.ministryType[0]} />
                        {cause.ministryType.length > 1 && (
                          <Chip
                            label={`+${cause.ministryType.length - 1} more`}
                            sx={{
                              backgroundColor: "#c09355", // or your desired brown
                              color: "white",
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <Chip label="No Ministry Type" variant="outlined" />
                    )}
                  </Box>

                  <Dialog open={openMinistryDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Ministry Types</DialogTitle>
                    <DialogContent>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {cause.ministryType?.map((type, idx) => (
                          <Chip key={idx} label={type} variant="outlined" />
                        ))}
                      </Box>
                    </DialogContent>
                  </Dialog>
                </>
              ),
            },
          ].map(({ label, value }, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={3}
              key={index}
              sx={{ flexGrow: 1, minWidth: 0 }}
            >
              <Typography variant="body2" display="block">
                {label}
              </Typography>
              <Typography fontWeight="bold" color="text.primary">
                {value}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="body1"
          sx={{ lineHeight: 1.7, color: "text.secondary" }}
        >
          {cause.description}
        </Typography>

        <Box
          sx={{
            display: "flex",
            color: "black",
            justifyContent: "space-between",
          }}
        >
          <Link sx={{ my: 5 }} href="#" color="inherit" underline="hover">
            Previous
          </Link>
          <Link sx={{ my: 5 }} href="#" color="inherit" underline="hover">
            Next
          </Link>
        </Box>
      </Container>
      <Drawer
        anchor="left"
        open={donationOpen}
        onClose={toggleDonationDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "auto",
            p: { xs: 2, sm: 4, md: 10 },
            boxSizing: "border-box",
            backgroundColor: "#f9f8f8",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            ml: 3,
            backgroundColor: "#f9f8f8",
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="#c09355">
            Donate
          </Typography>
          <IconButton onClick={toggleDonationDrawer(false)}>✕</IconButton>
        </Box>
        <DonationFlow
          onClose={toggleDonationDrawer(false)}
          // Pass the specific cause as the donation target
          donationTarget={{
            type: "cause",
            id: cause._id,
            name: cause.name,
             missionaryId: cause.missionaryId._id,
            // Pass the missionary name for display purposes
            missionaryName: `${cause.missionaryId.userId.firstName} ${cause.missionaryId.userId.lastName}`,
            goalAmount: cause.goalAmount,
            raisedAmount: cause.raisedAmount,
          }}
        />
      </Drawer>
      <ReportAbuseModal
        open={reportModalOpen}
        onClose={handleReportModalClose}
        reportType="cause"
        target={cause}
      />
    </Box>
  );
};

export default CauseDetail;
