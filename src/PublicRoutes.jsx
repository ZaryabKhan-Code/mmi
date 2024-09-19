/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import Loading from './components/Loading';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode'; // Assuming you're using a library like `jwt-decode`

const PublicRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [tokenData, setTokenData] = useState(null);
    const [cookies, , removeCookie] = useCookies(['user']);
    const token = localStorage.getItem('token');
    const userData = cookies.user;
    const fieldsCompeleteStatus = userData ? userData?.fieldsCompeleteStatus : null;

    const verifyToken = async () => {
        if (token) {
            try {
                const response = await axios.get('https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/token/verify', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                    setTokenData(jwtDecode(token)); // Decode the token if it's valid
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


    if (isAuthenticated) {
        if (fieldsCompeleteStatus === false) {
            return <Navigate to={`/profile/${tokenData.id}/new`} />;
        } else {
            return <Navigate to="/expert" />;
        }
    }

    return (
        <>
            <Outlet />
        </>
    );
};

export default PublicRoutes;
