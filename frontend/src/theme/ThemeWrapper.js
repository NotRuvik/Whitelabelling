// src/theme/ThemeWrapper.js
import React, { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { createCustomTheme, defaultTheme } from './index';

const ThemeWrapper = ({ children }) => {
    const { user } = useAuth();

    // We use useMemo to prevent re-creating the theme on every single render.
    // It will only recalculate when the `user` object changes (e.g., on login/logout).
    const theme = useMemo(() => {
        // If a user is logged in and has a themeColor, create a custom theme
        if (user && user.themeColor) {
            return createCustomTheme(user.themeColor);
        }
        // Otherwise, fall back to the default green theme
        return defaultTheme;
    }, [user]);

    return (
        <ThemeProvider theme={theme}>
            {/* CssBaseline applies a sensible default reset to your app's styles */}
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};

export default ThemeWrapper;