// import React from 'react';
// import {
//   Box,
//   Paper,
//   Typography,
//   Tooltip,
//   Slide,
//   useMediaQuery,
//   useTheme,
// } from '@mui/material';
// import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
// import { styled } from '@mui/material/styles';

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'flex-start',
//   gap: theme.spacing(2),
//   padding: theme.spacing(2),
//   borderRadius: theme.spacing(2),
//   boxShadow: '0 6px 14px rgba(0, 128, 0, 0.08)',
//   background: theme.palette.background.paper,
//   borderLeft: `4px solid ${theme.palette.success.main}`,
//   transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//   '&:hover': {
//     transform: 'scale(1.015)',
//     boxShadow: '0 8px 20px rgba(0, 128, 0, 0.12)',
//   },
// }));

// const IconWrapper = styled(Box)(({ theme }) => ({
//   backgroundColor: theme.palette.success.light,
//   color: theme.palette.success.dark,
//   borderRadius: '50%',
//   padding: theme.spacing(1),
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   minWidth: 40,
//   minHeight: 40,
// }));

// const ActivityItem = ({ message, time }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   return (
//     <Slide direction="up" in timeout={400}>
//       <StyledPaper sx={{ flexDirection: isMobile ? 'column' : 'row' }}>
//         <IconWrapper>
//           <NotificationsActiveIcon fontSize="small" />
//         </IconWrapper>
//         <Box>
//           <Typography
//             variant="body1"
//             fontWeight="bold"
//             sx={{ color: 'success.main', mb: 0.5 }}
//           >
//             {message}
//           </Typography>
//           <Tooltip title={new Date(time).toLocaleString()}>
//             <Typography
//               variant="caption"
//               color="text.secondary"
//               sx={{ fontSize: '0.75rem' }}
//             >
//               {new Date(time).toLocaleDateString()} ·{' '}
//               {new Date(time).toLocaleTimeString([], {
//                 hour: '2-digit',
//                 minute: '2-digit',
//               })}
//             </Typography>
//           </Tooltip>
//         </Box>
//       </StyledPaper>
//     </Slide>
//   );
// };

// export default ActivityItem;

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  Slide,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { styled } from '@mui/material/styles';

// Styled container with soft modern styling
const StyledPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.light + '22', // translucent background
  color: theme.palette.success.main,
  borderRadius: '50%',
  padding: theme.spacing(1.2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
}));

const ActivityItem = ({ message, time }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Slide direction="up" in timeout={350}>
      <StyledPaper sx={{ flexDirection: isMobile ? 'column' : 'row' }}>
        <IconWrapper>
          <NotificationsActiveIcon fontSize="small" />
        </IconWrapper>

        <Box>
          <Typography
            variant="body1"
            fontWeight={500}
            color="text.primary"
            sx={{ mb: 0.5 }}
          >
            {message}
          </Typography>

          <Tooltip title={new Date(time).toLocaleString()}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '0.75rem' }}
            >
              {new Date(time).toLocaleDateString()} ·{' '}
              {new Date(time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Tooltip>
        </Box>
      </StyledPaper>
    </Slide>
  );
};

export default ActivityItem;
