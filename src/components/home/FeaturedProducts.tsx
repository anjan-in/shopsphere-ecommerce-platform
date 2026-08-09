import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../product/ProductGrid';

export default function FeaturedProducts() {
  const { products, loading } = useProducts();

  // Filter products for featured items
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Products</h2>
      </div>
      <ProductGrid products={featuredProducts} loading={loading} />
    </section>
  );
}