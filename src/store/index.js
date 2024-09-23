import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';  // Existing cart slice
import sessionNotificationReducer from './sessionNotificationSlice';  // Import the sessionNotification reducer

const store = configureStore({
    reducer: {
        cart: cartReducer,  // Existing cart reducer
        notification: sessionNotificationReducer,  // Add the notification reducer
    },
});

export default store;
