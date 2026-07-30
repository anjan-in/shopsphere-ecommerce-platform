import type { Product } from './product.types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  discountTotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean; // For slide-over drawer toggle
  promoCode: string | null;
  discountPercentage: number;
}