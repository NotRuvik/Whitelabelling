import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Container,
  Link,
} from "@mui/material";

const WayToGive = () => {
  const givingOptions = [
    {
      title: "One-Time/Ongoing",
      content:
        "Give a one-time or recurring donation to Night Bright easily using our secure payment widget.",
      linkText: "Learn more here",
    },
    {
      title: "DAF Giving",
      content:
        "Give through your Donor-Advised Fund (DAF) effortlessly. With our secure payment widget, you can easily contribute and make a lasting impact on global missions.",
      linkText: "Learn more here",
    },
    {
      title: "Stocks/Crypto",
      content:
        "If you hold stocks or cryptocurrency, we offer a convenient and automated way to transfer assets directly to our portfolio. Your donation can make a lasting impact on global missions.",
      linkText: "Learn more here",
    },
    {
      title: "Volunteer",
      content:
        "Volunteering with Night Bright is more than just giving your time—it’s joining a mission that directly impacts lives around the world. If you have questions, please reach out.",
      linkText: "Learn more here",
    },
  ];

  return (
    <Box sx={{ backgroundColor: "#fff" }}>
      {/* Top Section */}
      <Container maxWidth="md" sx={{ textAlign: "center", py: 8 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 600, mb: 3, color: "#000000" }}
        >
          Ways to Give
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: "750px", mx: "auto" }}
        >
          There are many ways to support Night Bright, whether through one-time
          donations, ongoing giving, or alternative assets. In addition to
          traditional giving, we also accept stocks, cryptocurrency, and
          Donor-Advised Funds (DAFs). Our automated giving widget makes it easy
          to donate directly from your fund, streamlining the process and
          ensuring your generosity makes an immediate impact. However you choose
          to give, your support helps continue finding, funding, and resourcing
          missionaries worldwide, bringing the hope of Jesus to those who need
          it most.
        </Typography>
      </Container>

      {/* Giving Options Section */}
      <Box sx={{ py: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {givingOptions.map((item, index) => {
            const row = Math.floor(index / 2);
            const col = index % 2;
            const isLight = (row + col) % 2 === 0;

            return (
              <Box
                key={index}
                sx={{
                  width: { xs: "100%", sm: "50%" },
                  backgroundColor: isLight ? "#f2f2f2" : "#ffffff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: { xs: 6, md: 8 },
                  px: 2,
                  boxSizing: "border-box",
                  //border: "1px solid #000000",
                }}
              >
                <Box sx={{ maxWidth: 400, textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{ fontWeight: 500, mb: 2, color: "#000000" }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="#000000">
                    {item.content}{" "}
                    {item.linkText && (
                      <Link
                        href="#"
                        underline="none"
                        sx={{ color: "#C0A068", fontWeight: "bold" }}
                      >
                        {item.linkText}
                      </Link>
                    )}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Questions Form Section */}
      <Box sx={{ backgroundColor: "#000000", py: 8 }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              textAlign: "center",
              p: { xs: 2, sm: 4 },
              borderRadius: "24px",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  textAlign: "left",
                  color: "#4a3328",
                  fontSize: "1.6rem",
                }}
              >
                Have questions about giving to Night Bright
              </Typography>

              {/* First Name + Last Name */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                  mb: 2,
                }}
              >
                <TextField
                  label="First name *"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    sx: {
                      borderRadius: "50px",
                      backgroundColor: "#fafafa",
                    },
                  }}
                  InputLabelProps={{ sx: { color: "#6f4e37" } }}
                  sx={{
                    "& fieldset": {
                      borderColor: "#d6bfa2",
                    },
                  }}
                />
                <TextField
                  label="Last name *"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    sx: {
                      borderRadius: "50px",
                      backgroundColor: "#fafafa",
                    },
                  }}
                  InputLabelProps={{ sx: { color: "#6f4e37" } }}
                  sx={{
                    "& fieldset": {
                      borderColor: "#d6bfa2",
                    },
                  }}
                />
              </Box>

              {/* Email */}
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Email *"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    sx: {
                      borderRadius: "50px",
                      backgroundColor: "#fafafa",
                    },
                  }}
                  InputLabelProps={{ sx: { color: "#6f4e37" } }}
                  sx={{
                    "& fieldset": {
                      borderColor: "#d6bfa2",
                    },
                  }}
                />
              </Box>

              {/* Let us know... */}
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Let us know what you need *"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  InputProps={{
                    sx: {
                      borderRadius: "24px",
                      backgroundColor: "#fafafa",
                    },
                  }}
                  InputLabelProps={{ sx: { color: "#6f4e37" } }}
                  sx={{
                    "& fieldset": {
                      borderColor: "#d6bfa2",
                    },
                  }}
                />
              </Box>

              {/* Button */}
              <Button
                variant="contained"
                component="a"
                href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}`}
                fullWidth
                sx={{
                  backgroundColor: "#5c4033",
                  color: "#fff",
                  py: 1.5,
                  borderRadius: "999px",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: "#4a3328",
                  },
                }}
              >
                Email Us
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default WayToGive;
