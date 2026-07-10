import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="px-8 py-20 sm:px-16 sm:py-32 max-w-2xl relative z-10">
        <span className="text-sm font-semibold uppercase tracking-widest text-blue-200">Mid-Season Sale</span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
          Upgrade Your Lifestyle, Effortlessly.
        </h1>
        <p className="mt-6 text-lg text-blue-100">
          Explore curated top-tier tech, fashion, and living essentials with seamless delivery.
        </p>
        <div className="mt-10">
          <Link
            to="/products"
            className="rounded-md bg-white px-6 py-3 font-semibold text-blue-600 shadow transition hover:bg-blue-50"
          >
            Shop the Collection
          </Link>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 opacity-10 text-9xl font-black select-none pointer-events-none p-8 hidden md:block">
        SHOPSPHERE
      </div>
    </div>
  );
}