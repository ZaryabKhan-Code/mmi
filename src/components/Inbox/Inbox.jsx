/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Box, Tabs, Avatar, Tab, Grid, Divider, Typography } from '@mui/material';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import Message from './Message';

const Inbox = () => {
    const smallFontSize = {
        xs: '15px',
        sm: '15px',
        md: '16px',
        lg: '17px',
        xl: '17px'
    };
    const [value, setValue] = useState(0);
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const { id } = queryParams;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container className='container mt-4' sx={{ padding: "0px 30px 0px 40px" }} flexDirection={'column'}>
            {id && (
                <>
                    <Grid item sx={{ mb: 2 }}>
                        <img src='/images/backArrow.svg' alt="Back" style={{ cursor: "pointer" }} />
                    </Grid>
                </>
            )}
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example"
                    TabIndicatorProps={{ sx: { backgroundColor: 'black' } }}
                >
                    <Tab
                        label="Messages"
                        sx={{
                            fontSize: smallFontSize,
                            fontWeight: 600,
                            fontFamily: "Manrope",
                            textTransform: 'capitalize',
                            color: 'rgba(51, 46, 60, 1)',
                            '&.Mui-selected': {
                                color: 'rgba(51, 46, 60, 1)',
                            },
                        }}

                    />
                </Tabs>
                <Divider />
                <TabPanel value={value} index={0}>
                    {id ? <Message /> : <ListUser />}
                </TabPanel>
            </Box>
        </Grid>
    );
};

export default Inbox;

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};


const ListUser = () => {
    const users = [
        { name: 'Sandy - MMI Assistant', message: 'Hey, Landon. Sandy from MMI here. I’ll be here for any questions you might have. Let me know how things are going with your experience.', avatar: '/images/alice.jpg' },
        { name: 'Dany - MMI Assistant', message: 'Hey, Landon. Sandy from MMI here. I’ll be here for any questions you might have. Let me know how things are going with your experience.', avatar: '/images/bob.jpg' },
        { name: 'John - MMI Assistant', message: 'Hey, Landon. Sandy from MMI here. I’ll be here for any questions you might have. Let me know how things are going with your experience.', avatar: '/images/charlie.jpg' }
    ];

    const truncateMessage = (message, limit = 50) => {
        if (message.length > limit) {
            return message.substring(0, limit) + '...';
        }
        return message;
    };

    return (
        <Box sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
            {users.map((user, index) => (
                <React.Fragment key={index}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'start',
                            gap: 0,
                            mb: 2,
                            mt: 2,
                            flexDirection: { xs: 'row', sm: 'row' },
                            textAlign: { xs: 'left', sm: 'left' }
                        }}
                    >
                        <Avatar
                            src={user.avatar}
                            alt={user.name}
                            sx={{
                                mr: { xs: 1, sm: 1 },
                                mb: { xs: 0, sm: 1 },
                                width: { xs: 60, sm: 70 },
                                height: { xs: 60, sm: 70 },
                            }}
                        />
                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 0,
                                    fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1rem' }
                                }}

                            >
                                {user.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    mb: 0,
                                    maxWidth: { xs: '100%', sm: '80%' },
                                    fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1rem' }
                                }}
                                lineHeight={1.2}
                            >
                                {truncateMessage(user.message)}
                            </Typography>
                        </Box>
                    </Box>
                    <Divider />
                </React.Fragment>
            ))}
        </Box>
    );
};

