/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Button, Typography, Avatar, Menu, Box, MenuItem, Divider, Badge } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import HelpIcon from '@mui/icons-material/Help';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useCookies } from 'react-cookie';
import { GetTotalCartItem } from '../services/cart';
import { useDispatch, useSelector } from 'react-redux';
const Navbar = () => {
    const itemCount = useSelector((state) => state.cart.itemCount);

    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const PorfileImage = userData ? userData?.profilePicture : null;
    const Name = userData ? userData?.firstName : null;
    const [data, setData] = useState(0)
    const fieldsCompeleteStatus = userData ? userData?.fieldsCompeleteStatus : null;

    useEffect(() => {
        const fetchTotalItems = async () => {
            try {
                const response = await GetTotalCartItem(localStorage.getItem('token'), userData?.id);
                setData(response.data.items);
            } catch (error) {
                console.error('Error fetching total items:', error);
            }
        };

        if (userData) {
            fetchTotalItems();
        }
    }, [itemCount]);


    const location = useLocation();
    const navigate = useNavigate();
    const isProfilePage = /^\/profile\/[^\/]+$/.test(location.pathname);
    const isExpert = /^\/expert\/[^\/]+$/.test(location.pathname);
    const excludedRoutes = [

        '/signup', '/login', '/forgetpassword', '/cart',
        '/forgetpasswordconfirm', '/onboardingprofile', '/expert', '/favorites', '/credits', '/credits/quickhit', '/credits/songcritique', '/profile', '/notifications', '/sessions', '/help', '/inbox'
        , '/addcards', '/cancel'
    ];
    useEffect(() => {
        if (location.pathname === '/expert/') {
            navigate('/expert');
        }
    }, [location.pathname, navigate]);

    if (isExpert) {
        excludedRoutes.push(location.pathname);
    }
    const shouldDisplayButton = !excludedRoutes.includes(location.pathname);
    const paddingValue = location.pathname === '/profile' ? '0px 30px 0px 15px' : '0px 30px';

    const [anchorEl, setAnchorEl] = useState(null);
    const smallFont = {
        xs: '17px',
        sm: '18px',
        md: '22px',
        lg: '22px',
        xl: '22px'
    }
    const handleToggleMenu = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        navigate('/login');
    };
    const targetPath = location.pathname === '/profile' ? '/expert' : '/profile';

    const pageConfigs = [
        { path: '/profile', title: 'Profile' },
        { path: '/favorites', title: 'Favorites' },
        { path: '/credits', title: 'Credits' },
        { path: '/addcards', title: 'Payment' },
        { path: '/changepassword', title: 'Password Change' },
        { path: '/notifications', title: 'Notifications' },
    ];


    return (
        <>
            {(location.pathname === '/addcards' || location.pathname === '/notifications' || location.pathname === '/profile' || location.pathname === '/favorites' || location.pathname === '/credits' || location.pathname === '/changepassword') ? null :
                <>
                    {(!isProfilePage) && (
                        <>
                            <Grid className='container mt-4' sx={{ display: "flex", justifyContent: "space-between", padding: paddingValue }}>
                                <Link to={'/'}>
                                    <img src="/images/logo.svg" alt="Logo" />
                                </Link>
                                {shouldDisplayButton && (
                                    <div>
                                        <Button
                                            onClick={() => navigate('/login')}
                                            sx={{ textTransform: "capitalize", border: "1px solid #FF5A59", padding: "5px 20px", color: "#FF5A59", borderRadius: "8px" }}>
                                            Sign In
                                        </Button>
                                    </div>
                                )}
                                {location.pathname === '/onboardingprofile' && (
                                    <div>
                                        <img src='/images/bell.svg' alt="Bell" style={{ cursor: "pointer", height: "23px", marginTop: "10px" }} />
                                    </div>
                                )}
                                {(location.pathname === '/cancel' || location.pathname === '/inbox' || location.pathname === '/help' || location.pathname === '/cart' || location.pathname === '/sessions' || location.pathname === '/expert' || isExpert || location.pathname === '/credits/quickhit' || location.pathname === '/credits/songcritique') && (
                                    <>
                                        {fieldsCompeleteStatus && (
                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                <Link to={'/cart'}>
                                                    <Badge
                                                        className="mt-1"
                                                        badgeContent={itemCount || data}
                                                        sx={{
                                                            "& .MuiBadge-badge": {
                                                                color: "rgba(255, 255, 255, 1)",
                                                                backgroundColor: "rgba(255, 90, 89, 1)"
                                                            }
                                                        }}
                                                        overlap="circular"
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right'
                                                        }}
                                                    >
                                                        <img src='/images/Cart.svg' alt="Cart" style={{ cursor: "pointer", height: "35px" }} />
                                                    </Badge>
                                                </Link>
                                                <Grid
                                                    container
                                                    sx={{
                                                        border: '2px solid rgba(177, 190, 188, 1)',
                                                        borderRadius: "50px",
                                                        padding: "4px 15px 4px 10px",
                                                        marginLeft: '18px',
                                                        cursor: "pointer"
                                                    }}
                                                    onClick={handleToggleMenu}
                                                >
                                                    <Grid item>
                                                        {anchorEl ? (
                                                            <CloseIcon className='mt-2 mr-2' sx={{ cursor: "pointer" }} />
                                                        ) : (
                                                            <Box component={'img'} src='/images/Menu.png' className='mt-2 mr-1' sx={{ cursor: "pointer", height: 25, width: 25 }} />
                                                        )}
                                                    </Grid>
                                                    <Grid item>
                                                        <Avatar
                                                            src={PorfileImage}
                                                            alt={Name}
                                                            sx={{ width: 40, height: 40, marginLeft: "8px", marginRight: '-10px' }}
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Menu
                                                    anchorEl={anchorEl}
                                                    open={Boolean(anchorEl)}
                                                    sx={{ mt: 7, ml: -1 }}
                                                    onClose={() => setAnchorEl(null)}
                                                    anchorOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                    MenuListProps={{
                                                        style: { padding: 0 }
                                                    }}
                                                    transformOrigin={{
                                                        vertical: 'top',
                                                        horizontal: 'right',
                                                    }}
                                                >
                                                    <MenuItem
                                                        onClick={() => { setAnchorEl(null); navigate('/profile'); }}
                                                        sx={{
                                                            color: "rgba(51, 46, 60, 1)",
                                                            fontSize: "15px",
                                                            fontWeight: 600,
                                                            p: {
                                                                xs: '0px 10px 0px 10px',
                                                                sm: '6px 10px 6px 10px', // padding for small screens
                                                                md: '6px 12px 6px 12px'  // padding for medium and larger screens
                                                            }
                                                        }}
                                                    >
                                                        <PersonIcon sx={{ mr: 2 }} size='small' />
                                                        Profile
                                                    </MenuItem>
                                                    <Divider className='m-0 p-0' />
                                                    <MenuItem
                                                        onClick={() => { setAnchorEl(null); navigate('/sessions'); }}
                                                        sx={{
                                                            color: "rgba(51, 46, 60, 1)",
                                                            fontSize: "15px",
                                                            fontWeight: 600,
                                                            p: {
                                                                xs: '0px 10px 0px 10px', // padding for extra-small screens
                                                                sm: '6px 10px 6px 10px', // padding for small screens
                                                                md: '6px 12px 6px 12px'  // padding for medium and larger screens
                                                            }
                                                        }}
                                                    >
                                                        <EventNoteIcon sx={{ mr: 2 }} fontSize='small' />
                                                        Sessions
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => { setAnchorEl(null); navigate('/inbox'); }}
                                                        sx={{
                                                            color: "rgba(51, 46, 60, 1)",
                                                            fontSize: "15px",
                                                            fontWeight: 600,
                                                            p: {
                                                                xs: '0px 10px 0px 10px', // padding for extra-small screens
                                                                sm: '6px 10px 6px 10px', // padding for small screens
                                                                md: '6px 12px 6px 12px'  // padding for medium and larger screens
                                                            }
                                                        }}
                                                    >
                                                        <ChatIcon sx={{ mr: 2 }} fontSize='small' />
                                                        Inbox
                                                    </MenuItem>
                                                    <Divider className='m-0 p-0' />
                                                    <MenuItem
                                                        onClick={() => { setAnchorEl(null); navigate('/help'); }}
                                                        sx={{
                                                            color: "rgba(51, 46, 60, 1)",
                                                            fontSize: "15px",
                                                            fontWeight: 600,
                                                            p: {
                                                                xs: '0px 10px 0px 10px', // padding for extra-small screens
                                                                sm: '6px 10px 6px 10px', // padding for small screens
                                                                md: '6px 12px 6px 12px'  // padding for medium and larger screens
                                                            }
                                                        }}
                                                    >
                                                        <HelpIcon sx={{ mr: 2 }} fontSize='small' />
                                                        Help
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => { setAnchorEl(null); navigate('/logout'); }}
                                                        sx={{
                                                            color: "rgba(51, 46, 60, 1)",
                                                            fontSize: "15px",
                                                            fontWeight: 600,
                                                            p: {
                                                                xs: '0px 10px 0px 10px', // padding for extra-small screens
                                                                sm: '6px 10px 6px 10px', // padding for small screens
                                                                md: '6px 12px 6px 12px'  // padding for medium and larger screens
                                                            }
                                                        }}
                                                    >
                                                        <ExitToAppIcon sx={{ mr: 2 }} fontSize='small' />
                                                        Logout
                                                    </MenuItem>
                                                </Menu>
                                            </div>
                                        )}
                                    </>

                                )}
                            </Grid>

                        </>
                    )}
                </>
            }
            {
                pageConfigs.map(config => (
                    location.pathname === config.path && (
                        <Grid key={config.path} className='container' sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0px auto", marginTop: "40px", padding: "0px 15px 0px 10px" }}>
                            <Grid item>
                                <Link to={targetPath}>
                                    <img src='/images/backArrow.svg' alt="Back" style={{ cursor: "pointer" }} />
                                </Link>
                            </Grid>
                            <Grid item>
                                <Typography sx={{ color: "rgba(51, 46, 60, 1)" }} fontSize={smallFont} fontWeight={'500'} className='mt-1'>{config.title}</Typography>
                            </Grid>
                            <Grid item>
                                <Link to={'/notifications'}>
                                    <img src='/images/bell.svg' alt="Bell" style={{ cursor: "pointer", height: "23px" }} />
                                </Link>
                            </Grid>
                        </Grid>
                    ))
                )
            }

        </>
    );
};

export default Navbar;
