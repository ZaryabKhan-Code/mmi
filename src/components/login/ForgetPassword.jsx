/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Grid, TextField, Typography, Card } from '@mui/material';
import React, { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ForgetPasswordGetToken } from '../../services/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import CustomSnackbar from '../../CustomSnackbar';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../Loading';

const ForgetPassword = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();
    const [loadingpage, setLoadingpage] = useState(false)
    useEffect(() => {
        const wait = async () => {
            setLoadingpage(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setLoadingpage(false);
        };
        wait();
    }, []);
    const onSubmit = async (data) => {
        setLoading(true)
        try {
            await ForgetPasswordGetToken(data.email);
            navigate(`/forgetpasswordconfirm?email=${data.email}`);
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(error.response.data.message)
        }
        setLoading(false)
    };

    const commonFontSize = {
        xs: '1.8rem',
        sm: '2rem',
        md: '3rem',
        lg: '3rem',
        xl: '3rem'
    };
    const maxWidthField = {
        xs: '100%',
        lg: '400px'
    };

    return (
        <>{loadingpage ? <Loading /> : (<>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: "easeIn", duration: 0.6 }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid className='container'>
                        <Card className='mt-4' sx={{ display: "flex", padding: "0px 20px 0px 30px", flexDirection: "column", border: 'none', boxShadow: 'none', width: "100%", maxWidth: '400px', backgroundColor: "rgba(255, 252, 249, 1)" }}>
                            <Box>
                                <Link to={'/login'}>
                                    <img src='/images/backArrow.svg' style={{ cursor: "pointer" }} />
                                </Link>
                            </Box>
                            <Typography className='mt-3'
                                variant="h4"
                                fontWeight='100'
                                sx={{ fontSize: commonFontSize }}
                            >Forgot</Typography>
                            <Typography
                                variant="h4"
                                fontWeight='100'
                                gutterBottom
                                sx={{ fontSize: commonFontSize, lineHeight: "2.2rem" }}
                            >password?</Typography>
                            <TextField
                                className='mt-3'
                                placeholder='Enter your email address'
                                variant='outlined'
                                sx={{
                                    maxWidth: maxWidthField,
                                    '& .MuiInputBase-input::placeholder': {
                                        fontSize: '0.957rem',
                                        fontWeight: '600',
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            border: '1.5px solid',
                                            borderColor: 'rgba(51, 46, 60, 1)', // default border color
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'rgba(51, 46, 60, 1)', // border color when focused
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <img src='/images/emailbox.svg' height={'25px'} style={{ marginRight: '5px' }} />
                                        </InputAdornment>
                                    ),
                                    style: {
                                        borderRadius: '12px',
                                    }
                                }}
                                {...register('email', { required: 'Email is required', pattern: { value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message: 'Enter a valid email address' } })}
                                error={!!errors.email}
                                helperText={errors.email ? errors.email.message : ''}
                            />
                            <Typography className='mt-4 ml-1' sx={{
                                maxWidth: maxWidthField,
                                lineHeight: '16.39px',
                                fontSize: '15px',
                                fontWeight: 400,
                                color: '#988EA9'
                            }}><span style={{ color: '#FF5A59' }}>*</span> We will send you a message to set or reset your new password.</Typography>

                            <Grid className='mt-4 ml-1' sx={{ alignItems: 'center', display: 'flex', justifyContent: "space-between" }}>
                                <Grid>
                                    <Typography
                                        variant="h5"
                                        gutterBottom
                                        fontWeight='600'
                                        sx={{ color: "rgba(51, 46, 60, 1)" }}
                                    >Send Code</Typography>
                                </Grid>
                                <Grid item>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            width: 45,
                                            cursor: "pointer",
                                            height: 45,
                                            borderRadius: '50%',
                                            backgroundColor: '#FF5A59',
                                            boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.2)', // Add your desired box shadow here
                                        }}
                                        className='mb-3'
                                        onClick={handleSubmit(onSubmit)}
                                    >
                                        {loading ? <><FontAwesomeIcon icon={faSpinner} size="xl" spin style={{ color: "#fff" }} /></> : <ArrowForwardIcon sx={{ color: "white" }} />}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </form>
                <CustomSnackbar
                    open={openSnackbar}
                    message={snackbarMessage}
                    severity={snackbarSeverity}
                    onClose={() => setOpenSnackbar(false)}
                />
            </motion.div>
        </>)}
        </>
    );
}

export default ForgetPassword;
