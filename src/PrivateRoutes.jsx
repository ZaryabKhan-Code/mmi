import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

const PrivateRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token'));
    const token = localStorage.getItem('token');

    useEffect(() => {
        setIsAuthenticated(!!token);
    }, [token]);

    return isAuthenticated ? (
        <>
            <Outlet />
        </>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateRoutes;
