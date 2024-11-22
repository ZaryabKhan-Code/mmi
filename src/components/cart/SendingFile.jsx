/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    LinearProgress,
    Button,
    Grid,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

const SendingFile = ({ details, progessLoader }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const navigate = useNavigate();

    const handleLinkClick = (event) => {
        event.preventDefault();
        setOpenDialog(true); // Open the confirmation dialog
    };

    const handleConfirm = () => {
        setOpenDialog(false);
        navigate('/expert'); // Navigate to the dashboard
    };

    const handleCancel = () => {
        setOpenDialog(false); // Close the dialog
    };

    return (
        <>
            <Grid className="container mt-2" sx={{ padding: '0px 50px 0px 50px' }}>
                <Grid className="mt-4" sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, ml: -1 }}>
                    <Grid item>
                        <a href="/expert" onClick={handleLinkClick}>
                            <img src="/images/backArrow.svg" alt="Back" style={{ cursor: 'pointer' }} />
                        </a>
                    </Grid>
                </Grid>
                <Grid container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            color: 'rgba(41, 45, 50, 1)',
                            fontFamily: 'Manrope',
                            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
                        }}
                    >
                        File Sending
                    </Typography>
                    <Typography
                        sx={{
                            fontWeight: 500,
                            color: 'rgba(152, 142, 169, 1)',
                            fontFamily: 'Manrope',
                            mt: 1,
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                        }}
                    >
                        Please <span style={{ fontWeight: '600', color: 'black' }}>do not</span> refresh or close this screen
                        until upload is complete.
                    </Typography>
                </Grid>
            </Grid>
            <Grid className="container mt-2" sx={{ padding: '0px 40px 0px 40px' }}>
                <Box
                    sx={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '10px 16px 10px 12px',
                        marginTop: '24px',
                        width: '100%',
                        maxWidth: '500px',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'start',
                        gap: 2,
                    }}
                >
                    <Box
                        component="img"
                        src="/images/filesending.svg"
                        alt="File Sending"
                        sx={{
                            width: '25px', // Adjust width for breakpoints
                            height: 'auto', // Maintain aspect ratio
                            display: 'block',
                            mx: 'auto', // Center the image
                        }}
                    />
                    <Box style={{
                        display: 'flex', flexDirection: 'column', width: '100%'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: '500', color: '#333', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                                {details.messageType}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#666', fontSize: { xs: '0.75rem', sm: '0.875rem' }, }}>
                                {details.fileSizeMB} MB
                            </Typography>
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress
                                variant="determinate"
                                value={progessLoader}
                                sx={{
                                    height: '3px',
                                    borderRadius: '4px',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: '#FF5A59',
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{
                    width: '100%',
                    maxWidth: '500px',
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <Button
                        className='mt-4 mb-3'
                        sx={{
                            padding: '5px 50px',
                            fontSize: 13, // Responsive font size
                            textAlign: 'center',
                            borderRadius: '10px',
                            color: 'rgba(152, 142, 169, 1)',
                            border: '1px solid rgba(152, 142, 169, 1)',
                            textTransform: 'capitalize',
                            '&:hover': {
                                backgroundColor: 'none'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                </Box>
                {/* Confirmation Dialog */}
                <Dialog open={openDialog} onClose={handleCancel}>
                    <DialogTitle>Confirm Navigation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to navigate away? Your upload may be interrupted.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancel} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} color="primary" autoFocus>
                            Yes, Navigate
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </>
    );
};

export default SendingFile;
