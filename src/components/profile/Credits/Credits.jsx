/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Card, CardMedia, Tooltip, IconButton, Typography, Box, Skeleton, Snackbar, Alert } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { GetAllSesssion } from '../../../services/sessions';
import CustomSnackbar from '../../../CustomSnackbar';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';

const Credits = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [cookies, setCookie] = useCookies(['user']);
    const userData = cookies.user;

    const userId = userData ? userData?.id : null;

    const fetchAllSession = useCallback(async () => {
        setLoading(true);
        try {
            const response = await GetAllSesssion(localStorage.getItem("token"), userId);
            setExperts(response.data.Credits);
            console.log('Credits', response.data.Credits)

        } catch (error) {
            console.log('Credits', error)
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllSession();
    }, [fetchAllSession]);


    const commonFontSize = {
        xs: '1rem',
        sm: '1rem',
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

    const getLinkPath = (expert) => {
        return expert.orderType === "Quick Hit"
            ? `/credits/quickhit?orderId=${expert.orderNo}&expertId=${expert.expertUserId}&expertName=${expert.expertUser.name}&creditId=${expert.id}`
            : `/credits/songcritique?orderId=${expert.orderNo}&expertId=${expert.expertUserId}&expertName=${expert.expertUser.name}&creditId=${expert.id}`;
    };
    return (
        <Card sx={{ maxWidth: "500px", width: "100%", padding: 2, textAlign: 'center', boxShadow: "none", backgroundColor: "rgba(255, 252, 249, 1)" }}>
            {loading ? (
                Array.from(new Array(3)).map((_, index) => (
                    <Box key={index} className='mb-4' sx={{ width: '100%' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                px: { xs: 1, sm: 2 },
                            }}
                        >
                            <Card
                                sx={{
                                    boxShadow: "none",
                                    position: 'relative',
                                    backgroundColor: "rgba(255, 252, 249, 1)",
                                    maxWidth: '460px',
                                    width: '100%',
                                }}
                            >
                                <CardMedia>
                                    <Skeleton
                                        variant="rectangular"
                                        height={240}
                                        sx={{ borderRadius: '10px', width: '100%' }}
                                    />
                                </CardMedia>
                                <Box className='mt-2 ml-1' sx={{ width: '100%' }}>
                                    <Skeleton
                                        variant="text"
                                        width="60%"
                                        height={30}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton
                                        variant="text"
                                        width="40%"
                                        height={20}
                                        sx={{ mb: 1 }}
                                    />
                                    <Skeleton
                                        variant="text"
                                        width="50%"
                                        height={20}
                                    />
                                </Box>
                            </Card>
                        </Box>
                    </Box>

                ))
            ) :
                (<Grid container spacing={2} className='mt-3'>
                    {experts.length > 0 ? (
                        experts.map((expert, index) => (
                            <Grid item xs={12} key={index} className='mb-4'>
                                <Link to={getLinkPath(expert)} style={{ textDecoration: 'none' }}>
                                    <Card sx={{ boxShadow: "none", position: 'relative', backgroundColor: "rgba(255, 252, 249, 1)", maxWidth: 460 }}>
                                        {expert.expertUser ? (
                                            <CardMedia
                                                component="img"
                                                loading='lazy'
                                                sx={{
                                                    objectFit: "cover",
                                                    borderRadius: '10px',
                                                    maxHeight: { xs: "250px", sm: "250px", md: "300px" },
                                                    height: { xs: "250px", sm: "250px", md: "300px" }
                                                }}
                                                image={expert.expertUser.profilePicture}
                                                alt={expert.expertUser.name}
                                            />
                                        ) : (
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: '10px',
                                                maxHeight: { xs: "250px", sm: "250px", md: "300px" },
                                                height: { xs: "250px", sm: "250px", md: "300px" },
                                                backgroundColor: '#f0f0f0'
                                            }}>
                                                <Typography>No Image</Typography>
                                            </Box>
                                        )}
                                        <Box p={0}>
                                            <Typography textAlign={'start'} fontSize={commonFontSize} variant="h5" sx={{ fontWeight: 700, color: "rgba(51, 46, 60, 1)", fontFamily: 'Poppins' }}>{expert.expertUser.name}</Typography>
                                            <Typography textAlign={'start'} fontSize={smallFontSize} variant="body1" sx={{ fontWeight: 400, color: "rgba(76, 69, 89, 1)", fontFamily: 'Poppins' }}>{expert.orderType}</Typography>
                                            <Typography textAlign={'start'} fontSize={smallFontSize} variant="body2" sx={{ fontWeight: 400, color: "rgba(76, 69, 89, 1)", fontFamily: 'Poppins' }}>{expert.count} Credits </Typography>
                                        </Box>
                                    </Card>
                                </Link>
                            </Grid>

                        ))
                    ) : (
                        <Box className='container' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                            {/* <img src="/images/filledheart.png" height={40} /> */}
                            <Typography
                                variant="h6"
                                textAlign={'center'}
                                sx={{
                                    color: 'rgba(255, 138, 138, 1)',
                                    fontFamily: 'manrope',
                                    mt: 1,
                                    fontSize: { xs: '0.8rem', sm: '1rem', md: '1.25rem' }, // Responsive font size
                                }}
                            >
                                No Credits found
                            </Typography>
                        </Box>
                    )}
                    <CustomSnackbar
                        open={openSnackbar}
                        message={snackbarMessage}
                        severity={snackbarSeverity}
                        onClose={() => setOpenSnackbar(false)}
                    />
                </Grid>
                )}
        </Card>
    );
}

export default Credits;
