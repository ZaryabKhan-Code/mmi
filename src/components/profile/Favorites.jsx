import { Grid, Card, CardMedia, Tooltip, IconButton, Typography, Box, Skeleton, Snackbar, Alert } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { ExpertFavProfile, ExpertLike } from '../../services/user';
import CustomSnackbar from '../../CustomSnackbar';
import { useCookies } from 'react-cookie';
const Favorites = () => {
    const [experts, setExperts] = useState([]);
    const [favoriteStatus, setFavoriteStatus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [cookies, setCookie] = useCookies(['user']);
    const userData = cookies.user;

    const userId = userData ? userData?.id : null;

    const fetchExpertsfav = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ExpertFavProfile(localStorage.getItem("token"));
            setExperts(response.data);
            setFavoriteStatus(response.data.map(expert => expert.liked));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExpertsfav();
    }, [fetchExpertsfav]);

    const handleFavoriteClick = async (index, expertId) => {
        const currentStatus = favoriteStatus[index];
        const newStatus = !currentStatus;

        try {
            setFavoriteStatus(prevStatus => {
                const updatedStatus = [...prevStatus];
                updatedStatus[index] = newStatus;
                return updatedStatus;
            });

            const data = { userId: userId, expertId };
            const response = await ExpertLike(localStorage.getItem("token"), data);
            console.log(response.data)
            if (response.status === 200) {
                setOpenSnackbar(true);
                setSnackbarSeverity('success');
                if (!newStatus) {
                    setSnackbarMessage('❌ Removed from favorites!');
                    // Remove the expert from the list if removed from favorites
                    setExperts(prevExperts => prevExperts.filter((_, i) => i !== index));
                }
            } else {
                // Rollback the status update if the API call fails
                setFavoriteStatus(prevStatus => {
                    const updatedStatus = [...prevStatus];
                    updatedStatus[index] = currentStatus;
                    return updatedStatus;
                });
                setOpenSnackbar(true);
                setSnackbarSeverity('error');
                setSnackbarMessage('❌ Update failed!');
            }
        } catch (error) {
            console.error('Failed to update favorite status:', error);
            // Rollback the status update if the API call fails
            setFavoriteStatus(prevStatus => {
                const updatedStatus = [...prevStatus];
                updatedStatus[index] = currentStatus;
                return updatedStatus;
            });
            setOpenSnackbar(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('⚠️ Error occurred!');
        }
    };

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
                (<Grid className='mt-3'>
                    {experts.length > 0 ? (
                        experts.map((expert, index) => (
                            <Grid item key={index} className='mb-4'>
                                <Box sx={{}} className='' justifyContent={'center'} alignItems={'center'}>
                                    <Card sx={{ boxShadow: "none", position: 'relative', backgroundColor: "rgba(255, 252, 249, 1)", maxWidth: 460 }}>
                                        {expert.pictureLinks.length > 0 ? (
                                            <CardMedia
                                                component="img"
                                                loading='lazy'
                                                sx={{
                                                    objectFit: "cover",
                                                    borderRadius: '10px',
                                                    maxHeight: { xs: "250px", sm: "250px", md: "300px", },
                                                    height: { xs: "250px", sm: "250px", md: "300px", }
                                                }}
                                                image={expert.pictureLinks[0]}
                                                alt={expert.name}
                                            />
                                        ) : (
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: '10px',
                                                maxHeight: { xs: "250px", sm: "250px", md: "300px", lg: "350px", xl: "400px" },
                                                height: { xs: "250px", sm: "250px", md: "300px", lg: "350px", xl: "400px" },
                                                backgroundColor: '#f0f0f0'
                                            }}>
                                                <Typography>No Image</Typography>
                                            </Box>
                                        )}
                                        <Tooltip title="Favorite" placement="top" sx={{ fontWeight: "500" }}>
                                            <IconButton
                                                sx={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    color: 'rgba(255, 255, 255, 0.7)',
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFavoriteClick(index, expert.id);
                                                }}
                                            >
                                                {favoriteStatus[index] ? <img src="/images/selectfav.svg" height={20} alt="Selected Favorite" /> : <img src="/images/favheart.svg" height={20} alt="Unselected Favorite" />}
                                            </IconButton>
                                        </Tooltip>
                                    </Card>
                                    <Box className='mt-2'>
                                        <Typography variant="h5" fontSize={commonFontSize} textAlign={'start'} component="div" fontWeight={700} sx={{ color: "rgba(51, 46, 60, 1)", fontFamily: 'Poppins' }}>{expert.name}</Typography>
                                        <Typography variant="body1" fontSize={smallFontSize} textAlign={'start'} fontWeight={400} sx={{ color: "rgba(76, 69, 89, 1)", fontFamily: 'Poppins' }}>{expert.title}</Typography>
                                        <Typography variant="body1" fontSize={smallFontSize} textAlign={'start'} fontWeight={400} sx={{ color: "rgba(76, 69, 89, 1)", fontFamily: 'Poppins' }}>{expert.tags.split(',').join(', ')}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                            <img src="/images/filledheart.png" height={40} />
                            <Typography
                                variant="h6"
                                sx={{
                                    color: 'rgba(255, 138, 138, 1)',
                                    fontFamily: 'manrope',
                                    mt: 1,
                                    fontSize: { xs: '0.8rem', sm: '1rem', md: '1.25rem' }, // Responsive font size
                                }}
                            >
                                No favorite experts found
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

export default Favorites;
