import React from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Box,
  IconButton
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
 
import DonationCard from '../Home/DonationCard';
// import image1 from '../../../Assests/Images/image1.avif';
// import image2 from '../../Assets/Images/Carl.avif';
// import image3 from '../../Assets/Images/Jessica.avif';
 
const teamMembers = [
  {
    name: 'Nicolas Wallace',
    role: 'Founder / Director',
    description:
      'Husband and father of two boys. Nicolas began his career in ministry but then found his love for business. Now, he seeks to bring practical solutions to spread the gospel.',
    image: "https://static.wixstatic.com/media/fc3924_6cc3e77d18a44af6bd2703c5597235cf~mv2.jpg/v1/fill/w_806,h_668,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_5973.jpg",
    socials: ['facebook', 'linkedin']
  },
  {
    name: 'Carl Ladd',
    role: 'Board Member',
    description:
      'Vice President of Global for Mercy Chefs, Carl travels the world, bringing food and relief to refugees, individuals in warzones, and disaster areas and sharing the gospel.',
    image: "https://static.wixstatic.com/media/fc3924_69631181d821467c9b0d913f600787fa~mv2.png/v1/fill/w_806,h_668,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/carl%20headshot.png",
    socials: ['facebook']
  },
  {
    name: 'Jessica Alexander',
    role: 'Project Lead',
    description:
      "All things amazing... Jess is an auto-biography-loving, Jesus-following Jill-of-all-trades. Currently living in Italy, she's traveled the world, leading mission trips and sharing the gospel.",
    image: "https://static.wixstatic.com/media/fc3924_f642f0b82de1429fb14d9da63c8031e1~mv2.png/v1/fill/w_806,h_668,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/jess%20headshot.png",
    socials: ['facebook', 'linkedin']
  }
];
 
const Team = () => {
  return (
    <Box sx={{ px: 2, py: 6, backgroundColor: "#fff" }}>
      {/* Header */}
      <Typography variant="h3" align="center" color="#000000" gutterBottom>
        Meet the Team
      </Typography>
      <Typography variant="body1" align="center" sx={{ color:"#000000", maxWidth: 700, mx: 'auto', mb: 6 }}>
        Night Bright was founded in 2021 to provide a practical solution for raising funds
        to send missionaries to all the unreached people of the world.
      </Typography>
 
      {/* Team Cards */}
      <Grid container spacing={4} justifyContent="center" sx={{ flexWrap: 'nowrap', p: '50px' }}>
        {teamMembers.map((member, index) => (
          <Grid item key={index} xs={12} sm={4} md={4}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 2,
                backgroundColor: '#f9f9f9'
              }}
            >
              {/* Image */}
              <Box
                component="img"
                src={member.image}
                alt={member.name}
                sx={{
                  width: '100%',
                  height: '300px',          // fixed height ensures all images are equal
                  objectFit: 'cover',
                  borderTopLeftRadius: 8,   // optional: rounded corners matching the card
                  borderTopRightRadius: 8
                }}
              />
 
              {/* Content */}
              <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {member.role}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {member.description}
                </Typography>
 
                {/* Social Icons */}
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  {member.socials.includes('facebook') && (
                    <IconButton size="small">
                      <FacebookIcon fontSize="small" />
                    </IconButton>
                  )}
                  {member.socials.includes('linkedin') && (
                    <IconButton size="small">
                      <LinkedInIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
 
 
      {/* Donation Section */}
      <Box mt={8}>
        <DonationCard/>
      </Box>
    </Box>
  );
};
 
export default Team;
 
 
 
 