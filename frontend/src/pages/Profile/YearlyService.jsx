import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormHelperText,
  Button,
  TextField,
  RadioProps,
} from "@mui/material";
import { useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CustomRadio from "../../genricCompoennts/MUI/CustomRadio ";

const BackButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    variant="text"
    startIcon={<ChevronLeftIcon />}
    sx={{
      textTransform: "none",
      color: "#6b7280", // Gray-500
      fontWeight: 400,
      fontSize: "16px",
      pl: 0,
      "&:hover": {
        backgroundColor: "transparent",
        color: "#374151",
      },
    }}
  >
    Back
  </Button>
);

const YearlySurvey = () => {
  const [agree, setAgree] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({ agree: false, date: false });

  const handleSubmit = () => {
    const newErrors = {
      agree: agree !== "yes",
      date: !date,
    };
    setErrors(newErrors);

    if (!newErrors.agree && !newErrors.date) {
      console.log("Form submitted:", { agree, date });
    }
  };

  return (
    <Box sx={{ px: 3, py: 4, maxWidth: 600, mx: "auto" }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          fontFamily: `'Playfair Display', serif`,
          mb: 3,
          textAlign: "center",
        }}
      >
        Yearly Survey
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, textAlign: "center" }}>
        I certify that all information on my fundraising site is accurate and up
        to date. I certify that I am still doing the missional work that I
        advertise I am doing on Night Bright and that I am who I advertise
        myself to be.
      </Typography>
      <FormControl component="fieldset" error={errors.agree} sx={{ mb: 3 }}>
        <FormLabel
          component="legend"
          sx={{ color: "#000000", fontWeight: 500, mb: 1 }}
        >
          Please Select *
        </FormLabel>

        <RadioGroup value={agree} onChange={(e) => setAgree(e.target.value)}>
          <FormControlLabel
            value="yes"
            control={<CustomRadio />}
            label={<Typography sx={{ fontWeight: 500 }}>I Agree</Typography>}
          />
        </RadioGroup>

        {errors.agree && (
          <FormHelperText>Please confirm your agreement.</FormHelperText>
        )}
      </FormControl>

      <TextField
        fullWidth
        type="date"
        label="Choose today's date"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
        helperText={errors.date ? "Please choose today's date." : ""}
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
          },
        }}
      />

      <Box textAlign="center">
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: "#B68B4C",
            color: "#fff",
            fontWeight: "bold",
            px: 5,
            py: 1.5,
            borderRadius: "8px",
            fontSize: "16px",
            textTransform: "none",
            "&:hover": {
              bgcolor: "#a07a3e",
            },
          }}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export const SurveyScreen = ({ setView }) => (
  <Box sx={{ py: 3, marginX: 4 }}>
    <Box sx={{ mb: 2 }}>
      <BackButton onClick={() => setView("account")} />
    </Box>
    <YearlySurvey />
  </Box>
);
