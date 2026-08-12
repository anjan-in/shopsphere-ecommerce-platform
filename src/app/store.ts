import { configureStore } from '@reduxjs/toolkit';
// Import your slices here as you build them:
import authReducer from '../redux/slices/authSlice';
import productReducer from '../redux/slices/productSlice';
import cartReducer from '../redux/slices/cartSlice';
import orderReducer from '../redux/slices/orderSlice';
import wishlistReducer from '../redux/slices/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;