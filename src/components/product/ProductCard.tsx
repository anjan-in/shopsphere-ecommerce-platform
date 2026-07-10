import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product.types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Details Area */}
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{product.brand}</span>
        <h3 className="mt-1 text-sm font-medium text-slate-800 line-clamp-2">
          <Link to={`/product/${product.id}`}>
            <span className="absolute inset-0 z-10" />
            {product.title}
          </Link>
        </h3>

        {/* Ratings block */}
        <div className="mt-2 flex items-center text-xs text-amber-500">
          {'★'.repeat(Math.round(product.rating))}
          <span className="ml-1 text-slate-400">({product.totalReviews})</span>
        </div>

        {/* Pricing Layout */}
        <div className="mt-auto pt-3 flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-slate-900">${product.discountPrice}</span>
              <span className="text-sm text-slate-400 line-through">${product.price}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-slate-900">${product.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}