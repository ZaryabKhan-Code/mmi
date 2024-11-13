/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Tabs, Card, Tab, Box, Typography, Avatar, Skeleton } from '@mui/material';
import { GetSessionWithType } from '../../../services/sessions';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import { fetchNotification } from '../../../store/sessionNotificationSlice';
import { useDispatch, useSelector } from 'react-redux';

const SessionsTab = () => {
    const [value, setValue] = useState(0);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cookies] = useCookies(['user']);
    const userData = cookies.user;
    const userId = userData ? userData.id : null;
    const sessionNotification = useSelector((state) => state.notification.notification);

    const fetchSessions = useCallback(async (type, signal) => {
        setLoading(true);
        setError(null);
        try {
            const response = await GetSessionWithType(localStorage.getItem("token"), userId, type, signal);
            if (response.data.Credits.length === 0) {
                throw new Error("No sessions found.");
            }
            setSessions(response.data.Credits);
        } catch (error) {
            if (error.name !== 'AbortError') {
                setError("No sessions found");
            }
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        const controller = new AbortController();
        const type = value === 0 ? 'in-progress' : value === 1 ? 'completed' : 'archived';
        fetchSessions(type, controller.signal);

        return () => {
            controller.abort();
        };
    }, [value, fetchSessions]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const smallFontSize = {
        xs: '15px',
        sm: '15px',
        md: '16px',
        lg: '17px',
        xl: '17px'
    };

    const badgeStyles = {
        '& .MuiBadge-badge': {
            color: "rgba(255, 255, 255, 1)",
            backgroundColor: "rgba(255, 90, 89, 1)",
            borderRadius: '50%',
            fontSize: '0.4rem',
            height: '11.5px',
            minWidth: '11.5px',
            marginTop: "3px",
            marginRight: "-5px"
        }
    };

    const renderSkeletons = () => {
        return Array.from(new Array(3)).map((_, index) => (
            <Card
                key={index}
                sx={{ textAlign: 'start', boxShadow: "none", backgroundColor: "rgba(255, 252, 249, 1)", p: 1 }}
            >
                <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                        <Skeleton variant="circular" width={70} height={70} />
                    </Grid>
                    <Grid item xs sx={{ textAlign: 'left', marginTop: '5px' }}>
                        <Skeleton variant="text" width="50px" />
                        <Skeleton variant="text" width="60px" />
                        <Skeleton variant="text" width="120px" />
                        <Skeleton variant="text" width="40px" />
                    </Grid>
                </Grid>
            </Card>
        ));
    };

    const renderSessions = () => {
        return sessions.reverse().map((session) => (
            <Card
                key={session.id}
                sx={{ textAlign: 'start', boxShadow: "none", backgroundColor: "rgba(255, 252, 249, 1)", marginBottom: 2 }}
            >
                <Link to={`/sessions?id=${session.id}&type=${session.status}`} style={{ textDecoration: "none" }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Avatar
                                sx={{
                                    width: { xs: 70, sm: 70 },
                                    height: { xs: 70, sm: 70 },
                                }}
                                src={session.expertUser.files && session.expertUser.profileExpertUrl ? session.expertUser.profileExpertUrl : null}
                            >A</Avatar>
                        </Grid>
                        <Grid item xs sx={{ textAlign: 'left', marginTop: '5px' }}>
                            <Typography
                                variant="h6"
                                fontFamily="Manrope"
                                lineHeight={'0.95rem'}
                                sx={{
                                    color: "#332E3C",
                                    fontWeight: 300,
                                    fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1rem' }
                                }}
                            >
                                {session.expertUser.name}
                            </Typography>
                            <Typography
                                variant="body1"
                                gutterBottom
                                fontFamily="Manrope"
                                sx={{
                                    color: "#332E3C",
                                    fontWeight: 300,
                                    fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1rem' }
                                }}
                            >
                                {session.orderType}
                            </Typography>
                            <Typography
                                variant="body1"
                                fontFamily="Manrope"
                                sx={{
                                    color: "#332E3C",
                                    fontWeight: 600,
                                    fontSize: { xs: '0.9rem', sm: '0.9rem', md: '0.9rem' }
                                }}
                            >
                                {session.createdAt}
                            </Typography>
                            <Typography
                                variant="body1"
                                fontFamily="Manrope"
                                sx={{
                                    color: "#332E3C",
                                    fontWeight: 600,
                                    fontSize: { xs: '0.9rem', sm: '0.9rem', md: '0.9rem' }
                                }}
                            >
                                $ {session.expertUser.price}
                            </Typography>
                        </Grid>
                    </Grid>
                </Link>
            </Card>
        ));
    };

    return (
        <Grid className='container mt-5' sx={{ padding: "0px 35px 0px 35px" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="session tabs"
                    TabIndicatorProps={{ style: { backgroundColor: 'black' } }}
                >
                    <Tab
                        label="In Progress"
                        sx={{
                            textTransform: "capitalize",
                            fontFamily: "Manrope",
                            fontSize: smallFontSize,
                            color: value === 0 ? 'black' : 'primary',
                            fontWeight: value === 0 ? '600' : 'normal',
                            '&.Mui-selected': { color: 'black' }
                        }}
                    />
                    <Tab
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                Completed
                                {sessionNotification && (
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            right: '2px',
                                            top: '-6px',
                                            width: '8px',  // Customize the size of the red dot
                                            height: '8px', // Customize the size of the red dot
                                            backgroundColor: '#FF5A59',
                                            borderRadius: '50%',  // Make it circular
                                        }}
                                    />
                                )}
                            </Box>
                        }
                        sx={{
                            textTransform: "capitalize",
                            fontFamily: "Manrope",
                            fontSize: smallFontSize,
                            color: value === 1 ? 'black' : 'primary',
                            fontWeight: value === 1 ? '600' : 'normal',
                            '&.Mui-selected': { color: 'black' }
                        }}
                    />
                    {/* <Tab
                        label="Archived"
                        sx={{
                            textTransform: "capitalize",
                            fontFamily: "Manrope",
                            fontSize: smallFontSize,
                            color: value === 2 ? 'black' : 'primary',
                            fontWeight: value === 2 ? '600' : 'normal',
                            '&.Mui-selected': { color: 'black' }
                        }}
                    />  */}
                </Tabs>
            </Box>
            {loading ?
                renderSkeletons()
                : error ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography color="error" variant="body1">
                            {error}
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <TabPanel value={value} index={0}>
                            {renderSessions()}
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            {renderSessions()}
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            {renderSessions()}
                        </TabPanel>
                    </>
                )}
        </Grid>
    );
}

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1, mt: 1 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default SessionsTab;
