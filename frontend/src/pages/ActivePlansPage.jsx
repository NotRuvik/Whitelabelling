import React from 'react';
import { Typography, Paper } from '@mui/material';

const ActivePlansPage = () => {
    return (
        <Paper sx={{p: 3}}>
            <Typography variant="h4">View Active Plans</Typography>
            <Typography>A list of active subscription plans will be displayed here.</Typography>
        </Paper>
    );
}

export default ActivePlansPage;