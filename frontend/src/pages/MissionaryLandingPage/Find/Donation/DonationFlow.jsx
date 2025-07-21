// src/components/DonationFlow.jsx
import React, { useState } from "react";
import DonationForm from "./DonationForm";
import FinalDetails from "./FinalDetails"; 

const DonationFlow = ({ onClose, donationTarget }) => {
  const [step, setStep] = useState("form"); 
  const [donationData, setDonationData] = useState(null);

  const handleContinue = (formData) => {
    setDonationData(formData);
    setStep("final");
  };

  const handleBack = () => setStep("form");

  return (
    <>
      {step === "form" ? (
        <DonationForm
          onContinue={handleContinue} 
          onClose={onClose}
          donationTarget={donationTarget}
        />
      ) : (
        <FinalDetails
          donationData={donationData}
          onBack={handleBack}
          onClose={onClose}  
          donationTarget={donationTarget}
        />
      )}
    </>
  );
};

export default DonationFlow;
