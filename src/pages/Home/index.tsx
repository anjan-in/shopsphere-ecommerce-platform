import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/product/ProductCard';

export default function HomePage() {
  const { featuredProducts, categories, loading, loadFeatured, loadCategories } = useProducts();

  useEffect(() => {
    loadFeatured();
    loadCategories();
  }, [loadFeatured, loadCategories]);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg sm:p-12">
        <div className="max-w-xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Welcome to ShopSphere</span>
          <h1 className="text-3xl font-extrabold sm:text-5xl">Next-Gen Shopping Experience</h1>
          <p className="text-sm text-blue-100">Explore curated electronics, fashion, and home essentials with instant checkout.</p>
          <div className="pt-2">
            <Link to="/products" className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-bold text-blue-600 shadow-sm transition hover:bg-blue-50">
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Top Categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="group rounded-xl border bg-white p-4 text-center transition hover:shadow-md">
              <div className="mx-auto h-12 w-12 overflow-hidden rounded-full bg-slate-100">
                <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition group-hover:scale-110" />
              </div>
              <h3 className="mt-2 text-xs font-semibold text-slate-700">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Featured Products</h2>
          <Link to="/products" className="text-xs font-semibold text-blue-600 hover:underline">View All →</Link>
        </div>
        
        {loading ? (
          <p className="text-sm text-slate-500">Loading catalog...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}