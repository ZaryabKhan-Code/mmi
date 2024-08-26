import { Box, Grid, Button, Typography, Divider, Card, SvgIcon } from '@mui/material';
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Landing = () => {
    const commonFontSize = {
        xs: '1.8rem',
        sm: '2rem',
        md: '3rem',
        lg: '3rem',
        xl: '3rem'
    };
    const smallFontSize = {
        xs: '18px',
        sm: '18px',
        md: '22px',
        lg: '22px',
        xl: '22px'
    }
    const widthMax = {
        xs: '80%',
        sm: '80%',
        md: '38vw',
        lg: '28vw'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeIn", duration: 0.6 }}
        >
            <Grid
                container
                direction="column"

                className='container mt-4'
                sx={{ display: "flex" }}
            >
                <Typography
                    variant="h4"
                    className='mt-2'
                    fontWeight='600'
                    textAlign='center'
                    sx={{ fontSize: commonFontSize }}
                >
                    My Music Industry:
                </Typography>
                <Typography
                    variant="body1"
                    color="#332E3C"
                    fontWeight='100'
                    textAlign={'center'}
                    sx={{ fontSize: commonFontSize }}
                >
                    Expertise on
                </Typography>
                <Typography
                    gutterBottom
                    variant="body1"
                    color="#332E3C"
                    lineHeight='2.4rem'
                    fontWeight='100'
                    textAlign={'center'}
                    sx={{ fontSize: commonFontSize }}
                >
                    demand.
                </Typography>
                <Typography
                    color="#988EA9"
                    fontWeight='500'
                    sx={{
                        fontSize: {
                            xs: '18px',
                            sm: '18px',
                            md: '22px',
                            lg: '22px',
                            xl: '22px'
                        },
                        textAlign: "center",
                        wordBreak: "break-word",
                        wordWrap: "break-word",
                        hyphens: "auto",
                        maxWidth: {
                            xs: '80%',
                            sm: '80%',
                            md: '38vw',
                            lg: '28vw'
                        },
                        margin: '0 auto'
                    }}
                >
                    Be one of the first to connect with the people who know how to get you to the next level. Join us.
                </Typography>
                <Grid sx={{
                    display: "flex",
                    justifyContent: 'center',
                }}>
                    <Link to={"/signup"}>
                        <Button
                            sx={{
                                backgroundColor: "#FF5A59",
                                fontSize: "15px",
                                padding: {
                                    xs: "12px 80px",
                                    sm: "12px 130px",
                                    md: "12px 130px",
                                    lg: "12px 130px",
                                    xl: "12px 150px"
                                },
                                color: "#fff",
                                borderRadius: "10px",
                                textTransform: "capitalize",
                                '&:hover': {
                                    backgroundColor: "#E04948",
                                }
                            }}
                            className='mt-3'
                        >
                            Get Started
                        </Button>
                    </Link>
                </Grid>
                <Grid container justifyContent="center" alignItems="center" className='mt-3'>
                    <Grid item xs={6} sm={4}>
                        <img src="/images/landingImage1.svg" style={{ width: '100%' }} />
                    </Grid>
                    <Grid item xs={6} sm={4}>
                        <img src="/images/landingImage2.svg" style={{ width: '100%' }} />
                    </Grid>
                </Grid>
                <Typography
                    variant="body1"
                    color="#332E3C"
                    fontWeight='400'
                    textAlign={'center'}
                    sx={{ fontSize: commonFontSize }}
                >
                    Essential tools for
                </Typography>
                <Typography
                    variant="body1"
                    lineHeight='2.5rem'
                    color="#332E3C"
                    fontWeight='400'
                    textAlign={'center'}
                    sx={{ fontSize: commonFontSize }}
                >
                    propelling your music
                </Typography>
                <Typography
                    variant="body1"
                    color="#332E3C"
                    fontWeight='400'
                    gutterBottom
                    textAlign={'center'}
                    sx={{ fontSize: commonFontSize }}
                >
                    career forward.
                </Typography>
                <Typography
                    color="#332E3C"
                    fontWeight='400'
                    sx={{
                        fontSize: smallFontSize,
                        textAlign: "center",
                    }}
                >
                    Get personalized advice from industry
                </Typography>
                <Typography
                    color="#332E3C"
                    fontWeight='400'
                    sx={{
                        fontSize: smallFontSize,
                        textAlign: "center",
                        margin: '0 auto'
                    }}
                >
                    professionals who have achieved your dreams,
                </Typography>
                <Typography
                    color="#332E3C"
                    fontWeight='400'
                    gutterBottom
                    sx={{
                        fontSize: smallFontSize,
                        textAlign: "center",
                        margin: '0 auto'
                    }}
                >
                    tailored specifically for your goals.
                </Typography>
                <Typography
                    variant="body1"
                    color="#332E3C"
                    fontWeight='400'
                    className='mt-3'
                    gutterBottom
                    textAlign={'center'}
                    sx={{ fontSize: commonFontSize }}
                >
                    Pricing
                </Typography>
                <Typography
                    color="#332E3C"
                    fontWeight='400'
                    gutterBottom
                    sx={{
                        fontSize: smallFontSize,
                        textAlign: "center",
                        margin: '0 auto'
                    }}
                >
                    Sign up for free. Interactions available at all
                </Typography>
                <Typography
                    color="#332E3C"
                    fontWeight='400'
                    gutterBottom
                    sx={{
                        fontSize: smallFontSize,
                        textAlign: "center",
                        margin: '0 auto'
                    }}
                >
                    price points.
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    className='mt-4 mb-5'
                >
                    <Card sx={{ maxWidth: '400px', padding: "0px 20px", backgroundColor: '#EEF7FF', boxShadow: "none", borderRadius: "10px" }}>
                        <Typography
                            variant="body1"
                            color="#332E3C"
                            fontWeight='400'
                            className='mt-3'
                            gutterBottom
                            textAlign={'start'}
                            sx={{ fontSize: commonFontSize }}
                        >
                            Simple
                        </Typography>
                        <Typography
                            color="#332E3C"
                            fontWeight='400'
                            gutterBottom
                            sx={{
                                fontSize: smallFontSize,
                                textAlign: "start",
                            }}
                        >
                            Keep track of your interactions, gain networking
                            opportunities, and receive critiques of everything from
                            songs and lyrics, to contracts, social media, and more.
                        </Typography>
                        <Divider className="mt-3" />
                        <Box mt={2} mb={3}>
                            <Grid container spacing={2} direction="column">
                                <Grid item container alignItems="center" spacing={1}>
                                    <Grid item>
                                        <SvgIcon component={CheckIcon} />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            color="#332E3C"
                                            fontWeight='400'
                                            sx={{ fontSize: '17px' }}
                                        >
                                            Video messaging
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems="center" spacing={1}>
                                    <Grid item>
                                        <SvgIcon component={CheckIcon} />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            color="#332E3C"
                                            fontWeight='400'
                                            sx={{ fontSize: '17px' }}
                                        >
                                            Song critiques
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems="center" spacing={1}>
                                    <Grid item>
                                        <SvgIcon component={CheckIcon} />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            color="#332E3C"
                                            fontWeight='400'
                                            sx={{ fontSize: '17px' }}
                                        >
                                            Live video calls - Coming Soon!
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container alignItems="center" spacing={1}>
                                    <Grid item>
                                        <SvgIcon component={CheckIcon} />
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            color="#332E3C"
                                            fontWeight='400'
                                            sx={{ fontSize: '17px' }}
                                        >
                                            Database of all your interactions
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Link to={"/signup"}>
                                <Button
                                    sx={{
                                        backgroundColor: "#FF5A59",
                                        width: "100%",
                                        padding: "14px 0px",
                                        color: "#fff",
                                        borderRadius: "10px",
                                        fontSize: "15px",
                                        textTransform: "capitalize",
                                        textAlign: "center",
                                        '&:hover': {
                                            backgroundColor: "#E04948",
                                        }
                                    }}
                                    className='mt-4'
                                >
                                    Get Started
                                </Button>
                            </Link>

                        </Box>
                    </Card>
                </Box>
            </Grid>
        </motion.div>
    );
}

export default Landing;
