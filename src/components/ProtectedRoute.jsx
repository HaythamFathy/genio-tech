import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles, user }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // User is not logged in, redirect to login page (which is the root in this app)
    return <Navigate to="/" replace />;
  }

  // If user object (appUser) is not yet loaded, wait for it
  if (!user) {
    return null; 
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user.role || !allowedRoles.includes(user.role)) {
      // User is logged in but does not have the allowed role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
