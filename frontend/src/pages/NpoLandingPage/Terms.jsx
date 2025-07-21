import React from 'react';
import NpoNavbar from "./NpoNavbar";
import NpoFooter from "./NpoFooter";
import "./LandingPage.css"; // Import the general CSS file

const TermsAndConditions = () => {
  return (
    
    <div className="landing-container"> {/* Using a class from LandingPage.css if applicable */}
      <NpoNavbar />

      <div className="content"> {/* Using a class from LandingPage.css if applicable */}
        <h1 className="title">Terms & Conditions</h1> {/* Use class from the provided CSS */}
        <p className="effectiveDate">Effective Date: 01/18/2024</p> {/* Use class from the provided CSS */}
      </div>
      <NpoFooter />
    </div>
  );
};

export default TermsAndConditions;