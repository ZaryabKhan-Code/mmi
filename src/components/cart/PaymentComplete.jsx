/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { Grid, Card, Button, Typography, Box, CardMedia } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentComplete = ({ type, orderId, expertName, expertId, creditId }) => {
    console.log('TYPE', type)
    const commonFontSize = {
        xs: '1.5rem',
        sm: '1.5rem',
        md: '1.5rem',
        lg: '1.8rem',
        xl: '1.8rem'
    };

    const smallFontSize = {
        xs: '14px',
        sm: '14px',
        md: '16px',
        lg: '17px',
        xl: '17px'
    };

    return (
        <Grid
            container
            className='mt-3'
            justifyContent="center"
            alignItems="center"
        >
            <Box className='container' sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <Card sx={{ boxShadow: "none", position: 'relative', backgroundColor: "rgba(255, 252, 249, 1)", maxWidth: 460, padding: 2 }}>
                    <CardMedia
                        src='/images/checkout.svg'
                        component={'img'}
                        sx={{
                            width: {
                                xs: '100px',
                                sm: '150px',
                                md: '150px',
                                lg: '150px',
                                xl: '150px'
                            },
                            height: 'auto'
                        }}
                    />
                </Card>
                <Box className='mt-2' sx={{ textAlign: "center" }}>
                    <Typography variant="h5" fontSize={commonFontSize} component="div" fontWeight={700} sx={{ color: "#43B929", fontFamily: 'Manrope' }}>Order completed!</Typography>
                    <Typography variant="body1" fontSize={smallFontSize} fontWeight={400} sx={{ color: "#BBBBBB", fontFamily: 'Manrope' }}>Order number: #{orderId}</Typography>
                    {type === 'quickhit' ? (
                        <>
                            <Box className='mt-3 container' sx={{ maxWidth: '700px' }}>
                                <Typography variant="body1" fontSize={smallFontSize} fontWeight={300} sx={{ color: "#332E3C", fontFamily: 'Manrope' }}>
                                    To send your video message to {expertName}, click
                                    the record button at the bottom of the screen.
                                    You can record the video as many times as
                                    needed, but only submit it when you're
                                    confident it's the final version you want to
                                    send.
                                </Typography>
                            </Box>
                            <Box className='mt-4 container' sx={{ maxWidth: '700px' }}>
                                <Typography variant="body1" fontSize={smallFontSize} fontWeight={300} sx={{ color: "#332E3C", fontFamily: 'Manrope' }}>
                                    Audio and text options are available on the
                                    next screen. If would prefer to send your video
                                    another time, you can access your video credit
                                    in your profile.
                                </Typography>
                            </Box>
                        </>
                    ) :
                        <Box className='mt-3 container' sx={{ maxWidth: '700px' }}>
                            <Typography variant="body1" fontSize={smallFontSize} fontWeight={300} sx={{ color: "#332E3C", fontFamily: 'Manrope' }}>
                                To send something to {expertName}, click the button labeled “submit media” at the bottom of the screen. Various file types are accepted. An included message is also available to send.
                            </Typography>
                        </Box>
                    }
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px', flexDirection: "column" }}>
                    {type === 'quickhit' ? (
                        <Link to={`/cart?orderId=${orderId}&expertId=${expertId}&type=${type}&creditId=${creditId}`}>

                            <Button
                                sx={{
                                    backgroundColor: "#FF5A59",
                                    padding: "14px 80px",
                                    color: "#fff",
                                    fontSize: "16px",
                                    borderRadius: "10px",
                                    textTransform: "capitalize",
                                    textAlign: "center",
                                    '&:hover': {
                                        backgroundColor: "#E04948",
                                    }
                                }}
                            >
                                Record Video
                            </Button>
                        </Link>
                    ) :
                        <Link to={`/cart?orderId=${orderId}&expertId=${expertId}&type=${type}&creditId=${creditId}`}>
                            <Button
                                sx={{
                                    backgroundColor: "#FF5A59",
                                    padding: "14px 102px",
                                    color: "#fff",
                                    fontSize: "16px",
                                    borderRadius: "10px",
                                    textTransform: "capitalize",
                                    textAlign: "center",
                                    '&:hover': {
                                        backgroundColor: "#E04948",
                                    }
                                }}
                            >
                                Submit Media
                            </Button>
                        </Link>
                    }
                    <Link to={`/expert`}>

                        <Button
                            className='mt-3'
                            sx={{
                                padding: "14px 80px",
                                color: "#988EA9",
                                fontSize: "16px",
                                borderRadius: "10px",
                                border: '3px solid #988EA9',
                                textTransform: "capitalize",
                                textAlign: "center",
                                '&:hover': {
                                    backgroundColor: "none",
                                }
                            }}
                        >
                            Continue Browsing
                        </Button>
                    </Link>
                </Box>

            </Box>
        </Grid>
    );
}

export default PaymentComplete;
