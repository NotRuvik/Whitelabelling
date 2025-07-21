import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// --- Layouts and Route Guards ---
import DashboardLayout from "./layout/DashboardLayout";
import MinimalLayout from "./layout/MinimalLayout";
import MainPublicLayout from "./layout/MainPublicLayout";
import PrivateRoute from "./routes/PrivateRoute";

// --- Page Imports ---

// Main Public/Auth Pages
import LoginPage from "./pages/LoginPage";

// NPO Landing Pages
import NpoLandingPage from "./pages/NpoLandingPage/LandingPage";
import Pricing from "./pages/NpoLandingPage/Pricing";
import AboutUs from "./pages/NpoLandingPage/AboutUs";
import Contact from "./pages/NpoLandingPage/Contact";
import NpoRegister from "./pages/authentication/registerFlow"

// Missionary Landing Page (NEW)
import MissionaryLandingPage from "./pages/MissionaryLandingPage/MissionaryLandingPage";
import AboutMissionaryLanding from "./pages/MissionaryLandingPage/About/About.jsx";
// Dashboard Pages
import DashboardPage from "./pages/DashboardPage";
import NposPage from "./pages/NposPage";
import MissionariesPage from "./pages/MissionariesPage";
import PaymentsPage from "./pages/PaymentsPage";
import EmailTemplatesPage from "./pages/EmailTemplatesPage";
import SettingsPage from "./pages/SettingsPage";
import Causes from "./pages/Causes";
import BasePage from "./pages/Bases/BaseManagement";
import DonationsPage from "./pages/Profile/Donation/DonationsPage";
import DonationPage from "./pages/DonationPage.jsx";
// Profile Pages (Nested under a layout)
import MissionaryProfilePage from "./pages/MissionaryProfilePage";
import AccountPage from "./pages/Profile/AccountPage";
import MyPage from "./pages/Profile/MyPage/MyPage.jsx";
import CausesPage from "./pages/Profile/Causes/CausesPage";
import ForumPage from "./pages/Profile/ForumPage";
import WalletPage from "./pages/Profile/WalletPage";
import FindMissionary from "./pages/MissionaryLandingPage/Find/Missionaries";
import FindCauses from "./pages/MissionaryLandingPage/Find/Causes";
import Team from "./pages/MissionaryLandingPage/Team/Team.jsx";
import WayToGive from "./pages/MissionaryLandingPage/WaysToGive/WaysToGive.jsx";
import BecomeMissionary from "./pages/MissionaryLandingPage/Become/Become.jsx";
import MissionaryProfile from "./pages/MissionaryLandingPage/Find/MissionaryProfile.jsx";
import CauseDetail from "./pages/MissionaryLandingPage/Find/CauseDetail.jsx";
import ResetPasswordPage from "./pages/MissionaryLandingPage/components/auth/ResetPasswordPage.jsx";
import ReportAbusePage from "./pages/ReportAbusePage.jsx";
import NpoProfilePage from "./pages/NpoProfilePage.jsx";
/**
 * Checks if the current hostname is a subdomain.
 * This version correctly handles both 'localhost' for development and production domains.
 * @param {string} hostname - The window.location.hostname.
 * @returns {boolean} - True if it's a subdomain.
 */
const isSubdomain = (hostname) => {
  const parts = hostname.split(".");

  // Handle dev environment: anything ending with 'localhost' (e.g., 'missionary.localhost')
  if (hostname.endsWith("localhost")) {
    return parts.length > 1;
  }

  // Handle fake local domain like 'missionary.localhost.com'
  // OR real production domain like 'abc.nightbright.org'
  return parts.length > 2;
};

export default function App() {
  const [isMissionarySite, setIsMissionarySite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Determine which site to render based on the URL's hostname.
    if (isSubdomain(window.location.hostname)) {
      setIsMissionarySite(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null;
  }
  if (isMissionarySite) {
    return (
      <Routes>
        <Route element={<MainPublicLayout />}>
          <Route path="/" element={<MissionaryLandingPage />} />
          <Route path="/missionaries" element={<FindMissionary />} />
          <Route
            path="/find-missionary-profile/:id"
            element={<MissionaryProfile />}
          />
          <Route path="/causes" element={<FindCauses />} />
          <Route path="/about" element={<AboutMissionaryLanding />} />
          <Route path="/team" element={<Team />} />
          <Route path="/ways-to-give" element={<WayToGive />} />
          <Route path="/become" element={<BecomeMissionary />} />
          <Route path="/cause/:causeId" element={<CauseDetail />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/profile" element={<MissionaryProfilePage />}>
            {/* Default profile route redirects to the account page */}
            <Route index element={<Navigate to="account" replace />} />

            {/* These routes will render inside the <Outlet /> of MissionaryProfilePage */}
            <Route path="account" element={<AccountPage />} />
            <Route path="my-page" element={<MyPage />} />
            <Route path="causes" element={<CausesPage />} />
            <Route path="forum" element={<ForumPage />} />
            <Route path="wallet" element={<WalletPage />} />
            <Route path="donations" element={<DonationsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Otherwise, render the main, complex application for NPOs and Admins.
  return (
    <Routes>
      {/* --- PUBLIC NPO & AUTH ROUTES --- */}
      <Route element={<MinimalLayout />}>
        {/* Your existing public routes for the NPO landing page */}
        <Route path="npoLanding/pricing" element={<Pricing />} />
        <Route path="npoLanding/about-us" element={<AboutUs />} />
        <Route path="npoLanding/contact" element={<Contact />} />
        <Route path="npoLanding" element={<NpoLandingPage />} />
        <Route path="npoRegister" element={<NpoRegister/>}/>

        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Default route redirects to the NPO landing page */}
        <Route path="/" element={<Navigate to="/npoLanding" replace />} />
      </Route>

      {/* --- PROTECTED DASHBOARD ROUTES --- */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        {/* These routes render inside DashboardLayout's <Outlet> */}
        {/* <Route path="dashboard" element={<DashboardPage />} /> */}
        {/* These routes render inside DashboardLayout's <Outlet> */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="userProfile" element={<NpoProfilePage />}/>
        <Route path="npos" element={<NposPage />} />
        <Route path="missionaries" element={<MissionariesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="email-templates" element={<EmailTemplatesPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="report-abuse" element={<ReportAbusePage />} />
        <Route path="causes" element={<Causes />} />
        <Route path="bases" element={<BasePage />} />
        <Route path="donations" element={<DonationsPage />} />
        <Route path="donor-donations" element={<DonationPage />} />

        {/* --- Nested Profile Routes --- */}
        <Route path="profile" element={<MissionaryProfilePage />}>
          {/* Default profile route redirects to the account page */}
          <Route index element={<Navigate to="account" replace />} />
          {/* These routes will render inside the <Outlet /> of MissionaryProfilePage */}
          <Route path="account" element={<AccountPage />} />
          <Route path="my-page" element={<MyPage />} />
          <Route path="causes" element={<CausesPage />} />
          <Route path="forum" element={<ForumPage />} />
          <Route path="wallet" element={<WalletPage />} />
          <Route path="donations" element={<DonationsPage />} />
        </Route>

        {/* Fallback redirect for any other logged-in routes */}
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
