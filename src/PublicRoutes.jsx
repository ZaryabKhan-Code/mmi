import React from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Assuming you're using a library like `jwt-decode`
import Navbar from './components/Navbar';
import { useCookies } from 'react-cookie';

const PublicRoutes = () => {
    const token = localStorage.getItem('token');
    let decodedToken = null;
    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const fieldsCompeleteStatus = userData ? userData?.fieldsCompeleteStatus : null;
    try {
        decodedToken = token ? jwtDecode(token) : null;
    } catch (e) {
        console.error('Invalid token:', e);
        decodedToken = null;
    }

    const auth = { token: token ? true : false };

    if (auth.token) {
        if (fieldsCompeleteStatus === false) {
            return <Navigate to={`/profile/${decodedToken.id}`} />;
        } else {
            console.log("fieldsCompeleteStatus", fieldsCompeleteStatus)
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
