// src/components/ChangePassword.js

import { Box, Grid, TextField, IconButton, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useForm, Controller } from 'react-hook-form';
import { ForgetPassword } from '../../services/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import CustomSnackbar from '../../CustomSnackbar';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();
    const { handleSubmit, control, watch, reset, trigger, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const password = watch('password', '');
    const confirmPassword = watch('confirmPassword', '');
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    useEffect(() => {
        if (password) {
            trigger('password');
        }
    }, [password, trigger]);

    useEffect(() => {
        if (confirmPassword) {
            trigger('confirmPassword');
        }
    }, [confirmPassword, trigger]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const new_password = {
                "new_password": data.confirmPassword
            };
            await ForgetPassword(new_password, localStorage.getItem('token'));
            setOpenSnackbar(true);
            setSnackbarSeverity('success');
            setSnackbarMessage('Password Changed Successfully');
        } catch (error) {
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('Failed to change password');
        } finally {
            reset();
            setLoading(false);
        }
    };


    return (
        <Grid container className='mt-3' justifyContent="center">
            <Box sx={{ width: "100%", maxWidth: "490px" }} className='container'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Password must be at least 8 characters long' },
                            pattern: {
                                value: /(?=.*[A-Z])/,
                                message: 'Password must contain at least one uppercase letter',
                            },
                            validate: value => (
                                /[a-z]/.test(value) ? true : 'Password must contain at least one lowercase letter'
                            ) && (
                                    /[0-9]/.test(value) ? true : 'Password must contain at least one number'
                                ) && (
                                    /[!@#$%^&*]/.test(value) ? true : 'Password must contain at least one special character'
                                )
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className='mt-3'
                                placeholder='New Password'
                                variant='outlined'
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ''}
                                sx={{
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
                    <Controller
                        name="confirmPassword"
                        control={control}
                        defaultValue=""
                        rules={{
                            required: 'Confirm Password is required',
                            validate: value => value === password || 'Passwords do not match'
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                className='mt-4'
                                placeholder='Confirm Password'
                                variant='outlined'
                                fullWidth
                                type={showConfirmPassword ? 'text' : 'password'}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword ? errors.confirmPassword.message : ''}
                                sx={{
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
                            />
                        )}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                        <Button
                            type="submit"
                            sx={{
                                backgroundColor: "#FF5A59",
                                height: "50px",
                                width: "50%",
                                color: "#fff",
                                fontSize: "15px",
                                borderRadius: "10px",
                                textTransform: "capitalize",
                                textAlign: "center",
                                '&:hover': {
                                    backgroundColor: "#E04948",
                                }
                            }}
                        >
                            {loading ? <><FontAwesomeIcon icon={faSpinner} size="xl" spin /></> : <>Change Password</>}
                        </Button>
                    </Box>
                </form>
            </Box>
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setOpenSnackbar(false)}
            />
        </Grid>
    );
};

export default ChangePassword;
