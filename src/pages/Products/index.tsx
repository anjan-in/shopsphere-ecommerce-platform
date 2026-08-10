import { useState } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/product/ProductCard';
import ProductSkeleton from '../../components/product/ProductSkeleton';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export default function ProductsPage() {
  const { products, loading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  // Extract unique brands safely
  const brands = ['all', ...Array.from(new Set(products.map((p) => p.brand).filter(Boolean)))];

  // Defensive Filter & Sort Logic
  const filteredProducts = products
    .filter((p) => {
      const title = p.title?.toLowerCase() || '';
      const brand = p.brand?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();

      const matchesSearch = title.includes(query) || brand.includes(query);
      const matchesBrand = selectedBrand === 'all' || p.brand?.toLowerCase() === selectedBrand.toLowerCase();

      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      const priceA = a.discountPrice || a.price || 0;
      const priceB = b.discountPrice || b.price || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-soft-lg space-y-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Complete Catalog</span>
        <h1 className="text-2xl sm:text-4xl font-black">All Tech Products</h1>
        <p className="text-xs text-slate-300 max-w-lg">
          Browse through our active inventory of premium sound gear, smart wearables, and gaming peripherals.
        </p>
      </div>

      {/* Filters & Control Bar */}
      <div className="glass-panel rounded-2xl p-4 shadow-soft-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200/80 bg-white/80 py-2 pl-10 pr-4 text-xs font-medium focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Brand & Sort Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-transparent font-bold text-slate-700 focus:outline-none capitalize"
            >
              {brands.map((b) => (
                <option key={b} value={b}>Brand: {b}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-700 focus:outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <ProductSkeleton key={n} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
          <p className="text-base font-bold text-slate-800">No matching products found</p>
          <p className="text-xs text-slate-400">Try adjusting your search filters or selected brand.</p>
        </div>
      )}

    </div>
  );
}