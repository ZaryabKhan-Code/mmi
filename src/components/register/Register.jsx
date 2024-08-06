import React, { useState, useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Box, Grid, TextField, Typography, IconButton, Card } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import CustomSnackbar from '../../CustomSnackbar';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterUserPost } from '../../services/auth';

const Register = () => {
    const { control, reset, handleSubmit, formState: { errors }, trigger } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const [loading, setLoading] = useState(false)

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const password = useWatch({ control, name: 'password' });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('email', data.email)
            formData.append('password', data.password)
            await RegisterUserPost(formData)
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage("Account created! 🎉");
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage(error.response.data.message)
        } finally {
            reset();
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
            className='container mb-5'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeIn", duration: 0.6 }}
        >
            <Card className='mt-4' sx={{ display: "flex", padding: "0px 20px 0px 30px", flexDirection: "column", border: 'none', boxShadow: 'none', width: '100%', maxWidth: '400px', backgroundColor: "rgba(255, 252, 249, 1)" }}>
                <Box>
                    <Link to={'/login'}>
                        <img src='/images/backArrow.svg' style={{ cursor: "pointer" }} />
                    </Link>
                </Box>
                <Typography className='mt-3'
                    variant="h4"
                    fontWeight='100'
                    sx={{ fontSize: commonFontSize }}
                >Create an</Typography>
                <Typography
                    variant="h4"
                    fontWeight='100'
                    gutterBottom
                    sx={{ fontSize: commonFontSize, lineHeight: "2.2rem" }}
                >Account</Typography>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                message: "Enter a valid email address"
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className='mt-3'
                                placeholder='Email'
                                fullWidth
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
                                            borderColor: 'rgba(51, 46, 60, 1)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'rgba(51, 46, 60, 1)',
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
                                onKeyUp={() => trigger('email')}
                            />
                        )}
                    />

                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters long"
                            },
                            pattern: {
                                value: /^(?=.*[!@#$%^&*])/,
                                message: "Password must contain at least one special character"
                            }
                        }}
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
                                            borderColor: 'rgba(51, 46, 60, 1)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'rgba(51, 46, 60, 1)',
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
                                onKeyUp={() => trigger('password')}
                            />
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === password || "Passwords do not match"
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                className='mt-3'
                                placeholder='Confirm Password'
                                variant='outlined'
                                type={showConfirmPassword ? 'text' : 'password'}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
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
                                            <img src='/images/lockImage.svg' height={'23px'} style={{ marginRight: '5px' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowConfirmPassword}>
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    style: {
                                        borderRadius: '12px',
                                    }
                                }}
                                onKeyUp={() => trigger('confirmPassword')}
                            />
                        )}
                    />

                    <Typography className='mt-4 ml-1' sx={{
                        maxWidth: maxWidthField,
                        lineHeight: '16.39px',
                        fontSize: '15px',
                        fontWeight: 400,
                        color: '#988EA9'
                    }}>By clicking the <span style={{ color: '#FF5A59' }}>Register</span> button, you agree to the terms and conditions. </Typography>

                    <Grid className='mt-3 ml-1' sx={{ alignItems: 'center', display: 'flex', justifyContent: "space-between" }}>
                        <Grid>
                            <Typography
                                variant="h5"
                                gutterBottom
                                fontWeight='600'
                                sx={{ color: "rgba(51, 46, 60, 1)" }}
                            >Register</Typography>
                        </Grid>
                        <Grid item>
                            <Box
                                component={'button'}
                                disabled={loading}
                                sx={{
                                    border: 'none',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 45,
                                    cursor: "pointer",
                                    height: 45,
                                    borderRadius: '50%',
                                    backgroundColor: '#FF5A59',
                                    boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.2)',
                                }}
                                className='mb-3'
                                onClick={handleSubmit(onSubmit)}
                            >
                                {loading ? <><FontAwesomeIcon icon={faSpinner} size="xl" spin color='#fff' /></> : <ArrowForwardIcon sx={{ color: "white" }} />}
                            </Box>
                        </Grid>
                    </Grid>
                </form>

                <Grid sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }} className='mt-1 mb-2'>
                    <Typography
                        gutterBottom
                        fontWeight='400'
                        variant='body2'
                        sx={{ color: "#988EA9" }}
                    >sign up with</Typography>
                    <Grid
                        sx={{ marginTop: "-35px" }}
                        container
                        spacing={6}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Grid item>
                            <Link to="https://auth-mmi-2d2a7783994f.herokuapp.com/auth/google">
                                <img src='/images/google.svg' style={{ cursor: "pointer" }} />
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="https://auth-mmi-2d2a7783994f.herokuapp.com/auth/apple">
                                <img src='/images/applelogo.svg' style={{ cursor: "pointer" }} />
                            </Link>
                        </Grid>
                        <Grid item>
                            <img src='/images/facebook.svg' style={{ cursor: "pointer" }} />
                        </Grid>
                    </Grid>

                </Grid>
            </Card>
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setOpenSnackbar(false)}
            />
        </motion.div>
    );
}

export default Register;
