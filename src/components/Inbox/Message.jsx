import React from 'react';
import { Box, Avatar, Button, Typography, TextField } from '@mui/material';

const Message = () => {
    // Mock data for the message
    const user = {
        name: 'Sandy - MMI Assistant',
        avatar: '/images/alice.jpg',
        message: 'Hey, Landon. Sandy from MMI here. I’ll be here for any questions you might have. Let me know how things are going with your experience.',
        sender: 'Sandy'
    };

    return (
        <>
            <Box sx={{ px: { xs: 1, sm: 2, md: 3 }, display: 'flex', alignItems: 'start', gap: 0.5, mt: 2 }}>
                <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{
                        width: { xs: 60, sm: 70 },
                        height: { xs: 60, sm: 70 },
                    }}
                />
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: '500',
                        fontFamily: "Manrope",
                        color: "rgba(0, 0, 0, 1)",
                        fontSize: { xs: '0.9rem', sm: '1.25rem' }  // Responsive font size
                    }}
                >
                    {user.name}
                </Typography>
            </Box>
            <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, display: 'flex', alignItems: 'start', mt: 2, flexDirection: "column" }}>
                <Typography
                    gutterBottom
                    variant="subtitle1"
                    sx={{
                        fontWeight: '400',
                        color: "rgba(0, 0, 0, 1)",
                        fontFamily: "Manrope",
                        fontSize: { xs: '0.8rem', sm: '1.25rem' }  // Responsive font size
                    }}
                >
                    {user.message}
                </Typography>
                <Typography
                    gutterBottom
                    variant="subtitle1"
                    sx={{
                        mt: 2,
                        fontWeight: '400',
                        color: "rgba(0, 0, 0, 1)",
                        fontFamily: "Manrope",
                        fontSize: { xs: '0.8rem', sm: '1.25rem' }  // Responsive font size
                    }}
                >
                    -{user.sender}
                </Typography>

                <Typography
                    gutterBottom
                    variant="subtitle1"
                    sx={{
                        mt: 2,
                        fontWeight: '500',
                        color: "rgba(0, 0, 0, 1)",
                        fontFamily: "Manrope",
                        fontSize: { xs: '0.8rem', sm: '1.25rem' }  // Responsive font size
                    }}
                >
                    Reply to Sandy
                </Typography>
                <form style={{ width: "100%" }}>
                    <TextField
                        multiline
                        minRows={5}
                        fullWidth
                        InputProps={{ style: { borderRadius: "10px" } }}
                        sx={{
                            '& .MuiInputBase-root': {
                                fontSize: { xs: '0.8rem', sm: '1rem' }, // Adjust font size for responsiveness
                                padding: '10px' // Adjust padding for better spacing
                            },
                            '& .MuiInputBase-inputMultiline': {
                            }
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: "flex-end", mt: 1.5, cursor: "pointer", }}>
                        <img src="/images/sendArrow.svg" style={{ width: "1.3rem", height: "1.3rem" }} /><Typography sx={{ ml: 1, fontSize: '0.9rem' }} >Send</Typography>
                    </Box>
                </form>
            </Box>
        </>
    );
}

export default Message;
