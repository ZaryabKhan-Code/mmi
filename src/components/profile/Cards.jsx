/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Box, Grid, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Divider, IconButton, Skeleton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa, faCcMastercard, faCcAmex, faCcDiscover, faCcJcb, faCcDinersClub } from '@fortawesome/free-brands-svg-icons';
import { AddCard, GetAllCard, DeleteCard } from '../../services/payment';
import CustomSnackbar from '../../CustomSnackbar';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const stripePromise = loadStripe('pk_test_51PXu0JCB2pIPL2vxy0ZVuzFmR5Xer2mKYUMaceY8tFqV00kiLIwmMubP7WJlrySIUB0h8khq3wgAYoeI21Sa3LNM00Sn4czY69');

const cardElementOptions = {
    style: {
        base: {
            color: '#000',
            fontSize: '16px',
            fontFamily: 'manrope, sans-serif',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
};

const getCardIcon = (brand) => {
    switch (brand) {
        case 'visa':
            return faCcVisa;
        case 'mastercard':
            return faCcMastercard;
        case 'amex':
            return faCcAmex;
        case 'discover':
            return faCcDiscover;
        case 'jcb':
            return faCcJcb;
        case 'diners':
            return faCcDinersClub;
        default:
            return null;
    }
};

const getCardColor = (brand) => {
    switch (brand) {
        case 'visa':
            return '#1a1f71';
        case 'mastercard':
            return '#eb001b';
        case 'amex':
            return '#007bc1';
        case 'discover':
            return '#ff6000';
        case 'jcb':
            return '#007bc1';
        case 'diners':
            return '#006ba6';
        default:
            return '#000';
    }
};

const CardForm = ({ handleClose, showSnackbar, setCards }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const customerId = userData ? userData?.customerId : null;
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
            showSnackbar('Failed to create payment method.', 'error');
        } else {
            try {
                const response = await AddCard(localStorage.getItem('token'), {
                    customerId,
                    paymentMethodId: paymentMethod.id
                });

                const data_added = {
                    "id": response.data.paymentMethod.card.id,
                    "brand": response.data.paymentMethod.card.brand,
                    "exp_month": response.data.paymentMethod.card.exp_month,
                    "exp_year": response.data.paymentMethod.card.exp_year,
                    "last4": response.data.paymentMethod.card.last4,
                }
                setCards(prevCards => [...prevCards, data_added]);
                showSnackbar('Card added successfully.', 'success');
                handleClose();
            } catch (err) {
                console.error(err);
                showSnackbar('Failed to add card.', 'error');
            }
        }
        setLoading(false)
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
            }}
        >
            <Typography variant="body2" sx={{ fontFamily: 'manrope', mb: 1 }}>
                Please enter your card details below to save your payment method securely.
            </Typography>
            <Box
                sx={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    p: 2,
                    mb: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    backgroundColor: '#f9f9f9',
                }}
            >
                <CardElement options={cardElementOptions} />
            </Box>
            <DialogActions>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{

                        backgroundColor: 'rgba(255, 90, 89, 1)',
                        fontFamily: 'manrope, sans-serif',
                        fontSize: '15px',
                        textTransform: 'none',

                        '&:hover': {
                            backgroundColor: '#333',
                        },
                    }}
                    disabled={!stripe}
                >
                    {loading ? <FontAwesomeIcon icon={faSpinner} spin size='xl' /> : 'Save Card'}
                </Button>
            </DialogActions>
        </Box>
    );
};

