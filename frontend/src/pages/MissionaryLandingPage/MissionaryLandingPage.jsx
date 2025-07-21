import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './MissionaryLanding.css'; 
import { Box, Container, Typography } from '@mui/material';
import Home from './Home/Home';

const MissionaryLandingPage = () => {
    return (
        //className="main-content"
        <Box >
               <Home/>
        </Box>
    );
};

export default MissionaryLandingPage;