import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import MainCart from './MainCart';
import PaymentComplete from './PaymentComplete';
import AttachFilesSongCritique from './AttachFilesSongCritique';
import FileSentSongCritique from './FileSentSongCritique';
import AttachFilesQuickHit from './AttachFilesQuickHit';


const Cart = () => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const { orderId, isComplete, type, isSent, expertName, expertID, creditId, expertId, userId } = queryParams;
    const isCartPageWithNoQueryParams = location.pathname === '/cart' && Object.keys(queryParams).length === 0;
    return (
        <Grid>
            {isCartPageWithNoQueryParams && (
                <MainCart />
            )}
            {(orderId && isComplete === 'true' && (type === 'Quick Hit' || type === 'Song Critique')) ? (
                <PaymentComplete type={type === 'Song Critique' ? 'Quick Hit' : undefined} orderId={orderId} expertName={expertName} expertId={expertID || expertId} creditId={creditId} />
            ) : (orderId && (type === 'Quick Hit' || type === 'Song Critique') && isSent === 'true') ? (
                <FileSentSongCritique />
            ) : (orderId && type === 'Song Critique') ? (
                <AttachFilesSongCritique type={'Song Critique'} orderId={orderId} expertId={expertID || expertId} creditId={creditId} />
            ) : (orderId && type === 'Quick Hit') ? (
                <AttachFilesQuickHit type={type} orderId={orderId} expertId={expertID || expertId} creditId={creditId} />
            ) : null}
        </Grid>
    );
}

export default Cart;
