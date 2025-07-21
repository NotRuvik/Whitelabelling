import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../pages/MissionaryLandingPage/components/NavBar'; // Adjust path if needed
import { Box } from '@mui/material';
import Footer from '../pages/MissionaryLandingPage/components/Footer';

const MainPublicLayout = () => {
  return (
    <Box sx={{ backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      <NavBar />
      <Box > {/* Add padding-top to prevent content from hiding behind the fixed NavBar */}
        <Outlet /> 
      </Box>
      <Footer />
    </Box>
  );
};

export default MainPublicLayout;