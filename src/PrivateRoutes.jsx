import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import Loading from './components/Loading';

const PrivateRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const verifyToken = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const response = await axios.get('https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/token/verify', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        verifyToken();

    }, []);

    if (isAuthenticated === null) {
        return <Loading />
    }

    return isAuthenticated ? (
        <>
            <Outlet />
        </>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateRoutes;
