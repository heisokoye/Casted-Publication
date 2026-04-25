import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * A component that protects a route, redirecting to the login page if the user is not authenticated.
 * @param {{children: JSX.Element}} props The component props.
 * @returns {JSX.Element} The child component if authenticated, otherwise a redirect.
 */
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    return token ? children : <Navigate to="/admin" />;
};

export default ProtectedRoute;