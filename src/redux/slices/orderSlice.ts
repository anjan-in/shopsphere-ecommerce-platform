import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { OrderState, Order } from '../../types/order.types';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    orderStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.currentOrder = action.payload;
      state.orders.unshift(action.payload);
    },
    fetchOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
});

export const { 
  orderStart, 
  createOrderSuccess, 
  fetchOrdersSuccess, 
  orderFailure, 
  clearCurrentOrder 
} = orderSlice.actions;

export default orderSlice.reducer;