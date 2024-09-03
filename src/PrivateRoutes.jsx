/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './components/Loading';
import { useCookies } from 'react-cookie';
const PrivateRoutes = () => {
    const [, , removeCookie] = useCookies(['user']);
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = localStorage.getItem('token');
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
                    localStorage.removeItem('token');
                    removeCookie('user');

                }
            } catch (error) {
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                removeCookie('user');

            }
        } else {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            removeCookie('user');


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
