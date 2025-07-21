import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Tabs,
  Tab,
  Modal,
  Card,
  CardContent,
  IconButton,
  ToggleButtonGroup,
  ButtonBase,
} from "@mui/material";
import { Link } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../../../Assests/Images/donationnightbright.avif";
import img2 from "../../../Assests/Images/fourum.png";

const MissionarySignupModal = ({ open, handleClose }) => (
  <Modal open={open} onClose={handleClose}>
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
        color: "black",
      }}
    >
      <Typography variant="h6" component="h2">
        Signup Modal
      </Typography>
      <Typography sx={{ mt: 2 }}>
        This is where the signup form would be.
      </Typography>
    </Box>
  </Modal>
);

const tabData = [
  {
    label: "Sign Up",
    content: (
      <>
        It’s easy to create an account. Simply click the{" "}
        <Typography component="span" sx={{ textDecoration: "underline" }}>
          sign-in
        </Typography>{" "}
        button above to begin the process. All sign-up information will be
        hidden from your live page. Once in our backend dashboard, you will have
        the opportunity to fill out the information you want donors and the
        world to see.
        <br />
        <br />
        <em>
          *Pseudo-names to protect your safety and identity are accepted.
        </em>{" "}
        😆
      </>
    ),
    image:
      "https://static.wixstatic.com/media/fc3924_07dda9a619704afcb1c505a256068732~mv2.png/v1/fill/w_866,h_622,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Annotation%20on%202025-01-13%20at%2014-34-46.png",
  },
  {
    label: "Go live",
    content: (
      <>
        To ensure your ministry and causes are ready for donors worldwide, we
        require the following information:
        <ol style={{ paddingLeft: "20px", marginTop: "8px" }}>
          <li>
            <strong>Basic Personal and Ministry Information</strong>: This
            includes your name, contact details, and an overview of your
            ministry and its mission.
          </li>
          <li>
            <strong>Partnering Ministry Details</strong>: The name and tax-ID of
            the organization you are affiliated with.
          </li>
          <li>
            <strong>A State-Issued ID</strong>: For verification purposes.
          </li>
          <li>
            <strong>A United States Bank Account</strong>: This will be used to
            securely process and receive donations.
          </li>
        </ol>
        We ask for this information to maintain the integrity of our platform,
        ensuring it remains a safe space for donors and protects against
        fraudulent activity.
      </>
    ),
    image:
      "https://static.wixstatic.com/media/fc3924_07dda9a619704afcb1c505a256068732~mv2.png/v1/fill/w_866,h_622,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Annotation%20on%202025-01-13%20at%2014-34-46.png",
  },
  {
    label: "Donations",
    content: (
      <>
        At Night Bright, we’re committed to ensuring that our platform is 100%
        free for missionaries to use. Here’s how we make that possible:
        <ol style={{ paddingLeft: "20px", marginTop: "8px" }}>
          <li>
            <strong>Optional Tips from Donors</strong>: We give donors the
            option to leave a tip, which helps us cover operational costs
            without impacting the funds raised for your ministry.
          </li>
          <li>
            <strong>Raising Our Own Support</strong>: We actively raise support
            from individuals and organizations who believe in our mission.
          </li>
          <li>
            <strong>Donor-Covered Merchant Fees</strong>: Donors cover all
            transaction fees so your full donation goes directly to your
            ministry.
          </li>
        </ol>
        <Typography
          variant="body2"
          sx={{ fontStyle: "italic", mt: 2, display: "block" }}
        >
          Night Bright is a 501(c)3 non-profit so all donations are
          tax-deductible.
        </Typography>
      </>
    ),
    image:
      "https://static.wixstatic.com/media/fc3924_30496b3442354dec87f758f1ff09f2ec~mv2.png/v1/crop/x_0,y_0,w_1902,h_1366/fill/w_866,h_622,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Annotation%20on%202025-01-13%20at%2015-43-19.png",
  },
];

