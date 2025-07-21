import React, { useState,useEffect  } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Divider,
  CircularProgress
} from "@mui/material";
import SnackbarAlert from "../../../../genricCompoennts/MUI/SnackbarAlert";
const themeColor = "#C09355";

const DonationForm = ({ onContinue, donationTarget }) => {
  const isCauseDonation = donationTarget?.type === "cause";
  const remainingAmount = isCauseDonation
    ? Math.max(0, donationTarget?.goalAmount - donationTarget?.raisedAmount)
    : null;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [donationType, setDonationType] = useState("one-time");
  const [selectedAmount, setSelectedAmount] = useState("25");
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState("");
  // const [selectedMissionaryId, setSelectedMissionaryId] = useState(
  //   missionaries[0].id
  // );
  const [isLoadingCommissions, setIsLoadingCommissions] = useState(false);
  const [commissions, setCommissions] = useState({ superAdmin: [], npo: 0, missionary: 0 });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [missionaries, setMissionaries] = useState([]); // 👈 State to hold fetched missionaries
  const [isLoading, setIsLoading] = useState(false);   // 👈 Loading state
  const [selectedMissionaryId, setSelectedMissionaryId] = useState(""); 
  const presetAmounts = [
    "10",
    "25",
    "50",
    "100",
    "250",
    "500",
    "1000",
    "Other",
  ];

  const handleDonationTypeChange = (_, newType) => {
    if (newType) setDonationType(newType);
  };

  const handleAmountClick = (amount) => {
    setSelectedAmount(amount);
    if (amount !== "Other") setCustomAmount("");
  };

  const showSnackbar = (message, severity = "error") => {
    setSnackbar({ open: true, message, severity });
  };
    useEffect(() => {
    // Only fetch if it's a missionary donation form
    if (!isCauseDonation) {
      const fetchMissionaries = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/missionaries/list`);
          if (!response.ok) {
            throw new Error('Failed to fetch missionaries');
          }
          const data = await response.json();
          setMissionaries(data);
          // Set the default selection to the first missionary in the list
          if (data.length > 0) {
            setSelectedMissionaryId(data[0]._id);
          }
        } catch (error) {
          console.error("Error fetching missionaries:", error);
          showSnackbar("Could not load missionary list.", "error");
        } finally {
          setIsLoading(false);
        }
      };
      fetchMissionaries();
    }
  }, [isCauseDonation]);
  useEffect(() => {
    const fetchCommissions = async () => {
        const missionaryId = donationTarget.type === 'Missionary'
            ? donationTarget.id
            : donationTarget.missionaryId;

        if (missionaryId) {
            setIsLoadingCommissions(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/donations/commissions?missionaryId=${missionaryId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch commissions');
                }
                const data = await response.json();
                const responseData = data.data || {};
                const superAdminOptions = responseData.superAdminCommission;
                // Set all three commissions from the API response
                setCommissions({
                    //superAdmin: parseFloat(responseData.superAdminCommission) || 0,
                    superAdmin: Array.isArray(superAdminOptions) ? superAdminOptions : [],
                    npo: parseFloat(responseData.npoCommission) || 0,
                    missionary: parseFloat(responseData.missionaryCommission) || 0,
                });
            } catch (error) {
                console.error("Error fetching commissions:", error);
                showSnackbar("Could not load commission details.", "error");
            } finally {
                setIsLoadingCommissions(false);
            }
        }
    };

    fetchCommissions();
}, [donationTarget]);
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const finalAmount =
  //     selectedAmount === "Other"
  //       ? parseFloat(customAmount)
  //       : parseFloat(selectedAmount);

  //   if (!isAnonymous && (!donorName || !donorEmail)) {
  //     showSnackbar(
  //       "Please enter your name and email, or choose to stay anonymous."
  //     );
  //     return;
  //   }

  //   if (!finalAmount || finalAmount <= 0) {
  //     showSnackbar("Please select or enter a valid donation amount.");
  //     return;
  //   }

  //   if (isCauseDonation && finalAmount > remainingAmount) {
  //     showSnackbar(
  //       `You can only donate up to $${remainingAmount} for this cause.`
  //     );
  //     return;
  //   }

  //   const target = isCauseDonation
  //     ? donationTarget
  //     : {
  //         type: "Missionary",
  //         id: selectedMissionaryId,
  //         name: missionaries.find((m) => m.id === selectedMissionaryId)?.name,
  //       };

  //   const formData = {
  //     donationType: isCauseDonation ? "one-time" : donationType,
  //     amount: finalAmount,
  //     donorName: isAnonymous ? "Anonymous" : donorName,
  //     donorEmail: isAnonymous ? "" : donorEmail,
  //     isAnonymous,
  //     message,
  //     target,
  //     commissions
  //   };

  //   onContinue(formData);
  // };
const handleSubmit = (e) => {
  debugger;
    e.preventDefault();
    const finalAmount =
      selectedAmount === "Other"
        ? parseFloat(customAmount)
        : parseFloat(selectedAmount);

    if (!isAnonymous && (!donorName || !donorEmail)) {
      showSnackbar(
        "Please enter your name and email, or choose to stay anonymous."
      );
      return;
    }

    if (!finalAmount || finalAmount <= 0) {
      showSnackbar("Please select or enter a valid donation amount.");
      return;
    }

    if (isCauseDonation && finalAmount > remainingAmount) {
      showSnackbar(
        `You can only donate up to $${remainingAmount} for this cause.`
      );
      return;
    }

    // Find the full missionary object to correctly get both the ID and name
    const selectedMissionary = missionaries.find(m => m._id === selectedMissionaryId);

    // This logic now correctly constructs the target object
    const target = isCauseDonation
      ? donationTarget // For a cause, we use the prop directly
      : {
          type: "Missionary",
          // This 'id' is what becomes 'targetId' in the backend
          id: selectedMissionaryId,
          // This now correctly finds the name using the missionary object
          name: selectedMissionary ? selectedMissionary.name : "Unknown Missionary",
        };

    // 🎯 CRITICAL DEBUGGING STEP: This log will show you the exact data being sent.
    console.log("Submitting donation for the following target:", target);

    const formData = {
      donationType: isCauseDonation ? "one-time" : donationType,
      amount: finalAmount,
      donorName: isAnonymous ? "Anonymous" : donorName,
      donorEmail: isAnonymous ? "" : donorEmail,
      isAnonymous,
      message,
      target, // Pass the whole target object
      commissions
    };

    // The onContinue function sends this data to the parent component
    onContinue(formData);
  };
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": { borderColor: "#E0E0E0" },
      "&:hover fieldset": { borderColor: themeColor },
      "&.Mui-focused fieldset": { borderColor: themeColor },
    },
  };
 if (isLoadingCommissions) {
        return <CircularProgress />;
    }
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        borderRadius: "12px",
        border: "1px solid #E0E0E0",
        maxWidth: 530,
        mx: "auto",
        p: { xs: 2, sm: 4 },
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={isCauseDonation ? 3 : 2}>
        {isCauseDonation ? "Cause Donation" : "Missionary Donation"}
      </Typography>

      {!isCauseDonation && <Divider sx={{ mb: 2 }} />}

      {!isCauseDonation && (
        <ToggleButtonGroup
          value={donationType}
          exclusive
          onChange={handleDonationTypeChange}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value="one-time">One-Time</ToggleButton>
          <ToggleButton value="monthly">Monthly</ToggleButton>
        </ToggleButtonGroup>
      )}

      {isCauseDonation ? (
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Donating to
          </Typography>
          <Typography variant="h5" fontWeight="bold" sx={{ color: themeColor }}>
            {donationTarget?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            You can donate between $1 and ${remainingAmount}.
          </Typography>
        </Box>
      ) : (
        <FormControl fullWidth sx={{ mb: 2 }}>
          <Select
            value={selectedMissionaryId}
            onChange={(e) => setSelectedMissionaryId(e.target.value)}
          >
             {missionaries.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Donor's Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            disabled={isAnonymous}
            required
            sx={isCauseDonation ? textFieldStyles : {}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Donor's Email"
            type="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            disabled={isAnonymous}
            required
            sx={isCauseDonation ? textFieldStyles : {}}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {presetAmounts.map((amount) => (
          <Grid item xs={6} sm={3} key={amount}>
            <Button
              fullWidth
              variant={selectedAmount === amount ? "contained" : "outlined"}
              onClick={() => handleAmountClick(amount)}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "bold",
                py: 1.5,
                bgcolor: selectedAmount === amount ? themeColor : "transparent",
                color: selectedAmount === amount ? "#fff" : "text.primary",
                borderColor: selectedAmount === amount ? themeColor : "#ccc",
                "&:hover": {
                  borderColor: themeColor,
                  bgcolor: selectedAmount === amount ? "#a98244" : "#fdf8f0",
                },
              }}
            >
              {isCauseDonation
                ? amount === "Other"
                  ? amount
                  : `${amount}$`
                : amount === "Other"
                ? amount
                : `$${amount}`}
            </Button>
          </Grid>
        ))}
      </Grid>

      {selectedAmount === "Other" && (
        <TextField
          fullWidth
          label="Custom Amount"
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          sx={{ mb: 2 }}
        />
      )}

      <Typography
        variant="body2"
        sx={{ color: themeColor, cursor: "pointer", mb: 2 }}
        onClick={() => setShowMessageBox(!showMessageBox)}
      >
        {showMessageBox ? "- Remove message" : "+ Add a message"}
      </Typography>

      {showMessageBox && (
        <TextField
          fullWidth
          multiline
          minRows={3}
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            mb: 2,
            border: `1px solid ${themeColor}`,
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: themeColor },
              "&:hover fieldset": { borderColor: themeColor },
              "&.Mui-focused fieldset": { borderColor: themeColor },
            },
          }}
        />
      )}

      <Divider sx={{ my: 3 }} />

      <Box
        sx={
          isCauseDonation
            ? {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }
            : {}
        }
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              sx={{ "&.Mui-checked": { color: themeColor } }}
            />
          }
          label="Stay Anonymous"
          sx={
            isCauseDonation
              ? {
                  color: themeColor,
                  "& .MuiTypography-root": { fontWeight: 500 },
                }
              : { mb: 2 }
          }
        />
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth={!isCauseDonation}
          sx={{
            bgcolor: themeColor,
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "8px",
            py: 1.5,
            px: isCauseDonation ? 4 : 0,
            textTransform: "none",
            "&:hover": { bgcolor: "#a98244" },
          }}
        >
          Continue
        </Button>
      </Box>
      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default DonationForm;
