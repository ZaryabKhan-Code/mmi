/* eslint-disable react/no-unescaped-entities */
import { Grid, Card, Button, Typography, Box, CardMedia } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import queryString from 'query-string';


const Songcritique = () => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const { orderId, expertName, expertId, creditId } = queryParams;
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
                    <Typography variant="h5" fontSize={commonFontSize} component="div" fontWeight={700} sx={{ color: "#43B929", fontFamily: 'Manrope' }}>Song Critique Credit</Typography>
                    <Typography variant="body1" fontSize={smallFontSize} fontWeight={400} sx={{ color: "#BBBBBB", fontFamily: 'Manrope' }}>Order number: #{orderId}</Typography>
                    <Box className='mt-3 container' sx={{ maxWidth: '700px' }}>
                        <Typography variant="body1" fontSize={smallFontSize} fontWeight={300} sx={{ color: "#332E3C", fontFamily: 'Manrope' }}>
                            To send something to <span style={{ color: "#FF5A59" }}>{expertName}</span>, click the button labeled “submit media” at the bottom of the screen. Various file types are accepted. An included message is also available to send.
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px', flexDirection: "column" }}>
                    <Link to={`/cart?orderId=${orderId}&expertId=${expertId}&creditId=${creditId}&type=Song Critique`}>
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
                            Submit Media
                        </Button>
                    </Link>
                    <Link to={'/expert'}>
                        <Button
                            className='mt-3'
                            sx={{
                                padding: "14px 87px",
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
                            Back Home
                        </Button>
                    </Link>
                </Box>

            </Box>
        </Grid>
    );
}

export default Songcritique;
