import React from 'react';
import { Grid, Typography, Card, CardContent, Button } from '@mui/material';
// import './team.css'; // Optional CSS for fine-tuning
import DonationCard from '../MissionaryLandingPage/Home/DonationCard';

const Team = () => {
  return (
    <div className="team-container">
      {/* Team Section */}
      <Grid container spacing={3} justifyContent="center" sx={{ padding: 2 ,mt:10}}>
        <Grid item xs={12}>
          <Typography variant="h3" align="center" gutterBottom sx={{mt:"10"}}>
            Meet the Team —
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Night Bright was founded in 2021 to provide a practical solution for raising funds
            to send missionaries to all the unreached people of the world.
          </Typography>
        </Grid>
        <Grid item xs={12} container spacing={3} justifyContent="center">
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <img src="nicolas-wallace.jpg" alt="Nicolas Wallace" style={{ width: '100%' }} />
                <Typography variant="h6">Nicolas Wallace</Typography>
                <Typography variant="subtitle1">Founder / Director</Typography>
                <Typography variant="body2">
                  Husband and father to two boys. Nicolas is a business owner. He brings practical
                  solutions to spread the gospel.
                </Typography>
                <div className="social-icons">
                  <span>ⓕ</span> <span>ⓘ</span>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <img src="carl-laird.jpg" alt="Carl Laird" style={{ width: '100%' }} />
                <Typography variant="h6">Carl Laird</Typography>
                <Typography variant="subtitle1">Board Member</Typography>
                <Typography variant="body2">
                  Vice President Global for Mercy Relief. Carl refugees, individuals in warzones, and disaster areas.
                </Typography>
                <div className="social-icons">
                  <span>ⓕ</span> <span>ⓘ</span>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <img src="jessica-alexander.jpg" alt="Jessica Alexander" style={{ width: '100%' }} />
                <Typography variant="h6">Jessica Alexander</Typography>
                <Typography variant="subtitle1">Project Lead</Typography>
                <Typography variant="body2">
                  All things amazing. Jess is an auto-biography loving, Jesus following all-in-one missionary.
                  One of those rare leaders who shares the gospel.
                </Typography>
                <div className="social-icons">
                  <span>ⓕ</span> <span>ⓘ</span>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

    <DonationCard/>
    </div>
  );
};

export default Team;