import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login if user is not authenticated
    // return <Navigate to="/login" replace />;
    return <Navigate to="/npoLanding" replace />;
  }

  return children;
};

export default PrivateRoute;