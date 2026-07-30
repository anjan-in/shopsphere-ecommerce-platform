import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartState, CartItem } from '../../types/cart.types';
import type { Product } from '../../types/product.types';

const CART_STORAGE_KEY = 'shopsphere_cart';

// Helper to load persisted cart from local storage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
  promoCode: null,
  discountPercentage: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      state.isOpen = true; // Auto open cart drawer on addition
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === id);

      if (item && quantity > 0) {
        item.quantity = quantity;
      }

      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem(CART_STORAGE_KEY);
    },

    toggleCartDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      state.isOpen = action.payload !== undefined ? action.payload : !state.isOpen;
    },

    applyPromoCode: (state, action: PayloadAction<string>) => {
      if (action.payload.toUpperCase() === 'PROMO10') {
        state.promoCode = 'PROMO10';
        state.discountPercentage = 10;
      }
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCartDrawer, 
  applyPromoCode 
} = cartSlice.actions;

export default cartSlice.reducer;