import { Button, Card, Grid, Typography, Checkbox, Box, IconButton, Skeleton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { GetCart, UpdateCart, DeleteSignleItemCart } from '../../services/cart';
import CustomSnackbar from '../../CustomSnackbar';
import { useDispatch, useSelector } from 'react-redux';
import { setItemCount } from '../../store/cartSlice';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_live_51PPvgY07uj255Y7F5N1Ii8PXnUtaPxKtKQYU5bqjJBkSXCJGoflczWPnJ1pmaLGIbZ69hYdFm3IHxmEX3iySR9DL00ouVBToD4');
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const MainCart = () => {
    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const userId = userData ? userData?.id : null;

    const dispatch = useDispatch();
    const itemCount = useSelector((state) => state.cart.itemCount);


    const [selectedItems, setSelectedItems] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState();
    const [loadingpayment, setLoadingpayment] = useState(false)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    useEffect(() => {
        setLoading(true);
        const fetchItems = async () => {
            try {
                const response = await GetCart(localStorage.getItem('token'), userId);
                setItems(response.data.cartExpertUsers);
                setType(response.data.type);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [userId]);

    const commonFontSize = {
        xs: '1.8rem',
        sm: '2rem',
        md: '2.5rem',
        lg: '2.5rem',
        xl: '2.5rem'
    };

    const imageSize = {
        xs: '1.5rem',
        sm: '2rem',
        md: '3rem',
        lg: '3rem',
        xl: '3rem'
    };

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }


    const handleUpdateCart = debounce(async (item, quantity) => {
        const updatedItem = { ...item, quantity };
        const updatedItems = items.map(i => i.id === item.id ? updatedItem : i);
        setItems(updatedItems);
        const sendData = {
            "cartId": item.cartId,
            "userId": userId,
            "expertUsers": updatedItems.map(i => ({
                expertUserId: i.expertUserId,
                quantity: i.quantity,
                price: i.price
            })),
            type,
            "price": updatedItems.reduce((acc, i) => acc + i.price * i.quantity, 0),
            "status": "pending"
        };
        try {
            await UpdateCart(localStorage.getItem('token'), sendData);
            setSnackbarMessage('Cart updated successfully');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage('Failed to update cart');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    }, 100);

    const handleIncrement = (index) => {
        const item = items[index];
        handleUpdateCart(item, item.quantity + 1);
    };

    const handleDecrement = (index) => {
        const item = items[index];
        if (item.quantity > 1) {
            handleUpdateCart(item, item.quantity - 1);
        }
    };

    const handleDelete = async (index) => {
        const item = items[index];
        const data_to_send = {
            cartId: parseInt(item.cartId),
            cartExpertUserIds: [item.id]
        }
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        setSelectedItems(prevSelected => prevSelected.filter(i => i !== index));
        dispatch(setItemCount(newItems.length));
        try {
            await DeleteSignleItemCart(localStorage.getItem('token'), data_to_send);
            setSnackbarMessage('Item deleted successfully');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage('Failed to delete item');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === items.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(items.map((_, index) => index)); // Ensure you're using indices here
        }
    };


    const handleCheckboxChange = (index) => {
        if (selectedItems.includes(index)) {
            setSelectedItems(prevSelected => prevSelected.filter(i => i !== index));
        } else {
            setSelectedItems(prevSelected => [...prevSelected, index]);
        }
    };

    const handleDeleteSelected = async () => {
        if (items.length === 0) {
            setSnackbarMessage('No items to delete');
            setSnackbarSeverity('info');
            setOpenSnackbar(true);
            return;
        }
        setSelectedItems([]);
        const newItems = items.filter((_, i) => !selectedItems.includes(i));
        dispatch(setItemCount(newItems.length));
        const selectedIds = selectedItems.map(index => items[index].id);
        const cartId = items[0].cartId;

        try {
            await DeleteSignleItemCart(localStorage.getItem('token'), {
                cartId: cartId,
                cartExpertUserIds: selectedIds
            });
            setItems(newItems);

            setSnackbarMessage('Selected items deleted successfully');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            setSnackbarMessage('Failed to delete selected items');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };


    const handleCheckout = async () => {
        setLoadingpayment(true)
        const stripe = await stripePromise;
        const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
        const cartId = items[0].cartId;
        try {
            const { data } = await axios.post('https://mmi-mymusicindustry-f5f4aaf34e0e.herokuapp.com/user/create-checkout-session', {
                customerId: userData?.customerId,
                customerEmail: userData?.email,
                amount: totalAmount,
                userId: userId,
                type: type,
                cartId: cartId,
                items: items.map(item => ({
                    id: item.expertUserId,
                    name: item.name,
                    quantity: item.quantity,
                    amount: item.price * 100,
                    image: item.files[0] || "/images/demoContainer.jpeg"
                }))
            });
            const result = await stripe.redirectToCheckout({
                sessionId: data.id,
            });

            if (result.error) {
            }
        } catch (error) {
        }
        setLoadingpayment(false);
    };

    return (
        <>
            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: "0px 60px 0px 40px" }}>
                <Grid item sx={{ mt: 1 }}>
                    <Link to="/expert">
                        <img
                            src='/images/backArrow.svg'
                            alt="Back"
                            style={{
                                cursor: "pointer",
                                width: imageSize.xs,
                                height: imageSize.xs,
                            }}
                        />
                    </Link>
                </Grid>
                {items.length > 0 && (
                    <>
                        <Grid item>
                            <Typography fontSize={commonFontSize} fontFamily={'Manrope'} fontWeight={500}>Cart</Typography>
                        </Grid>
                        <Grid item>
                        </Grid>
                    </>
                )}
            </Grid>
            <>
                {loading ? (Array.from(new Array(3)).map((_, index) => (
                    <Grid key={index} className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: "0px 30px 0px 50px" }}>
                        <Card sx={{ width: "100%", boxShadow: 0, color: "none", backgroundColor: "rgba(255, 252, 249, 1)" }}>
                            <Grid sx={{ display: 'flex', justifyContent: "space-between", gap: 2 }}>
                                <Grid sx={{ display: 'flex', alignItems: 'start' }}>
                                    <Skeleton variant="rectangular" width={30} height={30} sx={{ borderRadius: "10px" }} />
                                    <Box sx={{ ml: 2 }}>
                                        <Skeleton variant="text" width={80} height={30} sx={{ borderRadius: "10px" }} />
                                        <Skeleton variant="text" width={100} height={30} sx={{ borderRadius: "10px" }} />
                                        <Skeleton variant="text" width={50} height={50} sx={{ borderRadius: "10px" }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                            <Skeleton variant="rectangular" width={80} height={30} sx={{ borderRadius: "10px" }} />
                                            <Skeleton variant="rectangular" width={30} height={30} sx={{ borderRadius: "10px" }} />
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid sx={{ mt: { xs: 1.5 } }}>
                                    <Skeleton variant="rectangular" width={200} height={130} sx={{ borderRadius: "10px" }} />
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                ))) : (
                    <>
                        {items.length > 0 ? (
                            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: "0px 40px 0px 50px" }}>
                                <>
                                    <Grid item sx={{ mt: 0 }}>
                                        <Typography
                                            variant="body1"
                                            component="div"
                                            fontWeight={400}
                                            sx={{
                                                color: "rgba(152, 142, 169, 1)",
                                                fontFamily: "Manrope",
                                                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } // Responsive font size
                                            }}
                                        >
                                            {items.length} item{items.length > 1 ? 's' : ''}
                                        </Typography>
                                    </Grid>
                                    <Grid sx={{ display: "flex", gap: 3 }}>
                                        <Typography
                                            variant="body1"
                                            component="div"
                                            fontWeight={400}
                                            sx={{
                                                color: "rgba(51, 46, 60, 1)",
                                                fontFamily: "Manrope",
                                                cursor: "pointer",
                                                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } // Responsive font size
                                            }}
                                            onClick={handleSelectAll}
                                        >
                                            <DoneIcon fontSize='small' sx={{ mb: 0.5 }} /> Select All
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            component="div"
                                            fontWeight={400}
                                            sx={{
                                                color: "rgba(51, 46, 60, 1)",
                                                fontFamily: "Manrope",
                                                cursor: "pointer",
                                                fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } // Responsive font size
                                            }}
                                            onClick={handleDeleteSelected}
                                        >
                                            <DeleteIcon fontSize='small' sx={{ mb: 0.5 }} /> Delete Selected
                                        </Typography>
                                    </Grid>
                                </>
                            </Grid>
                        ) : (
                            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "center", flexDirection: 'column', padding: "0px 40px 0px 40px", alignItems: "center" }}>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    fontWeight={600}
                                    gutterBottom
                                    sx={{
                                        color: "rgba(51, 46, 60, 1)",
                                        fontFamily: "Manrope",
                                        cursor: "pointer",
                                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2rem' } // Responsive font size
                                    }}
                                >
                                    Cart is empty
                                </Typography>
                                <Box component={'img'} src='/images/sadIcon.svg' width={90} className='mt-2' />
                            </Grid>
                        )}
                        <Grid className='container' sx={{ display: "flex", justifyContent: "space-between", padding: "0px 20px 0px 20px", flexDirection: 'column' }}>
                            {items.map((item, index) => (
                                <Card sx={{ width: "100%", padding: 2, boxShadow: 0, color: "none", backgroundColor: "rgba(255, 252, 249, 1)" }} key={index}>
                                    <Grid>
                                        <Grid sx={{ display: 'flex', justifyContent: "space-between" }}>
                                            <Grid sx={{ display: 'flex', alignItems: 'start' }}>
                                                <Checkbox
                                                    checked={selectedItems.includes(index)}
                                                    onChange={() => handleCheckboxChange(index)}
                                                    sx={{
                                                        '&.Mui-checked': {
                                                            color: '#FF5A59',
                                                        },
                                                        transform: "scale(0.9)"
                                                    }}
                                                />

                                                <Box sx={{ mt: 0.6 }}>
                                                    <Typography
                                                        variant="h6"
                                                        component="div"
                                                        fontWeight={600}
                                                        sx={{
                                                            color: "rgba(51, 46, 60, 1)",
                                                            fontFamily: "Manrope",
                                                            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }  // Responsive font size
                                                        }}
                                                    >
                                                        {item.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="div"
                                                        fontWeight={400}
                                                        sx={{
                                                            color: "rgba(152, 142, 169, 1)",
                                                            fontFamily: "Manrope",
                                                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }  // Responsive font size
                                                        }}
                                                    >
                                                        {type}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        component="div"
                                                        fontWeight={400}
                                                        sx={{
                                                            color: "rgba(51, 46, 60, 1)",
                                                            fontFamily: "Manrope",
                                                            fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                                                        }}
                                                    >
                                                        ${item.price * item.quantity}
                                                    </Typography>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                backgroundColor: "rgba(243, 243, 243, 1)",
                                                                borderRadius: 1
                                                            }}
                                                        >
                                                            <IconButton onClick={() => handleDecrement(index)}>
                                                                <RemoveIcon fontSize='small' sx={{ color: "rgba(187, 187, 187, 1)" }} />
                                                            </IconButton>
                                                            <Typography
                                                                variant="body1"
                                                                sx={{
                                                                    color: "rgba(187, 187, 187, 1)",
                                                                    mx: { xs: 1, md: 2, lg: 2 },
                                                                    fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }  // Responsive font size
                                                                }}
                                                                fontWeight={400}
                                                            >
                                                                {item.quantity}
                                                            </Typography>
                                                            <IconButton onClick={() => handleIncrement(index)}>
                                                                <AddIcon fontSize='small' sx={{ color: "rgba(187, 187, 187, 1)" }} />
                                                            </IconButton>
                                                        </Box>
                                                        <Box
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                backgroundColor: "rgba(243, 243, 243, 1)",
                                                                borderRadius: 1
                                                            }}
                                                        >
                                                            <IconButton onClick={() => handleDelete(index)}>
                                                                <DeleteIcon fontSize='small' sx={{ color: "rgba(187, 187, 187, 1)" }} />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Grid>
                                            <Grid sx={{ mt: { xs: 1.5 } }}>
                                                <Box
                                                    component={'img'}
                                                    src={item.files[0] || "/images/demoContainer.jpeg"}
                                                    sx={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        maxHeight: { xs: 75, sm: 130, md: 180 },
                                                        objectFit: "cover",
                                                        borderRadius: "10px"
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Card>
                            ))}

                            <Grid sx={{ display: "flex", justifyContent: "center", mb: 4, flexDirection: 'column', alignItems: 'center' }}>
                                {items.length > 0 && (
                                    <Button
                                        onClick={handleCheckout}
                                        disabled={loadingpayment}
                                        sx={{
                                            backgroundColor: "#FF5A59",
                                            padding: { xs: "10px 68px", sm: "12px 60px", md: "14px 80px", lg: "14px 100px" }, // Responsive padding
                                            color: "#fff",
                                            fontSize: { xs: "12px", sm: "14px", md: "15px" }, // Responsive font size
                                            borderRadius: "10px",
                                            textTransform: "capitalize",
                                            textAlign: "center",
                                            '&:hover': {
                                                backgroundColor: "#E04948",
                                            }
                                        }}
                                        className='mt-4'
                                    >
                                        {loadingpayment ? <><FontAwesomeIcon icon={faSpinner} size="xl" spin color='#fff' /></> : 'Checkout'}
                                    </Button>
                                )}
                                <Link to={"/expert"}>
                                    <Button
                                        sx={{
                                            padding: { xs: "10px 40px", sm: "12px 50px", md: "14px 55px", lg: "14px 65px" }, // Responsive padding
                                            fontSize: { xs: "12px", sm: "14px", md: "15px" }, // Responsive font size
                                            textAlign: "center",
                                            borderRadius: "10px",
                                            color: "rgba(152, 142, 169, 1)",
                                            border: '2px solid rgba(152, 142, 169, 1)',
                                            textTransform: "capitalize",
                                            '&:hover': {
                                                backgroundColor: "none",
                                            }
                                        }}
                                        className='mt-4'
                                    >
                                        Continue Browsing
                                    </Button>
                                </Link>
                            </Grid>
                        </Grid>
                    </>
                )}
            </>
            <CustomSnackbar
                open={openSnackbar}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setOpenSnackbar(false)}
            />
        </>
    );
}

export default MainCart;
