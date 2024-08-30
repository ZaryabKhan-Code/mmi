import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode'; // Correctly import jwtDecode
import axios from 'axios';
import Loading from './components/Loading';

const AuthSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [cookies, setCookie] = useCookies(['user']);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const fetchToken = async (code) => {
            try {
                const response = await axios.get(`https://auth-mmi-2d2a7783994f.herokuapp.com/get-token?code=${code}`);
                searchParams.delete('code')
                const data = response.data;

                const authToken = data.token;
                localStorage.setItem('token', authToken);
                const decodedToken = jwtDecode(authToken);
                setCookie('user', JSON.stringify(decodedToken), {
                    path: '/',
                    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    sameSite: 'none',
                    secure: true,
                });

                if (decodedToken.fieldsCompeleteStatus === false) {
                    navigate(`/profile/${decodedToken.id}`);
                } else {
                    navigate('/expert'); // or any other route
                }

            } catch (error) {
                navigate('/');
            }
        };

        if (code) {
            fetchToken(code);
        } else {
            navigate('/');
        }
    }, [navigate, setCookie, location]);

    return <Loading />;
};

export default AuthSuccess;
