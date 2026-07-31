import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart'; // 1. Import useCart
import { FaRegHeart, FaEye, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart(); // 2. Extract addItem from hook

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  // 3. Connect real cart dispatch action
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`Added ${product.title} to cart!`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to manage your wishlist');
      return;
    }
    toast.success('Updated wishlist preference');
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Image Gallery and Badges Layer */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-xs">
            -{discountPercent}% OFF
          </span>
        )}

        {product.stock === 0 ? (
          <span className="absolute top-3 right-3 z-10 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-xs">
            OUT OF STOCK
          </span>
        ) : product.stock <= 5 ? (
          <span className="absolute top-3 right-3 z-10 rounded bg-amber-500 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
            ONLY {product.stock} LEFT
          </span>
        ) : null}

        <button 
          onClick={toggleWishlist}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-xs transition-transform duration-200 hover:scale-110 hover:text-red-500 opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          <FaRegHeart className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-gradient-to-t from-black/60 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <Link 
            to={`/product/${product.id}`}
            className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50"
          >
            <FaEye className="h-3.5 w-3.5" /> Quick View
          </Link>
        </div>
      </div>

      {/* Meta Section */}
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-xs font-medium tracking-wide text-blue-600 uppercase">{product.brand}</h4>
        <h3 className="mt-1 text-sm font-semibold text-slate-800 line-clamp-2 min-h-[40px]">
          <Link to={`/product/${product.id}`} className="hover:text-blue-600">
            {product.title}
          </Link>
        </h3>

        <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
          <div className="flex">{'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))}</div>
          <span className="text-slate-400 font-medium">({product.totalReviews})</span>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-slate-900">${product.discountPrice}</span>
              <span className="text-xs text-slate-400 line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-slate-900">${product.price}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-xs font-semibold text-white transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
        >
          <FaShoppingCart className="h-3.5 w-3.5" /> Add To Cart
        </button>
      </div>
    </div>
  );
}