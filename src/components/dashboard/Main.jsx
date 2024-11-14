import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, CardMedia, Grid, Typography, IconButton, Tooltip, Menu, MenuItem, Divider, Skeleton, ClickAwayListener } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CheckIcon from '@mui/icons-material/Check';
import { motion } from 'framer-motion';
import { ExpertProfile, ExpertLike } from '../../services/user';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import CustomSnackbar from '../../CustomSnackbar';
import { debounce } from 'lodash';

const debouncedFetchExperts = debounce((fetchExperts, filter) => {
    fetchExperts(filter);
}, 300);

const Main = () => {
    const [experts, setExperts] = useState([]);
    const [favoriteStatus, setFavoriteStatus] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const userId = userData ? userData.id : null;

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const abortControllerRef = useRef(null);
    const favoriteControllerRef = useRef(null);

    const fetchExperts = useCallback(async (filter) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            setLoading(true);
            const response = await ExpertProfile(localStorage.getItem('token'), filter, { signal: abortControllerRef.current.signal });
            setExperts(response.data);
            console.log(response.data)
            setFavoriteStatus(response.data.map(expert => expert.liked));
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error fetching experts:', error);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const filter = selectedFilters.length === 0 ? '' : selectedFilters.join(',');
        debouncedFetchExperts(fetchExperts, filter);
    }, [fetchExperts, selectedFilters]);

    const handleFavoriteClick = async (index, expertId) => {
        if (favoriteControllerRef.current) {
            favoriteControllerRef.current.abort();
        }
        favoriteControllerRef.current = new AbortController();

        try {
            setFavoriteStatus(prevStatus => {
                const newStatus = [...prevStatus];
                newStatus[index] = !newStatus[index];
                return newStatus;
            });

            const data = { userId, expertId };
            const response = await ExpertLike(localStorage.getItem('token'), data, { signal: favoriteControllerRef.current.signal });
            if (response.status === 200) {
                setOpenSnackbar(true);
                setSnackbarSeverity('success');
                setSnackbarMessage('⭐ Favorite updated!');
            } else {
                setOpenSnackbar(true);
                setSnackbarSeverity('error');
                setSnackbarMessage('❌ Update failed!');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error updating favorite:', error);
                setOpenSnackbar(true);
                setSnackbarSeverity('error');
                setSnackbarMessage('⚠️ Error occurred!');
            }
        }
    };

    const handleFilterClick = (event) => {
        if (anchorEl) {

        } else {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMenuItemClick = (filter) => {
        setSelectedFilters(prevFilters => {
            if (filter === 'All Experts') {
                if (prevFilters.includes('All Experts')) {
                    return [];
                } else {
                    return ['All Experts', 'Musicians', 'Producers', 'Engineers', 'Labels', 'MGMT', 'PR'];
                }
            } else {
                if (prevFilters.includes(filter)) {
                    return prevFilters.filter(item => item !== filter);
                } else {
                    return prevFilters.filter(item => item !== 'All Experts').concat(filter);
                }
            }
        });
    };

    const handleClickAway = () => {

    };

    const isAllExpertsSelected = () => selectedFilters.includes('All Experts');

    const handleCardClick = (id) => {
        navigate(`/expert/${id}`);
    };

    const commonFontSize = {
        xs: '1rem',
        sm: '1.6rem',
        md: '1.6rem',
        lg: '2rem',
        xl: '2rem'
    };

    const smallFontSize = {
        xs: '14px',
        sm: '14px',
        md: '16px',
        lg: '17px',
        xl: '17px'
    };

    return (
        <Grid container className='container mt-4' sx={{ padding: '0px 30px 0px 40px' }}>
            <Card sx={{ boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', backgroundColor: 'rgba(255, 252, 249, 1)' }}>
                <Typography sx={{ fontSize: commonFontSize }} fontWeight={600}>Featured Experts</Typography>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <Box
                        sx={{
                            border: '2px solid #ccc',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            padding: {
                                xs: '4px 10px',
                                md: '6px 12px'
                            },
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#f4f4f4'
                            }
                        }}
                        onClick={handleFilterClick}
                    >
                        <Typography sx={{
                            fontWeight: 600, color: 'rgba(51, 46, 60, 1)', fontSize: {
                                xs: '15px',
                                md: '17px'
                            }
                        }}>Filter</Typography>
                        {anchorEl ? <ArrowDropUpIcon sx={{ marginLeft: '10px' }} /> : <ArrowDropDownIcon sx={{ marginLeft: '10px' }} />}
                    </Box>
                </ClickAwayListener>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    sx={{ marginTop: '10px' }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    MenuListProps={{
                        style: { padding: 0 }
                    }}
                >
                    <MenuItem onClick={() => handleMenuItemClick('All Experts')} sx={{
                        color: 'rgba(51, 46, 60, 1)', fontSize: '15px', fontWeight: 600, backgroundColor: isAllExpertsSelected() ? '#f4f4f4' : 'transparent',
                    }}>
                        {isAllExpertsSelected() ? <CheckIcon sx={{ marginRight: '15px' }} /> : null}
                        All Experts
                    </MenuItem>
                    {['Musicians', 'Producers', 'Engineers', 'Labels', 'MGMT', 'PR'].map((filter) => (
                        <React.Fragment key={filter}>
                            <MenuItem onClick={() => handleMenuItemClick(filter)} sx={{
                                color: "rgba(51, 46, 60, 1)", fontSize: "15px", fontWeight: 600, backgroundColor: selectedFilters.includes(filter) ? '#f4f4f4' : 'transparent',
                            }}>
                                {selectedFilters.includes(filter) ? <CheckIcon sx={{ marginRight: "15px" }} /> : null}
                                {filter}
                            </MenuItem>
                            <Divider className="m-0 p-0" />
                        </React.Fragment>
                    ))}
                </Menu>
            </Card>
            <Grid container spacing={3} sx={{ mt: 0 }}>
                {loading ? (
                    Array.from(new Array(4)).map((_, index) => (
                        <Grid item xs={12} sm={12} md={6} key={index}>
                            <Card sx={{ boxShadow: 'none', backgroundColor: 'rgba(255, 252, 249, 1)' }}>
                                <Skeleton variant='rectangular' sx={{ borderRadius: '10px', height: { xs: '250px', sm: '250px', md: '300px', lg: '350px', xl: '400px' } }} />
                                <Box sx={{ padding: '10px' }}>
                                    <Skeleton variant='text' width='60%' />
                                    <Skeleton variant='text' width='40%' />
                                    <Skeleton variant='text' width='80%' />
                                </Box>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    experts?.length > 0 ? (
                        experts.map((expert, index) => (
                            <Grid item xs={12} sm={12} md={6} key={expert.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    <Card
                                        sx={{
                                            boxShadow: 'none',
                                            position: 'relative',
                                            backgroundColor: 'rgba(255, 252, 249, 1)',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => handleCardClick(expert.id)}
                                    >
                                        {expert?.profilePicture ? (
                                            <CardMedia
                                                component='img'
                                                loading='lazy'
                                                sx={{
                                                    objectFit: 'cover',
                                                    borderRadius: '10px',
                                                    maxHeight: { xs: '250px', sm: '250px', md: '300px', lg: '350px', xl: '400px' },
                                                    height: { xs: '250px', sm: '250px', md: '300px', lg: '350px', xl: '400px' }
                                                }}
                                                image={expert.profilePicture}
                                                alt={expert.name}
                                            />
                                        ) : (
                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderRadius: '10px',
                                                maxHeight: { xs: '250px', sm: '250px', md: '300px', lg: '350px', xl: '400px' },
                                                height: { xs: '250px', sm: '250px', md: '300px', lg: '350px', xl: '400px' },
                                                backgroundColor: '#f0f0f0'
                                            }}>
                                                <Typography>No Image</Typography>
                                            </Box>
                                        )}
                                        <Tooltip title='Favorite' placement='top' sx={{ fontWeight: '500' }}>
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
                                                {favoriteStatus[index] ? <img src='/images/selectfav.svg' height={20} alt='Selected Favorite' /> : <img src='/images/favheart.svg' height={20} alt='Unselected Favorite' />}
                                            </IconButton>
                                        </Tooltip>
                                        <Box sx={{ marginBottom: '30px', marginLeft: '0px', marginTop: '5px' }}>
                                            <Typography variant='h5' fontSize={commonFontSize} component='div' fontWeight={700} sx={{ color: 'rgba(51, 46, 60, 1)', fontFamily: 'Poppins' }}>{expert.name}</Typography>
                                            <Typography variant='body1' fontWeight={400} fontSize={smallFontSize} sx={{ color: 'rgba(76, 69, 89, 1)', fontFamily: 'Poppins' }}>{expert.title}</Typography>
                                            <Typography variant='body1' fontWeight={400} fontSize={smallFontSize} sx={{ color: 'rgba(76, 69, 89, 1)', fontFamily: 'Poppins' }}>{expert.tags.split(',').join(', ')}</Typography>
                                        </Box>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} sx={{ height: '50vh' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                                <Box component={'img'} src='/images/usernotfound.png' width={50} />
                                <Typography variant='h5' fontSize={commonFontSize} fontWeight={500} sx={{ color: 'rgba(51, 46, 60, 1)', fontFamily: 'Poppins' }}>No expert results found</Typography>
                            </Box>
                        </Grid>
                    )
                )}
            </Grid>
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setOpenSnackbar(false)}
            />
        </Grid>
    );
};

export default Main;