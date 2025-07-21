// src/theme/index.js
import { createTheme } from '@mui/material/styles';

// This is your default theme for the login page or for users
// who don't have a custom color (like super_admins).
export const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#00A76F', // Your default green
      contrastText: '#ffffff',
    },
    // You can define other default colors here
  },
  typography: {
    fontFamily: '"Public Sans", sans-serif', // Example of setting a global font
  },
  // You can add other global overrides for components like Button, Paper, etc.
});

/**
 * This function takes a color string and generates a new theme.
 * @param {string} primaryColor - The hex color code (e.g., '#FF5733').
 * @returns {object} A Material-UI theme object.
 */
export const createCustomTheme = (primaryColor) => {
  // If no color is provided, return the default theme
  if (!primaryColor) {
    return defaultTheme;
  }
  
  return createTheme({
    palette: {
      primary: {
        main: primaryColor,
        contrastText: '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Public Sans", sans-serif',
    },
  });
};