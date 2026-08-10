import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../types/product.types';
import { useCart } from '../../hooks/useCart';
import { Star, ShoppingBag, Eye, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // Secondary hover image fallback
  const primaryImage = product.thumbnail || product.images?.[0];
  const secondaryImage = product.images?.[1] || primaryImage;

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-soft-xs hover:shadow-soft-md hover:border-slate-300 transition-all duration-300 backdrop-blur-md"
    >
      {/* Top Media & Badges */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
        
        {/* Hover Cross-Fade Image Gallery */}
        <Link to={`/product/${product.id}`} className="block h-full w-full">
          <img
            src={isHovered ? secondaryImage : primaryImage}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 rounded-lg bg-red-600 px-2 py-0.5 text-[10px] font-black text-white shadow-soft-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Stock Status Pill */}
        <span className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-extrabold text-slate-700 backdrop-blur-md border border-white/40">
          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
          <span>In Stock</span>
        </span>

        {/* Slide-Up Quick Add Overlay (Desktop) */}
        <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={() => addItem(product)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-soft-md hover:bg-blue-600 transition"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Quick Add
          </button>
          <Link
            to={`/product/${product.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-2 text-slate-700 shadow-soft-md hover:bg-slate-100 transition"
            title="Quick View"
          >
            <Eye className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-3.5 space-y-2 px-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-extrabold uppercase tracking-wider text-blue-600">{product.brand}</span>
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{product.rating || '4.8'}</span>
            <span className="text-slate-400">({product.totalReviews || 12})</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
            {product.title}
          </h3>
        </Link>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-slate-900">
              ${product.discountPrice ?? product.price}
            </span>
            {product.discountPrice && (
              <span className="text-[11px] font-semibold text-slate-400 line-through">
                ${product.price}
              </span>
            )}
          </div>

          <button
            onClick={() => addItem(product)}
            className="sm:hidden rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-blue-600 hover:text-white transition"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}