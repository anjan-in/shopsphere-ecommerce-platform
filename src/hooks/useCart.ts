import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  toggleCartDrawer,
  applyPromoCode
} from '../redux/slices/cartSlice';
import type { Product } from '../types/product.types';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, isOpen, promoCode, discountPercentage } = useSelector((state: RootState) => state.cart);

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const discountTotal = (subtotal * discountPercentage) / 100;
  const tax = (subtotal - discountTotal) * 0.08; // 8% tax rate
  const shipping = subtotal > 100 || items.length === 0 ? 0 : 15; // Free shipping over $100
  const total = subtotal - discountTotal + tax + shipping;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return {
    items,
    isOpen,
    promoCode,
    summary: {
      subtotal,
      discountTotal,
      tax,
      shipping,
      total,
      itemCount
    },
    addItem: (product: Product, quantity?: number) => dispatch(addToCart({ product, quantity })),
    removeItem: (id: string) => dispatch(removeFromCart(id)),
    setQuantity: (id: string, quantity: number) => dispatch(updateQuantity({ id, quantity })),
    resetCart: () => dispatch(clearCart()),
    toggleDrawer: (open?: boolean) => dispatch(toggleCartDrawer(open)),
    applyPromo: (code: string) => dispatch(applyPromoCode(code))
  };
};