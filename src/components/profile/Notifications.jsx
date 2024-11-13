import React, { useEffect, useState } from 'react';
import { Link, Box, Card, Grid, Typography, Avatar } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useCookies } from 'react-cookie';
import { UserNotifications } from '../../services/user';
const Notifications = () => {
    const [cookies, setCookie] = useCookies(['user']);
    const userData = cookies.user;
    const Id = userData ? userData?.id : null;
    const [data, setData] = useState([])
    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await UserNotifications(localStorage.getItem('token'), Id);
                setData(response.data.Credits)
            } catch (error) {
            }
        }
        fetchNotification();
    }, [Id])


    return (
        <Grid container className='mt-3' justifyContent="center">
            <Box sx={{ width: "100%", maxWidth: "490px" }} className='container'>
                {data.map((notification) => (
                    <Card
                        key={notification.id}
                        sx={{ textAlign: 'start', boxShadow: "none", backgroundColor: "rgba(255, 252, 249, 1)", marginBottom: 2 }}
                    >
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item>
                                <Avatar
                                    sx={{
                                        width: { xs: 60, sm: 70 },
                                        height: { xs: 60, sm: 70 },
                                    }}
                                    src={notification.profileExpertUrl}
                                >{notification.name}</Avatar>
                            </Grid>
                            <Grid item xs sx={{ textAlign: 'left', marginTop: '5px' }}>
                                <Typography
                                    variant="h6"
                                    fontFamily="Manrope"
                                    lineHeight={'0.95rem'}
                                    sx={{
                                        color: "#332E3C",
                                        fontWeight: 300,
                                        fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1rem' }
                                    }}
                                >
                                    {notification.name} has responded
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontFamily="Manrope"
                                    sx={{
                                        color: "#332E3C",
                                        fontWeight: 300,
                                        fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1rem' }
                                    }}
                                >
                                    {notification.orderType}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    fontFamily="Manrope"
                                    sx={{
                                        color: "#332E3C",
                                        fontWeight: 600,
                                        fontSize: { xs: '0.9rem', sm: '0.9rem', md: '0.9rem' }
                                    }}
                                >
                                    {notification.createdAt}
                                </Typography>
                                <Link
                                    href={`/sessions?id=${notification.id}&type=completed`}
                                    sx={{
                                        mt: 0,
                                        color: "#332E3C",
                                        textDecoration: "none",
                                        fontFamily: "Manrope",
                                        cursor: "pointer",
                                        fontSize: { xs: '0.8rem', sm: '0.8rem', md: '1rem' },
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    Watch Now <ArrowForwardIcon fontSize={'small'} />
                                </Link>
                            </Grid>
                        </Grid>
                    </Card>
                ))}
            </Box>
        </Grid>
    );
};

export default Notifications;
