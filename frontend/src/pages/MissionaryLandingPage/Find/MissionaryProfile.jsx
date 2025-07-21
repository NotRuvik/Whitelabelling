import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Button,
  Grid,
  Avatar,
  Chip,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Drawer,
  IconButton,
  Modal,
  FormControl,
  MenuItem,
  TextField,
  InputLabel,
  Select,
} from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";
import { getPublicMissionaries } from "../../../services/missionary.service";
import { getPublicCauses } from "../../../services/cause.service";
import { ArrowBackIosNew, ArrowForwardIos, Close } from "@mui/icons-material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import DonationForm from "./Donation/DonationForm";
import DonationFlow from "./Donation/DonationFlow";
import PhotosView from "./PhotosView";
import ImageCarousel from "./ImageCarousel";
import ReportAbuseModal from "../../../modals/ReportAbuseModal";
import { useAuth } from "../../../contexts/AuthContext";
const API_URL = process.env.REACT_APP_API_URL;



const VideoView = ({videoUrl}) => {
  console.log("videourl",videoUrl)
 const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url; // fallback
  };

  const embedUrl = getEmbedUrl(videoUrl);
  return (
  <Box>
    <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
      Video
    </Typography>
    
    <Box
      sx={{
        position: "relative",
        paddingBottom: "56.25%",
        height: 0,
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <iframe
        src= {embedUrl}
        title="Night Bright Summary"
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
  </Box>
  )
};

const CauseDescription = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    const el = descRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [description, expanded]);

  const MAX_HEIGHT = 100;

  return (
    <>
      <Box
        ref={descRef}
        sx={{
          overflow: expanded ? "auto" : "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: expanded ? "none" : 2,
          WebkitBoxOrient: "vertical",
          maxHeight: expanded ? `${MAX_HEIGHT}px` : "none",
          mb: 1,
          pr: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>

      {isOverflowing && (
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            setExpanded((prev) => !prev);
          }}
          style={{
            fontSize: "0.85rem",
            textDecoration: "underline",
            color: "#333",
            fontWeight: "500",
          }}
        >
          {expanded ? "Show less" : "Read more"}
        </Link>
      )}
    </>
  );
};
const CausesView = ({ causes, defaultImage, missionaryName }) => (
  <Box>
    <Grid container spacing={6} justifyContent="center">
      {causes.map((cause) => (
        <Grid item xs={12} sm={6} md={4} key={cause._id}>
          <Box display="flex" justifyContent="center">
            {/* Wrap the Card with RouterLink */}
            <RouterLink
              to={`/cause/${cause._id}`}
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  width: 260,
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={
                    cause.images?.[0]
                      ? `${API_URL}${cause.images[0]}`
                      : defaultImage
                  }
                  alt={cause.name}
                  sx={{
                    borderTopLeftRadius: "12px",
                    borderTopRightRadius: "12px",
                    objectFit: "cover",
                  }}
                />
                <CardContent sx={{ px: 2, pb: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ fontSize: "1rem" }}
                  >
                    {cause.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "#E29500", fontWeight: "bold", mb: 1 }}
                  >
                    Amount Needed ${cause.goalAmount.toLocaleString()}
                  </Typography>

                  <CauseDescription description={cause.description} />
                </CardContent>
              </Card>
            </RouterLink>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);
const MissionaryProfile = () => {
  const { user, updateAuthUser } = useAuth();
  const { id } = useParams();
  const [missionary, setMissionary] = useState(null);
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Photos");
  const [donationOpen, setDonationOpen] = useState(false);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  console.log("missionarymissionary",missionary)
  const toggleDonationDrawer = (open) => () => {
    setDonationOpen(open);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [missionaryRes, causesRes] = await Promise.all([
          getPublicMissionaries({ id }),
          getPublicCauses({ missionaryId: id, limit: 100 }),
        ]);

        const missionaryData = missionaryRes?.data?.data?.data.find(
          (m) => m._id === id
        );

        setMissionary(missionaryData || null);

        const causesData = causesRes?.data?.data?.data || [];
        setCauses(causesData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
    setCarouselOpen(true);
  };

  const handleCarouselClose = () => {
    setCarouselOpen(false);
  };

   const handleReportModalOpen = () => {
    setReportModalOpen(true);
  };

  const handleReportModalClose = () => {
    setReportModalOpen(false);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Typography color="error" textAlign="center" sx={{ my: 5 }}>
        {error}
      </Typography>
    );
  if (!missionary) return null;

  const userId = missionary.userId;
  const name = userId
    ? `${userId.firstName} ${userId.lastName}`
    : "Night Bright";
  const backendUrl = process.env.REACT_APP_API_URL
  const defaultImage = "https://i.ibb.co/6y8dFvj/nb-logo.png";
  const profilePic = userId?.profilePhoto
    ? `${backendUrl}${userId.profilePhoto}`
    : defaultImage;
  
  const description =
    missionary.bio ||
    "Night Bright is a non-profit 501(c)3. We strive to make donating to your favorite causes an enjoyable experience that leads to a deeper connection with the thousands of beautiful people spreading the love of God throughout the globe.";
  const location = missionary?.baseId?.location || "North America";
  const country = missionary?.country || "United States";
  const TabButton = ({ label }) => {
    const isActive = activeTab === label;
    return (
      <Button
        variant={isActive ? "contained" : "outlined"}
        onClick={() => setActiveTab(label)}
        sx={{
          borderRadius: "50px",
          px: 4,
          py: 1,
          textTransform: "none",
          fontWeight: "bold",
          backgroundColor: isActive ? "#BBDDFD" : "transparent",
          color: "#000",
          borderColor: "#BBDDFD",
          "&:hover": {
            backgroundColor: isActive ? "#a9cceb" : "#f0f8ff",
            borderColor: "#a9cceb",
          },
        }}
      >
        {label}
      </Button>
    );
  };
  const missionaryPhotos =
    missionary.images?.map((img) => `${API_URL}${img}`) || [];

  // Combine missionary photos and cause photos
  const causePhotos = causes.flatMap(
    (cause) => cause.images?.map((img) => `${API_URL}${img}`) || []
  );
  const allPhotos = [...missionaryPhotos];
  const renderContent = () => {
    switch (activeTab) {
      case "Video":
        return <VideoView   videoUrl={missionary.videoUrl} />;
      case "Causes":
        const missionaryName = causes?.[0]?.missionaryId?.userId
          ? `${causes[0].missionaryId.userId.firstName} ${causes[0].missionaryId.userId.lastName}`
          : name;
        return (
          <CausesView
            causes={causes}
            defaultImage={defaultImage}
            missionaryName={missionaryName}
          />
        );
      case "Photos":
      default:
        return (
          <PhotosView photos={allPhotos} onPhotoClick={handlePhotoClick} />
        );
      //return <PhotosView photos={[]} />;
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f9f8f8", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Button
          component={RouterLink}
          to="/missionaries"
          startIcon={<ArrowBackIosNew />}
          sx={{
            color: "text.secondary",
            textTransform: "none",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Back
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: "16px",
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 3,
            }}
          >
            <Avatar
              src={profilePic}
              alt={name}
              sx={{ width: 100, height: 100, border: "4px solid #E5A749" }}
            />
            <Box sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" } }}>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {name}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mt: 1,
                  alignItems: { xs: "center", sm: "flex-start" },
                }}
              >
                <Chip label={location} size="small" />
                <Chip label={country} size="small" />
              </Box>
            </Box>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#C09355",
                color: "#fff",
                borderRadius: "50px",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 2,
                overflow: "hidden",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#af8244",
                  ".rotate-icon": {
                    transform: "rotate(45deg)",
                  },
                },
              }}
              onClick={toggleDonationDrawer(true)}
            >
              Donate
              <Box
                className="rotate-icon"
                sx={{
                  border: "2px solid white",
                  borderRadius: "50%",
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.3s ease",
                }}
              >
                <ArrowForwardIcon fontSize="small" />
              </Box>
            </Button>
               <Button
                variant="outlined"
                sx={{
                  color: "#C09355",
                  borderColor: "#C09355",
                  borderRadius: "50px",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(192, 147, 85, 0.1)",
                    borderColor: "#af8244",
                  },
                }}
                onClick={handleReportModalOpen}
              >
                Report Abuse
              </Button>
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ my: 4, textAlign: "left", maxWidth: "auto", mx: "20px" }}
          >
            {description}
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              my: 4,
              flexWrap: "wrap",
            }}
          >
            <TabButton label="Photos" />
            <TabButton label="Video" />
            <TabButton label="Causes" />
          </Box>

          <Box mt={5}>{renderContent()}</Box>
        </Paper>
        <Drawer
          anchor="left"
          open={donationOpen}
          onClose={toggleDonationDrawer(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "auto",
              p: 10,
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
              backgroundColor: "#f9f8f8",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Donate
            </Typography>
            <IconButton onClick={toggleDonationDrawer(false)}>✕</IconButton>
          </Box>
          <DonationFlow
            onClose={() => toggleDonationDrawer(false)}
            donationTarget={{
              type: "Missionary", 
              id: missionary._id, 
              name: name, 
            }}
          />
        </Drawer>
      </Container>
      <ImageCarousel
        open={carouselOpen}
        onClose={handleCarouselClose}
        images={allPhotos}
        startIndex={selectedPhotoIndex}
      />
       <ReportAbuseModal
        open={reportModalOpen}
        onClose={handleReportModalClose}
        reportType="missionary"
        target={missionary}
      />
    </Box>
  );
};

export default MissionaryProfile;
