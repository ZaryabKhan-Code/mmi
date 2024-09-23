import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetTotalCartItem } from '../services/cart';

export const fetchItemCount = createAsyncThunk(
    'cart/fetchItemCount',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await GetTotalCartItem(token, userId);
            return response.data.items;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        itemCount: 0,
        status: 'idle',
        error: null,
    },
    reducers: {
        setItemCount: (state, action) => {
            state.itemCount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItemCount.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchItemCount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.itemCount = action.payload;
            })
            .addCase(fetchItemCount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setItemCount } = cartSlice.actions;
export default cartSlice.reducer;
