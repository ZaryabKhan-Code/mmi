import { Grid, Card, CardContent, CardMedia, Box, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExpertSingleProfile } from '../../services/user';
import { CreateCart, GetTotalCartItem } from '../../services/cart';
import { useCookies } from 'react-cookie';
import CustomSnackbar from '../../CustomSnackbar';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import { setItemCount } from '../../store/cartSlice';

const Expert = () => {
    const dispatch = useDispatch();
    const itemCount = useSelector((state) => state.cart.itemCount);

    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const userId = userData ? userData?.id : null;
    const { id } = useParams();
    const [expert, setExpert] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState([false, false]); // An array to manage loading state for each button

    const [cardData, setCardData] = useState([
        {
            title: "Quick Hit",
            price: "",
            features: [
                "Video messaging",
                "Ask questions on any topic",
                "Audio-only and text options available",
                "Guaranteed answer within a week"
            ]
        },
        {
            title: "Song Feedback",
            price: "",
            features: [
                "Get legitimate feedback on songs or lyrics",
                "Notes on production and instrumentation",
                "Guaranteed answer within a week",
            ]
        },
    ]);

    useEffect(() => {
        const fetchSpecific = async () => {
            try {
                const response = await ExpertSingleProfile(localStorage.getItem("token"), id);
                setExpert(response.data[0]);
                setCardData(prevCardData => [
                    {
                        ...prevCardData[0],
                        price: `$${response.data[0].price1}`
                    },
                    {
                        ...prevCardData[1],
                        price: `$${response.data[0].price2}`
                    }
                ]);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        fetchSpecific();
    }, [id]);

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

    const handleAddToCart = async (type, price, index) => {
        // Check if the type is "Song Feedback" and change it to "Song Critique"
        if (type === "Song Feedback") {
            type = "Song Critique";
        }

        const newLoadingButtonState = [...loadingButton];
        newLoadingButtonState[index] = true;
        setLoadingButton(newLoadingButtonState);

        const cartData = {
            "userId": userId,
            "expertUsers": [
                {
                    "expertUserId": parseInt(id),
                    "quantity": 1, // Adjust quantity as needed
                    "price": price
                }
            ],
            "type": type,
            "price": price,
            "status": "pending"
        };
        console.log(cartData);
        try {
            const response = await CreateCart(localStorage.getItem('token'), cartData);
            console.log(response);
            if (response.status === 201 || response.status === 200) {
                const response_2 = await GetTotalCartItem(localStorage.getItem('token'), userData?.id);
                console.log(response_2);
                setSnackbarMessage('✅ Item added to cart successfully!');
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                const newCount = response_2.data.items;
                dispatch(setItemCount(newCount));
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            setSnackbarMessage('❌ Error adding item to cart. Please try again.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }

        newLoadingButtonState[index] = false;
        setLoadingButton(newLoadingButtonState);
    };


    return (
        <>
            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: "0px 40px" }}>
                <Link to={'/expert'}>
                    <Grid item>
                        <img src='/images/backArrow.svg' alt="Back" style={{ cursor: "pointer" }} />
                    </Grid>
                </Link>
            </Grid>
            <Grid className='container mt-4' sx={{ padding: "0px 35px 0px 45px" }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        {loading ? (
                            <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: '10px' }} />
                        ) : (
                            expert.pictureLinks.length > 0 ? (
                                <Card sx={{ boxShadow: "none", position: 'relative', backgroundColor: "rgba(255, 252, 249, 1)" }}>
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            objectFit: "cover",
                                            borderRadius: '10px',
                                            maxHeight: { xs: "250px", sm: "250px", md: "300px", lg: "350px", xl: "400px" },
                                            height: { xs: "250px", sm: "250px", md: "300px", lg: "350px", xl: "400px" }
                                        }}
                                        image={expert.pictureLinks[0]}
                                        alt={expert.name}
                                    />
                                </Card>
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
                            )
                        )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box>
                            {loading ? (
                                <>
                                    <Skeleton width="80%" />
                                    <Skeleton width="60%" />
                                    <Skeleton width="90%" />
                                    <Skeleton width="50%" />
                                    <Skeleton width="70%" />
                                    <Skeleton width="60%" />
                                </>
                            ) : (
                                <>
                                    <Typography variant="h5" fontSize={commonFontSize} component="div" fontWeight={700} sx={{ color: "rgba(51, 46, 60, 1)", fontFamily: 'Poppins' }}>{expert.name}</Typography>
                                    <Typography variant="body1" fontSize={smallFontSize} fontWeight={400} sx={{ color: "rgba(76, 69, 89, 1)", fontFamily: 'Poppins' }}>{expert.title}</Typography>
                                    <Typography variant="body1" fontSize={smallFontSize} fontWeight={400} sx={{ color: "rgba(76, 69, 89, 1)", fontFamily: 'Poppins' }}>{expert.tags.split(',').join(', ')}</Typography>
                                    <Typography variant="body1" fontSize={smallFontSize} fontWeight={400} sx={{ color: "rgba(76, 69, 89, 1)", mt: 2, fontFamily: 'Poppins' }}>{expert.bio}</Typography>
                                    <Typography variant="h5" fontSize={commonFontSize} component="div" fontWeight={700} sx={{ color: "rgba(51, 46, 60, 1)", mt: 2, fontFamily: 'Poppins' }}>Connect with {expert.name}</Typography>
                                    <Typography variant="body1" fontSize={smallFontSize} fontWeight={400} sx={{ color: "rgba(76, 69, 89, 1)", fontFamily: 'Poppins' }}>{expert.name} has two ways to connect with him.</Typography>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={2}
                    className='mt-4 mb-5'
                    sx={{
                        justifyContent: {
                            xs: 'center',
                            sm: 'center',
                            md: 'center',
                            lg: 'flex-start'
                        }
                    }}
                >
                    {cardData.map((card, index) => (
                        <Grid item xs={12} md={6} lg={5} key={index}>
                            <Card sx={{ boxShadow: "none", backgroundColor: "#EEF7FF", borderRadius: '20px', maxWidth: 500 }}>
                                <CardContent className='mt-3'>
                                    {loading ? (
                                        <>
                                            <Skeleton width="60%" />
                                            <Skeleton width="40%" />
                                            <Skeleton width="80%" />
                                            <Skeleton width="90%" />
                                            <Skeleton width="70%" />
                                        </>
                                    ) : (
                                        <>
                                            <Typography
                                                variant="h4"
                                                fontWeight={500}
                                                textAlign="center"
                                                sx={{
                                                    fontFamily: 'Poppins',
                                                    textTransform: "uppercase",
                                                    fontSize: {
                                                        xs: '1.2rem', // extra small devices
                                                        sm: '1.5rem', // small devices
                                                        md: '1.8rem', // medium devices
                                                        lg: '2rem',   // large devices
                                                        xl: '2.2rem'  // extra large devices
                                                    }
                                                }}
                                            >
                                                {card.title}
                                            </Typography>
                                            <Typography
                                                variant="h4"
                                                fontWeight={700}
                                                textAlign="center"
                                                sx={{
                                                    fontFamily: 'Poppins',
                                                    marginTop: 1,
                                                    fontSize: {
                                                        xs: '1.5rem',
                                                        sm: '1.8rem', // small devices
                                                        md: '2rem',   // medium devices
                                                        lg: '2.5rem', // large devices
                                                        xl: '3rem'    // extra large devices
                                                    }
                                                }}
                                            >
                                                {card.price}
                                            </Typography>
                                            <List>
                                                {card.features.map((feature, idx) => (
                                                    <ListItem key={idx} sx={{ paddingLeft: 0, pt: 0, pb: 0 }}>
                                                        <ListItemIcon sx={{ minWidth: "35px", mb: 0 }}>
                                                            <img src="/images/roundCheck.svg" alt="Check" />
                                                        </ListItemIcon>
                                                        <ListItemText primary={feature} sx={{ fontFamily: 'Poppins' }} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                            <Box textAlign="center" mt={1}>
                                                <Button
                                                    disabled={loadingButton[index]}
                                                    sx={{
                                                        backgroundColor: "#FF5A59",
                                                        width: "100%",
                                                        padding: "14px 0px",
                                                        color: "#fff",
                                                        borderRadius: "10px",
                                                        fontSize: "15px",
                                                        textTransform: "inherit",
                                                        textAlign: "center",
                                                        '&:hover': {
                                                            backgroundColor: "#E04948",
                                                        },
                                                        "&.Mui-disabled": {
                                                            color: 'rgba(255, 252, 249, 1)',
                                                            backgroundColor: 'rgba(255, 138, 138, 1)'
                                                        }
                                                    }}
                                                    className='mt-1'
                                                    onClick={() => handleAddToCart(card.title, parseFloat(card.price.replace('$', '')), index)}
                                                >
                                                    {loadingButton[index] ? <FontAwesomeIcon icon={faSpinner} spin size='xl' /> : 'Add to cart'}
                                                </Button>
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setOpenSnackbar(false)}
            />
        </>
    );
};

export default Expert;
