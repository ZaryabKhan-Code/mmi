// store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        itemCount: 0,
    },
    reducers: {
        setItemCount: (state, action) => {
            state.itemCount = action.payload;
        },
    },
});

export const { setItemCount } = cartSlice.actions;
export default cartSlice.reducer;
