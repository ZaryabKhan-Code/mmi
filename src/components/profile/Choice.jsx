import React from 'react'
import { Box, Card, Grid, Typography, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const Choice = () => {
    const sections = [
        {
            icon: "/images/personIcon2.svg",
            title: "Notifications",
            description: "Change how you are notified",
            link: '/notifications'
        },
        {
            icon: "/images/heart.svg",
            title: "Favorites",
            link: '/favorites'
        },
        // {
        //     icon: "/images/credits.svg",
        //     title: "Credits",
        //     link: '/credits'
        // },
        // {
        //     icon: "/images/payment.svg",
        //     title: "Payment",
        //     link: '/addcards'
        // },
        {
            icon: "/images/key.svg",
            title: "Change Password",
            link: '/changepassword'
        },
        {
            icon: "/images/help.svg",
            title: "Help & Support",
            link: '/help'
        },
        {
            icon: "/images/logout.svg",
            title: "Log out",
            link: '/logout'
        },
    ];
    return (
        <Card sx={{ maxWidth: "500px", width: "100%", padding: 2, textAlign: 'center', boxShadow: "none", backgroundColor: "rgba(255, 252, 249, 1)" }}>
            <Box sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 252, 249, 1)", padding: 3, borderRadius: "5px", boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', }}>
                {sections.map((section, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        transition={{ ease: "easeInOut", duration: 0.3 }}
                        style={{ width: '100%' }}
                    >
                        <Link to={section.link} style={{ textDecoration: "none" }}>
                            <Grid container spacing={1.5} alignItems="center" sx={{
                                marginBottom: index !== sections.length - 1 ? "15px" : 0,
                                cursor: "pointer", width: "100%", paddingBottom: "12px",
                                '&:hover': {
                                    transform: 'scale(1.02)'
                                },
                                transition: 'all 0.3s ease-in-out'
                            }}>
                                <Grid item>
                                    <Box sx={{
                                        backgroundColor: "#DCDCDC",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: { xs: 35, sm: 40 },
                                        height: { xs: 35, sm: 40 },
                                    }}>

                                        <Box
                                            component={'img'}
                                            src={section.icon}

                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs sx={{ textAlign: 'left' }}>
                                    <Typography
                                        variant="h6"
                                        fontFamily="DM Sans"
                                        sx={{
                                            color: "rgba(51, 46, 60, 1)",
                                            fontWeight: 700,
                                            fontSize: { xs: '0.9rem', sm: '0.9rem', md: '1rem' }
                                        }}
                                    >
                                        {section.title}
                                    </Typography>
                                    {section.description ? (
                                        <Typography
                                            variant="body1"
                                            lineHeight={'0.8rem'}
                                            fontFamily="DM Sans"
                                            gutterBottom
                                            sx={{
                                                color: "rgba(152, 142, 169, 1)",
                                                fontWeight: 400,
                                                fontSize: { xs: '0.8rem', sm: '0.8rem', md: '0.9rem' }
                                            }}
                                        >
                                            {section.description}
                                        </Typography>
                                    ) : null}
                                </Grid>
                                <Grid sx={{ marginTop: '15px' }}>
                                    <Box component={'img'}
                                        src={'/images/RightArrow.svg'}
                                        alt="Edit"
                                        sx={{
                                            width: { xs: 8, sm: 9 },
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Link>
                    </motion.div>
                ))}
            </Box>
        </Card>
    )
}

export default Choice
