import React from "react";
import "./LandingPage.css"; // Or separate file like Contact.css
import NpoFooter from "./NpoFooter";
import NpoNavbar from "./NpoNavbar";

const Contact = () => {
  return (
    <div className="page-container">
      <NpoNavbar />

      <div className="contact-form-container">
        <h2>Have questions about giving to Night Bright</h2>

        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name *</label>
              <input type="text" id="firstName" name="firstName" required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last name *</label>
              <input type="text" id="lastName" name="lastName" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Let us know what you need *</label>
            <textarea id="message" name="message" rows="4" required></textarea>
          </div>

          <button type="submit" className="cta-button dark">Email Us</button>
        </form>
      </div>

      <NpoFooter />
    </div>
  );
};

export default Contact;
