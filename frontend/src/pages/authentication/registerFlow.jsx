import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import SubscriptionPlans from "./SubscriptionPlans";
import AuthRegister from "./auth-forms/AuthRegister";
import CompleteStep from "./CompleteStep";
import { useNavigate } from "react-router-dom";
import NavBar from "../MissionaryLandingPage/components/NavBar";
import NpoNavbar from "../NpoLandingPage/NpoNavbar";

const steps = ["Subscription", "Organization Details", "Complete"];

// Load your Stripe public key from environment variables
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

export default function RegisterFlow() {
  const [activeStep, setActiveStep] = useState(0);
  // State to hold data across all registration steps
  const [registrationData, setRegistrationData] = useState({
    planType: null,
    paymentMethodId: null,
  });
  const navigate = useNavigate();
  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

    // Add a new handler for general cancellation to navigate home
  const handleCancelFlow = () => {
    navigate("/");
  };

  // This is called from SubscriptionPlans with plan and payment info
  const handlePlanSelect = (data) => {
    setRegistrationData((prevData) => ({
      ...prevData,
      planType: data.planName,
      paymentMethodId: data.paymentMethodId,
    }));
    handleNext();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <SubscriptionPlans onCancel={handleCancelFlow} onPlanSelect={handlePlanSelect} />;
      case 1:
        // Pass the collected data and the 'handleBack' function to the next step
        return (
          <AuthRegister
            onSuccess={handleNext}
            onBack={handleBack}
            registrationData={registrationData}
          />
        );
      case 2:
        return <CompleteStep />;
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <>
      <NpoNavbar />
      <Grid
        container
        sx={{
          width: "100%",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        }}
      >
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            backgroundColor: "#f4f4f4",
            height: "50%",
            display: { xs: "none", md: "block" },
          }}
        ></Grid>

        <Grid
          item
          xs={12}
          md={7}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: activeStep === 1 || activeStep === 2 ? 900 : "none",
              p: 8,
            }}
          >
            {/*  */}
            <Stepper
              sx={{ pX: 2, 
                //marginX: -40
                width: "100%"
               }}
              activeStep={activeStep}
              alternativeLabel
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>
                    <Typography
                      variant="caption"
                      fontSize="16px"
                      fontWeight="bold"
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {/* {activeStep === 0   &&
            <Box display="flex" justifyContent="flex-end" sx={{mr: 2}}>
              <Button variant="outlined" onClick={() => navigate("/")}>
                Cancel
              </Button>
            </Box>
             } */}
            
            <Box>
              <Elements stripe={stripePromise}>
                {getStepContent(activeStep)}
              </Elements>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
