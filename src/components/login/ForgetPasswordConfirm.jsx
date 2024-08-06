/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Grid, TextField, Typography, IconButton, Card } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Loading from '../Loading';

const ForgetPasswordConfirm = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        setEmail(emailParam);

        const wait = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoading(false);
        };
        wait();
    }, [location.search]);

    const commonFontSize = {
        xs: '1.8rem',
        sm: '2rem',
        md: '3rem',
        lg: '3rem',
        xl: '3rem'
    };

    return (
        <>
            {loading ? <Loading /> : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ease: "easeIn", duration: 0.6 }}
                >
                    <Grid className='container'>
                        <Card className='mt-4' sx={{ display: "flex", padding: "", flexDirection: "column", border: 'none', boxShadow: 'none', justifyContent: "center", alignItems: "center", backgroundColor: "rgba(255, 252, 249, 1)" }}>
                            <Typography className='mt-3'
                                variant="h4"
                                fontWeight='100'
                                sx={{ fontSize: commonFontSize, color: "rgba(51, 46, 60, 1)" }}
                            >Check your email</Typography>
                            <img src="/images/emailboxLarge.svg" className='mt-3' alt="Email box" />
                            <Typography
                                textAlign={'center'}
                                className='mt-3'
                                sx={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    margin: '0 auto',
                                    '@media (max-width: 600px)': {
                                        fontSize: '0.95rem',
                                        lineHeight: '1.2',
                                    }
                                }}
                            >
                                We’ve sent instructions on how to reset
                                your password to <span style={{ whiteSpace: 'nowrap', color: "rgba(120, 195, 251, 1)" }}>
                                    {email}
                                </span>
                            </Typography>
                            <Typography variant='h6' textAlign={'center'} sx={{
                                maxWidth: '80%', color: "rgba(255, 90, 89, 1)", fontWeight: 500, cursor: "pointer"
                            }} className='mt-3'>
                                Back to log in
                            </Typography>
                        </Card>
                    </Grid>
                </motion.div>
            )}
        </>
    );
};

export default ForgetPasswordConfirm;
