import React from 'react'
import { Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const FileSentSongCritique = () => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const { expertName } = queryParams;
    const commonFontSize = {
        xs: '1.5rem',
        sm: '2.5rem',
        md: '2.5rem',
        lg: '3rem',
        xl: '3rem'
    };
    return (
        <>
            <Grid className='container mt-5' sx={{ display: "flex", justifyContent: "center", padding: "0px 30px 0px 30px", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5" fontSize={commonFontSize} component="div" gutterBottom fontWeight={200} sx={{ color: "rgba(51, 46, 60, 1)", fontFamily: 'Manrope' }}>File sent!</Typography>
                <Typography gutterBottom variant="h7" component="div" fontWeight={400} sx={{ color: "rgba(51, 46, 60, 1)", fontFamily: 'Manrope', textAlign: 'center', textWrap: "balance" }}>Your file has been successfully sent. <span style={{ color: 'rgba(255, 90, 89, 1)', marginRight: "4px" }}>{expertName}</span>
                    has been notified.</Typography>
                <Link to={'/expert'} style={{ textDecoration: 'none' }}>
                    <Typography variant="h7" component="div" fontWeight={600} sx={{ color: "rgba(255, 90, 89, 1)", fontFamily: 'Manrope', textAlign: 'center', mt: 1 }}>Back home</Typography>
                </Link>

            </Grid>
        </>
    )
}

export default FileSentSongCritique
