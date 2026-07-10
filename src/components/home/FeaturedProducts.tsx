import React, { useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductGrid from '../product/ProductGrid';

export default function FeaturedProducts() {
  const { featuredProducts, loading, loadFeatured } = useProducts();

  useEffect(() => {
    loadFeatured();
  }, [loadFeatured]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Products</h2>
      </div>
      <ProductGrid products={featuredProducts} loading={loading} />
    </section>
  );
}