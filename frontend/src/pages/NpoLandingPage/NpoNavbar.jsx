import React, { useState } from "react";
import "./LandingPage.css";
import logo from '../../Assests/Logo.svg'
import { useLocation } from "react-router-dom";

const NpoNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
  const isRegisterPage = location.pathname === '/npoRegister';
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <nav className="navbar">
        <div className="navbar-logo ms-5">
          <a href="/npoLanding"><img src={logo} alt="NightBright Logo" className="logo-img" /></a>
        </div>
      <div className="nav-links">
        <a href="/npoLanding">Home</a>
        <a href="/npoLanding/pricing">Pricing</a>
        <a href="/npoLanding/about-us">About Us</a>
        <a href="/npoLanding/contact">Contact</a>
        {/* Dropdown for Sign In */}
        {/* <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
          <button className="dropdown-button"><a>Sign In</a></button>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <a href="/login?type=npo">Log in as NPO</a>
              <a href="/login?type=missionary">Log in as Missionary/Base</a>
            </div>
          )}
        </div> */}
      </div>
      {/* <a href="/npoRegister" className="cta-button">
        Create An Account
      </a> */}
       {!isRegisterPage ? (
  <a href="/npoRegister" className="cta-button">
    Create An Account
  </a>
) : (
  <a className="cta-button1 ">
  </a>
)}

    </nav>
  );
};

export default NpoNavbar;
