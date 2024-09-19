/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Grid, TextField, Typography, IconButton, Card } from '@mui/material';
import React, { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { LoginUserPost } from '../../services/auth';
import CustomSnackbar from '../../CustomSnackbar';
import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'react-cookie';

const Login = () => {
    const { handleSubmit, control, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const [cookies, setCookie] = useCookies(['user']);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await LoginUserPost(data);
            localStorage.setItem('token', response.data.token)
            const decodedToken = jwtDecode(response.data.token);
            setCookie('user', JSON.stringify(decodedToken), {
                path: "/",
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                sameSite: 'none',
                secure: true,
            });
            if (decodedToken.fieldsCompeleteStatus === false) { navigate(`/profile/${decodedToken.id}/new`); }
            else { navigate('/login') }
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(error.response.data.message)
        } finally {
            setLoading(false);
        }
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeIn", duration: 0.6 }}
        >
            <Grid className='container'>
                <Card className='mt-4' sx={{ display: "flex", padding: "0px 20px 0px 30px", flexDirection: "column", border: 'none', boxShadow: 'none', width: "100%", maxWidth: '400px', backgroundColor: "rgba(255, 252, 249, 1)" }}>
                    <Box>
                        <Link to={'/'}>
                            <img src='/images/backArrow.svg' style={{ cursor: "pointer" }} />
                        </Link>                    </Box>
                    <Typography className='mt-3'
                        variant="h4"
                        fontWeight='100'
                        sx={{ fontSize: commonFontSize }}
                    >Welcome</Typography>
                    <Typography
                        variant="h4"
                        fontWeight='100'
                        gutterBottom
                        sx={{ fontSize: commonFontSize, lineHeight: "2.2rem" }}
                    >Back!</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Invalid email address'
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className='mt-3'
                                    fullWidth
                                    placeholder='Email'
                                    variant='outlined'
                                    error={!!errors.email}
                                    helperText={errors.email ? errors.email.message : ''}
                                    sx={{
                                        maxWidth: maxWidthField,
                                        '& .MuiInputBase-input::placeholder': {
                                            fontSize: '0.957rem',
                                            fontWeight: '600',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: '1.5px solid',
                                                borderColor: errors.email ? 'red' : 'rgba(51, 46, 60, 1)', // default border color
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: errors.email ? 'red' : 'rgba(51, 46, 60, 1)', // border color when focused
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <img src='/images/personIcon.svg' height={'25px'} />
                                            </InputAdornment>
                                        ),
                                        style: {
                                            borderRadius: '12px',
                                        }
                                    }}
                                />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{ required: 'Password is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    className='mt-3'
                                    placeholder='Password'
                                    variant='outlined'
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    error={!!errors.password}
                                    helperText={errors.password ? errors.password.message : ''}
                                    sx={{
                                        maxWidth: maxWidthField,
                                        '& .MuiInputBase-input::placeholder': {
                                            fontSize: '0.957rem',
                                            fontWeight: '600',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                border: '1.5px solid',
                                                borderColor: errors.password ? 'red' : 'rgba(51, 46, 60, 1)', // default border color
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: errors.password ? 'red' : 'rgba(51, 46, 60, 1)', // border color when focused
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <img src='/images/lockImage.svg' height={'23px'} style={{ marginRight: '5px' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleClickShowPassword}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                        style: {
                                            borderRadius: '12px',
                                        }
                                    }}
                                />
                            )}
                        />

                        <Link to={'/forgetpassword'} style={{ textDecoration: "none" }}>
                            <Typography className='mt-4' sx={{
                                maxWidth: maxWidthField,
                                lineHeight: '16.39px',
                                fontSize: '15px',
                                fontWeight: 400,
                                textAlign: "end",
                                color: '#FF5A59'
                            }}>Forgot Password?</Typography>
                        </Link>
                        <Grid className='mt-4 ml-1' sx={{ alignItems: 'center', display: 'flex', justifyContent: "space-between" }}>
                            <Grid>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    fontWeight='600'
                                    sx={{ color: "rgba(51, 46, 60, 1)" }}
                                >Sign In</Typography>
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
                                    {loading ? <><FontAwesomeIcon icon={faSpinner} size="xl" spin color='#fff' /></> : <ArrowForwardIcon sx={{ color: "white" }} />}
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                    <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} className='mt-1'>
                        <Typography
                            gutterBottom
                            fontWeight='400'
                            variant='body2'
                            sx={{ color: "#988EA9" }}
                        >sign in with</Typography>
                        <Grid
                            className='mb-2'
                            sx={{ marginTop: "-35px" }}
                            container
                            spacing={6}
                            alignItems="center"
                            justifyContent="center" // Center horizontally
                        >
                            <Grid item>
                                <Link to="https://auth-mmi-2d2a7783994f.herokuapp.com/auth/google" >
                                    <img src='/images/google.svg' style={{ cursor: "pointer" }} />
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="https://auth-mmi-2d2a7783994f.herokuapp.com/auth/apple">
                                    <img src='/images/applelogo.svg' style={{ cursor: "pointer" }} />
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link to="https://auth-mmi-2d2a7783994f.herokuapp.com/auth/facebook">
                                    <img src='/images/facebook.svg' style={{ cursor: "pointer" }} />
                                </Link>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setOpenSnackbar(false)}
            />
        </motion.div>
    );
}

export default Login;
