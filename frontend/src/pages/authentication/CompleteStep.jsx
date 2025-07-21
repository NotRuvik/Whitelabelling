// import React, { useEffect } from 'react';
// import Typography from '@mui/material/Typography';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// import Box from '@mui/material/Box';

// const CompleteStep = () => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       window.location.href = 'http://localhost:3000/';
//     }, 5000); // 5000 ms = 5 seconds

//     return () => clearTimeout(timer); // Cleanup if component unmounts early
//   }, []);

//   return (
//     <Box
//       sx={{
//         textAlign: 'center',
//         p: 3,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         minHeight: '400px',
//       }}
//     >
//       <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
//       <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
//         Your registration has been submitted for approval!
//       </Typography>
//       <Typography variant="body1" sx={{ mt: 1 }}>
//         Thank you for signing up. Your request is now being reviewed by our team.
//       </Typography>
//       <Typography variant="body1">
//         You will receive an email notification once your organization is approved.
//       </Typography>
//     </Box>
//   );
// };

// export default CompleteStep;
import React from 'react'; // No need for useEffect now
import Typography from '@mui/material/Typography';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button'; // Import Button component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const CompleteStep = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleDoneClick = () => {
    navigate('/'); // Navigate to the homepage
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
      }}
    >
      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
      <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
        Your registration has been submitted for approval!
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Thank you for signing up. Your request is now being reviewed by our team.
      </Typography>
      <Typography variant="body1">
        You will receive an email notification once your organization is approved.
      </Typography>

      {/* New Done button */}
      <Button
        variant="contained" // Use contained variant for a prominent button
        color="primary"     // Use primary color or adjust as needed
        onClick={handleDoneClick}
        sx={{ mt: 3 }} // Add some top margin to separate from text
      >
        Done
      </Button>
    </Box>
  );
};

export default CompleteStep;