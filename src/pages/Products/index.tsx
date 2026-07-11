import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../../components/product/ProductGrid';
import { setSearchQuery, setSorting, setFilters, clearFilters } from '../../redux/slices/productSlice';
import type { ProductSortOption } from '../../types/product.types';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, loading, searchQuery, sortOption, filters, categories, loadCatalog, loadCategories } = useProducts();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        
        {/* 1. Filter Control Sidebar Options Panel Layout */}
        <aside className="w-full shrink-0 lg:w-64 space-y-6 rounded-xl border bg-white p-5 shadow-xs h-fit">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-bold text-slate-900">Filters</h2>
            <button 
              onClick={() => dispatch(clearFilters())}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Categorical Filtering Lists */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</h3>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => dispatch(setFilters({ category: filters.category === cat.id ? undefined : cat.id }))}
                  className={`rounded-md px-3 py-1.5 text-left text-xs font-medium transition-colors w-max lg:w-full ${
                    filters.category === cat.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Ceiling Controls Range */}
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Price Ceiling</h3>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={filters.maxPrice || 1000}
              onChange={(e) => dispatch(setFilters({ maxPrice: Number(e.target.value) }))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>$0</span>
              <span className="text-slate-800 font-semibold">Max: ${filters.maxPrice || 1000}</span>
            </div>
          </div>
        </aside>

        {/* 2. Main Catalog Grid Presentation Core Layout Area */}
        <main className="flex-1 space-y-6">
          
          {/* Top Bar Searching, Sorting & Controls Hub */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-white p-4 shadow-xs">
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center justify-end">
              <select
                value={sortOption}
                onChange={(e) => dispatch(setSorting(e.target.value as ProductSortOption))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-xs transition focus:border-blue-500 focus:outline-none"
              >
                <option value="newest">Sort By: Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Dynamic Grid Mount Point 
              Breakpoints are managed elegantly inside the ProductGrid container:
              Mobile: grid-cols-1 | Tablet: sm:grid-cols-2 / md:grid-cols-3 | Desktop: lg:grid-cols-4 
          */}
          <ProductGrid products={products} loading={loading} />
        </main>
      </div>
    </div>
  );
}