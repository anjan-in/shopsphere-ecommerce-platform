import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import type { Category } from '../../types/product.types';

export default function TopCategories() {
  const { categories, loadCategories } = useProducts();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {categories.slice(0, 6).map((cat: Category) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border bg-white p-4 text-center transition hover:shadow-md"
          >
            <div className="mx-auto h-16 w-16 overflow-hidden rounded-full bg-slate-100">
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition group-hover:scale-110" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-700 group-hover:text-blue-600">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}