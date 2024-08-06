import { Grid } from '@mui/material';
import React from 'react';

const Loading = () => {
    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                backgroundColor: 'white',
                textAlign: 'center',
                zIndex: 9999,
            }}
        >
            <img src={"/loadinganimation.gif"} style={{
                width: "auto", height:
                    "300px", objectFit: "cover"
            }} alt="Loading..." />
        </Grid>
    );
}

export default Loading;
