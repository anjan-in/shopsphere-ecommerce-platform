import React, { useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/product/ProductGrid';
import { useDispatch } from 'react-redux';
import { setSearchQuery, setSorting } from '../../redux/slices/productSlice';
import type { ProductSortOption } from '../../types/product.types';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, loading, searchQuery, sortOption, loadCatalog } = useProducts();

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Discover Products</h1>
          <p className="mt-1 text-sm text-slate-500">Explore the latest handpicked catalog inventory items.</p>
        </div>

        {/* Controls Panel */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          
          <select
            value={sortOption}
            onChange={(e) => dispatch(setSorting(e.target.value as ProductSortOption))}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="newest">Sort By: Newest</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Main Grid Render */}
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}