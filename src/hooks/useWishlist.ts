import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { toggleWishlistItem, removeFromWishlist, clearWishlist } from '../redux/slices/wishlistSlice';
import type { Product } from '../types/product.types';

export const useWishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.wishlist?.items || []);

  const isInWishlist = (productId: string) => items.some((p) => p.id === productId);

  return {
    wishlistItems: items,
    wishlistCount: items.length,
    isInWishlist,
    toggleWishlist: (product: Product) => dispatch(toggleWishlistItem(product)),
    removeItem: (productId: string) => dispatch(removeFromWishlist(productId)),
    resetWishlist: () => dispatch(clearWishlist()),
  };
};