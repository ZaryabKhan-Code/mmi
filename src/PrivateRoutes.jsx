/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './components/Loading';

const PrivateRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const verifyToken = async () => {

        if (token) {
            try {
                const response = await axios.get('https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/token/verify', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    navigate('/logout')
                }
            } catch (error) {
                setIsAuthenticated(false);
                navigate('/logout')
            }
        } else {
            setIsAuthenticated(false);
            navigate('/logout')

        }
    };

    useEffect(() => {
        verifyToken();
    }, [token]);

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