const TabPanel = (props) => {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};
const carouselSlides = [
  {
    image:
      "https://static.wixstatic.com/media/fc3924_4626e439dbf447aeb00cc1d92930ee59~mv2.png/v1/crop/x_14,y_0,w_873,h_1679/fill/w_334,h_642,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/phone3%20-%20become.png",
  }, // Forum Screenshot
  {
    image:
      "https://static.wixstatic.com/media/fc3924_ce87b404a4c94302bf7af5ce9ca8f2a8~mv2.png/v1/fill/w_334,h_621,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/phone2%20-%20become.png",
  }, // Joel & Laci Hill Screenshot
];

const BecomeMissionary = () => {
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const handleOpenSignupModal = () => setSignupModalOpen(true);
  const handleCloseSignupModal = () => setSignupModalOpen(false);
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  const paginate = (newDirection) => {
    let newIndex = imageIndex + newDirection;
    if (newIndex < 0) {
      newIndex = carouselSlides.length - 1;
    } else if (newIndex >= carouselSlides.length) {
      newIndex = 0;
    }
    setImageIndex(newIndex);
  };

  const features = [
    {
      icon: "🌍",
      title: "Worldwide Support",
      description:
        "Our site creates one central hub where donors from around the globe can find, support, and fund you and your mission.",
    },
    {
      icon: "🤝",
      title: "All-In-One",
      description:
        "Now you can receive one-time, ongoing, and event donations all in one place. Donors can support you monthly or for one-time event.",
    },
    {
      icon: "💵",
      title: "Payments Fees",
      description:
        "Donors pay the processing fees associated with credit cards and transactions. Plus, our platform is 100% free to use!",
    },
  ];

  return (
    <>
      {/* --- Section 1: Hero --- */}
      <Box
        sx={{
          bgcolor: "white",
          color: "#000",
          py: { xs: 6, md: 8 },
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: "600", lineHeight: 1.2, mb: 2 }}
                  >
                    Make your donor network global
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", fontSize: "1rem", mb: 3 }}
                  >
                    We offer a{" "}
                    <Box
                      component="span"
                      sx={{ color: "#FF6B6B", fontWeight: "bold" }}
                    >
                      free
                    </Box>{" "}
                    solution to help you raise monthly support, secure funding
                    for events and trips, and meet both ongoing and one-time
                    financial needs. Additionally, our private forum connects
                    missionaries worldwide.
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    {[
                      { label: "Overview", icon: "📖" },
                      { label: "How it works", icon: "⚙️" },
                      { label: "Forum (resources)", icon: "💬" },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography sx={{ mr: 1, fontSize: "1.2rem" }}>
                          {item.icon}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            "&:hover": { color: "#FF6B6B" },
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    onClick={handleOpenSignupModal}
                    variant="contained"
                    size="medium"
                    sx={{
                      bgcolor: "#FF6B6B",
                      color: "#fff",
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "0.9rem",
                      px: 3,
                      py: 1,
                      borderRadius: "10px",
                      "&:hover": { bgcolor: "#E95A5A" },
                    }}
                  >
                    Join the Waitlist
                  </Button>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                <Box
                  sx={{
                    ml: 2,
                    width: 420,
                    bgcolor: "black",
                    borderRadius: "24px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    p: 1,
                  }}
                >
                  <Card
                    elevation={0}
                    sx={{ borderRadius: "20px", overflow: "hidden" }}
                  >
                    <motion.img
                      key={imageIndex}
                      src={carouselSlides[imageIndex].image}
                      alt="App Screenshot"
                      initial={{ x: 300, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -300, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      style={{ width: "100%", display: "block" }}
                    />
                  </Card>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      pt: 1,
                      px: 1,
                    }}
                  >
                    <IconButton
                      onClick={() => paginate(-1)}
                      sx={{
                        color: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                      }}
                    >
                      <ArrowBackIosNewIcon fontSize="small" />
                    </IconButton>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {carouselSlides.map((_, i) => (
                        <Box
                          key={i}
                          onClick={() => setImageIndex(i)}
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            bgcolor: i === imageIndex ? "white" : "grey.700",
                            cursor: "pointer",
                          }}
                        />
                      ))}
                    </Box>
                    <IconButton
                      onClick={() => paginate(1)}
                      sx={{
                        color: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                        "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                      }}
                    >
                      <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* --- Section 2: Dark Features --- */}
      <Box sx={{ bgcolor: "#ffffff", py: { xs: 8, md: 12 } }}>
        <Container
          sx={{
            bgcolor: "#000000",
            borderRadius: "20px",
            p: { xs: 4, md: 6 },
          }}
          maxWidth="lg"
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ flex: "1 1 300px", maxWidth: "400px" }}
              >
                <Paper
                  sx={{
                    p: 4,
                    bgcolor: "white",
                    color: "black",
                    borderRadius: "16px",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 2,
                  }}
                  elevation={4}
                >
                  <Typography variant="h3" component="div">
                    {feature.icon}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1 }}
                    component="div"
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* --- Section 3: Tabbed How-To --- */}
      <Box sx={{ bgcolor: "white", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Paper
            variant="outlined"
            sx={{
              borderColor: "#e0e0e0",
              borderRadius: "24px",
              overflow: "hidden",
            }}
          >
            <Grid
              container
              direction={{ xs: "column", md: "row" }}
              alignItems="stretch"
              sx={{
                p: { xs: 2, sm: 4, md: 6 },
                display: "flex",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  mb: 2,
                  "& .MuiTabs-indicator": { backgroundColor: "black" },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: "bold",
                    color: "text.secondary",
                  },
                  "& .Mui-selected": { color: "black !important" },
                }}
              >
                {tabData.map((tab) => (
                  <Tab key={tab.label} label={tab.label} />
                ))}
              </Tabs>

              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box sx={{ flexGrow: 1 }}>
                  {tabData.map((tab, index) => (
                    <TabPanel key={tab.label} value={tabValue} index={index}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mb: 2 }}
                      >
                        {tab.label.toUpperCase()}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: "text.secondary", lineHeight: 1.7 }}
                      >
                        {tab.content}
                      </Typography>
                    </TabPanel>
                  ))}
                </Box>
                <Box
                  // item
                  // xs={12}
                  // md={7}
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    p: 4,
                  }}
                >
                  {/* Background blob */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: "80%",
                      height: "80%",
                      bgcolor: "#e0dfff",
                      borderRadius: "32px",
                    }}
                  />
                  {/* Tilted image */}
                  <Box
                    component="img"
                    src={tabData[tabValue].image}
                    alt={tabData[tabValue].label}
                    sx={{
                      width: "90%",
                      maxWidth: "500px",
                      transform: "rotate(-8deg)",
                      borderRadius: "12px",
                      zIndex: 1,
                      boxShadow: 3,
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* --- Section 4: Forum CTA --- */}
      <Box sx={{ bgcolor: "#fafafa", py: { xs: 8, md: 10 } }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", mb: 2, color: "#000000" }}
          >
            Forum
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "text.secondary", fontWeight: "normal", mb: 4 }}
          >
            Our whitelabel forum allows you to connect and learn from other
            missionaries around the world.
          </Typography>

          <Box
            component="img"
            src={img2}
            alt="Forum preview"
            sx={{
              width: "100%",
              maxWidth: 640, // slightly larger, balanced
              height: "auto",
              borderRadius: 4,
              mx: "auto", // center horizontally
              display: "block",
              boxShadow: 3,
            }}
          />
        </Container>
      </Box>

      {/* Signup Modal */}
      <MissionarySignupModal
        open={isSignupModalOpen}
        handleClose={handleCloseSignupModal}
      />
    </>
  );
};

export default BecomeMissionary;
