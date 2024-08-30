import React from 'react';
import { Button, Grid, Box, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Cancel = () => {


    return (
        <Container style={{ textAlign: 'center', marginTop: '20vh' }}>
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
                    Payment Cancelled
                </Typography>
                <Box component={'img'} src='/images/sadIcon.svg' width={90} className='mt-2' />
            </Grid>
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
        </Container>
    );
};

export default Cancel;
