import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GetSessionNotification } from '../services/user';

export const fetchNotification = createAsyncThunk(
    'notification/fetchNotification',
    async (userId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await GetSessionNotification(token, userId);
            return response.data.Credit;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response.data);
        }
    }
);

const sessionNotificationSlice = createSlice({
    name: 'notification',
    initialState: {
        notification: false,
        status: 'idle',
        error: null,
    },
    reducers: {
        setNotification: (state, action) => {
            state.notification = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotification.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotification.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.notification = action.payload;
            })
            .addCase(fetchNotification.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setNotification } = sessionNotificationSlice.actions;
export default sessionNotificationSlice.reducer;
