import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../hooks/useProducts';
import { Search, X, Flame, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [query, setQuery] = useState('');

  const trendingSearches = ['Headphones', 'Smartwatch', 'Wireless', 'Ergonomic', 'USB-C'];

  const filteredProducts = query.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm">
        
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-soft-lg backdrop-blur-xl"
        >
          {/* Header */}
          <div className="relative flex items-center border-b border-slate-200/80 pb-3">
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search products, brands, or categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent pl-10 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {query ? (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-400">ESC</kbd>
            )}
          </div>

          {/* Results */}
          <div className="mt-4 max-h-80 overflow-y-auto space-y-4">
            {query.trim() === '' ? (
              <div className="space-y-2 px-2 py-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <Flame className="h-3.5 w-3.5 text-amber-500" /> Trending Searches
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">Matching Products</p>
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      navigate(`/product/${p.id}`);
                    }}
                    className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-100/70 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.thumbnail} alt="" className="h-10 w-10 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition">{p.title}</h4>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">{p.brand}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-extrabold text-slate-900">${p.discountPrice ?? p.price}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-600 transition" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No matching products found for "<span className="font-semibold text-slate-700">{query}</span>"
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  );
}