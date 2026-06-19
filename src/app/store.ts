import { configureStore } from '@reduxjs/toolkit';
// Import your slices here as you build them:
// import authReducer from '../redux/slices/authSlice';
// import cartReducer from '../redux/slices/cartSlice';

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // cart: cartReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;