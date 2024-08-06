import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Loading from './components/Loading';

const Logout = () => {
    const [, , removeCookie] = useCookies(['user']);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLogout = async () => {
            localStorage.removeItem('token');
            removeCookie('user');
            // Delay for 1 second (1000 ms)
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLoading(false);
            navigate('/login');
        };

        handleLogout();
    }, [navigate, removeCookie]);

    if (loading) {
        return <Loading />;
    }

    return null;
};

export default Logout;
