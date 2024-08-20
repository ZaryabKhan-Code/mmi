import React from 'react';
import { Box, Card, Grid, Typography, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';
import Choice from './Choice';
import Favorites from './Favorites';
import Credits from './Credits/Credits';
import ChangePassword from './ChangePassword';
import Notifications from './Notifications';
import { useCookies } from 'react-cookie';
import { useNavigate, Link } from 'react-router-dom';


const Profile = () => {
    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const navigate = useNavigate();
    const PorfileImage = userData ? userData?.profilePicture : null;
    const firstName = userData ? userData?.firstName : null;
    const lastName = userData ? userData?.lastName : null;
    const Email = userData ? userData?.email : null;
    const id = userData ? userData?.id : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeIn", duration: 0.6 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column", marginTop: '16px', marginBottom: '16px' }}
        >
            <Card sx={{ maxWidth: "500px", width: "100%", padding: 2, textAlign: 'center', boxShadow: "none", backgroundColor: "rgba(255, 252, 249, 1)" }}>
                <Box sx={{ display: 'flex', flexDirection: "column", backgroundColor: "rgba(255, 138, 138, 1)", padding: 2, borderRadius: "5px", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar
                                src={PorfileImage}
                                alt={firstName}
                                sx={{
                                    width: { xs: 50, sm: 60 },
                                    height: { xs: 50, sm: 60 },
                                }}
                            >
                            </Avatar>
                        </Grid>
                        <Grid item xs sx={{ textAlign: 'left', marginTop: '5px' }}>
                            <Typography
                                variant="h6"
                                fontFamily="DM Sans"
                                lineHeight={'0.95rem'}
                                sx={{
                                    color: "rgba(255, 252, 249, 1)",
                                    fontWeight: 700,
                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }
                                }}
                            >
                                {firstName} {lastName}
                            </Typography>
                            <Typography
                                variant="body1"
                                fontFamily="DM Sans"
                                sx={{
                                    color: "rgba(255, 252, 249, 1)",
                                    fontWeight: 400,
                                    fontSize: { xs: '0.75rem', sm: '1rem', md: '1rem' }
                                }}
                            >
                                {Email}
                            </Typography>
                        </Grid>
                        <Grid sx={{ marginTop: '15px' }}>
                            <Link to={`/profile/${id}`}>
                                <Box component={'img'}
                                    src={"/images/editicon.svg"}
                                    alt="Edit"
                                    sx={{
                                        width: { xs: 24, sm: 28 },
                                    }}
                                />
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Card>
            {(location.pathname === '/onboardingprofile' || location.pathname === '/profile') && (
                <Choice />
            )}
            {/* {location.pathname === '/addcards' && (
                <Cards />
            )} */}
            {location.pathname === '/favorites' && (
                <Favorites />
            )}
            {location.pathname === '/credits' && (
                <Credits />
            )}
            {location.pathname === '/notifications' && (
                <Notifications />
            )}
            {location.pathname === '/changepassword' && (
                <ChangePassword />
            )}
            {location.pathname == '/onboardingprofile' && (
                <Button
                    sx={{
                        backgroundColor: "#FF5A59",
                        padding: "14px 80px",
                        color: "#fff",
                        fontSize: "15px",
                        borderRadius: "10px",
                        textTransform: "capitalize",
                        textAlign: "center",
                        '&:hover': {
                            backgroundColor: "#E04948",
                        }
                    }}
                    className='mt-4'
                >
                    Browse Experts
                </Button>
            )}
        </motion.div>
    );
}

export default Profile;