const Cards = () => {
    const [open, setOpen] = useState(false);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const customerId = userData ? userData?.customerId : null;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const handleDeleteCard = async (cardId) => {
        try {
            await DeleteCard(localStorage.getItem('token'), cardId);
            setCards(prevCards => prevCards.filter(card => card.id !== cardId));
            showSnackbar('Card deleted successfully.', 'success');
        } catch (error) {
            console.error('Error deleting card:', error);
            showSnackbar('Failed to delete card.', 'error');
        }
    };

    useEffect(() => {
        const fetchCards = async () => {
            setLoading(true);
            try {
                const response = await GetAllCard(localStorage.getItem('token'), customerId);
                console.log(response.data.paymentMethods.data);
                if (response.data && response.data.paymentMethods.data) {
                    const transformedCards = response.data.paymentMethods.data.map(card => ({
                        id: card.id,
                        brand: card.card.brand,
                        last4: card.card.last4,
                        exp_month: card.card.exp_month,
                        exp_year: card.card.exp_year
                    }));
                    setCards(transformedCards);
                } else {
                    setCards([]);
                }
            } catch (error) {
                console.error('Error fetching cards:', error);
                setCards([]);
            }
            setLoading(false);
        };
        fetchCards();
    }, [customerId]);

    return (
        <Grid container className='mt-3' justifyContent="center" flexDirection="column">
            <Box sx={{ width: "100%", maxWidth: "490px" }} className='container'>
                {loading ? (
                    [1, 2, 3].map((_, index) => (
                        <Box key={index} sx={{ mb: 1.5 }}>
                            <Skeleton variant="rectangular" width="100%" height={50} sx={{ borderRadius: '10px', }} />
                            <Skeleton width="30%" sx={{ mt: 1 }} />
                        </Box>
                    ))
                ) : (
                    cards && cards.map(card => (
                        <Box key={card.id}>
                            <Box sx={{ border: '1px solid rgba(152, 142, 169, 1)', borderRadius: '10px', p: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <FontAwesomeIcon icon={getCardIcon(card.brand)} size="lg" color={getCardColor(card.brand)} />
                                <Typography variant="body1" sx={{ fontFamily: 'manrope', color: 'rgba(0, 0, 0, 1)', fontWeight: '500', textTransform: 'capitalize' }}>
                                    {card.brand}  {card.last4}
                                </Typography>
                                <Typography variant="body1" sx={{ fontFamily: 'manrope', color: 'rgba(0, 0, 0, 1)', fontWeight: '500' }}>
                                    {card.exp_month}/{card.exp_year}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="flex-end" sx={{ mb: 1.5, mr: 1 }}>
                                <Typography
                                    sx={{ fontFamily: 'manrope', color: 'rgba(0, 0, 0, 1)', fontWeight: '300', fontSize: '14px', cursor: 'pointer' }}
                                    onClick={() => handleDeleteCard(card.id)}
                                >
                                    Delete
                                </Typography>
                                {/* <Typography sx={{ fontFamily: 'manrope', color: 'rgba(255, 90, 89, 1)', fontWeight: '300', fontSize: '14px', cursor: 'pointer' }}>Edit</Typography> */}
                            </Box>
                        </Box>
                    ))
                )}
            </Box>
            <Box sx={{ width: "100%", maxWidth: "490px" }} className='container' display="flex" justifyContent="flex-end">
                <Button
                    sx={{
                        textTransform: "none",
                        color: 'rgba(0, 0, 0, 1)',
                        fontFamily: 'manrope, sans-serif',
                        fontWeight: '300',
                        fontSize: '15px',
                        '&:hover': {
                            backgroundColor: 'transparent'
                        },
                        '&:active': {
                            backgroundColor: 'transparent'
                        }
                    }}
                    disableRipple
                    disableTouchRipple
                    endIcon={<img src="/images/roundedPlusIcon.svg" alt="Add new payment" width={'25'} />}
                    onClick={handleClickOpen}
                >
                    Add new payment
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontFamily: 'manrope, sans-serif', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h5' sx={{
                        fontSize: {
                            xs: '1rem',  // Mobile devices
                            sm: '1.5rem',   // Tablets
                            md: '1.75rem',  // Small laptops
                            lg: '2rem',     // Desktops
                        }
                    }}>
                        Add New Payment Method
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent>
                    <Elements stripe={stripePromise}>
                        <CardForm handleClose={handleClose} showSnackbar={showSnackbar} setCards={setCards} />
                    </Elements>
                </DialogContent>
            </Dialog>

            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setOpenSnackbar(false)}
            />
        </Grid>
    );
};

export default Cards;
