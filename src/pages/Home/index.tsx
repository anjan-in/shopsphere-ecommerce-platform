import React, { Suspense } from 'react';
import HeroBanner from '../../components/home/HeroBanner';
import ProductSkeleton from '../../components/product/ProductSkeleton';

// Lazy Loaded Sections
const TopCategories = React.lazy(() => import('../../components/home/TopCategories'));
const FeaturedProducts = React.lazy(() => import('../../components/home/FeaturedProducts'));
const Newsletter = React.lazy(() => import('../../components/home/Newsletter'));

// Reusable clean section placeholder for suspense bundles
const SectionLoader = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
    {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
  </div>
);

export default function HomePage() {
  return (
    <div className="space-y-16 pb-12">
      {/* 1. Above the Fold Content - Loaded Instantly */}
      <HeroBanner />

      {/* 2. Below the Fold Content - Lazy Loaded Dynamically */}
      <Suspense fallback={<div className="h-24 animate-pulse rounded-lg bg-slate-100" />}>
        <TopCategories />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FeaturedProducts />
      </Suspense>

      <Suspense fallback={<div className="h-48 animate-pulse rounded-lg bg-slate-800" />}>
        <Newsletter />
      </Suspense>
    </div>
  );
}