import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CartDrawer from '../components/cart/CartDrawer';
import { FaShoppingBag, FaUser, FaBox, FaSearch } from 'react-icons/fa';

export default function MainLayout() {
  const { summary, toggleDrawer } = useCart();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 text-slate-900 bg-mesh-gradient">
      
      {/* Floating Glassmorphism Navbar */}
      <header className="sticky top-0 z-40 glass-header px-6 py-3.5 shadow-soft-xs transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-soft-xs transition-transform duration-300 group-hover:scale-105">
                🛍️
              </span>
              <span className="text-xl font-black tracking-tight text-slate-900">
                Shop<span className="text-blue-600">Sphere</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link 
                to="/" 
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 transition"
              >
                All Products
              </Link>
            </nav>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-3">
            
            {/* Quick Search Bar Placeholder */}
            <Link 
              to="/products"
              className="hidden sm:flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-100/50 px-3.5 py-2 text-xs text-slate-400 hover:border-slate-300 hover:bg-white transition w-48 lg:w-64"
            >
              <FaSearch className="h-3.5 w-3.5 text-slate-400" />
              <span>Search products...</span>
              <kbd className="ml-auto rounded bg-slate-200/60 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">⌘K</kbd>
            </Link>

            {/* Cart Trigger */}
            <button 
              onClick={() => toggleDrawer(true)}
              className="relative rounded-xl border border-slate-200/80 bg-white/80 p-2.5 text-slate-700 shadow-soft-xs hover:border-blue-200 hover:text-blue-600 hover:shadow-soft-md transition"
            >
              <FaShoppingBag className="h-4 w-4" />
              {summary.itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-gradient text-[10px] font-extrabold text-white shadow-soft-xs">
                  {summary.itemCount}
                </span>
              )}
            </button>

            {/* Auth Actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link 
                  to="/orders" 
                  className="rounded-xl border border-slate-200/80 bg-white/80 p-2.5 text-slate-700 shadow-soft-xs hover:border-blue-200 hover:text-blue-600 transition" 
                  title="My Orders"
                >
                  <FaBox className="h-4 w-4" />
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2 text-xs font-bold text-slate-700 shadow-soft-xs hover:bg-slate-50 hover:border-slate-300 transition"
                >
                  <FaUser className="h-3 w-3 text-blue-600" />
                  <span className="hidden sm:inline">{user.fullName?.split(' ')[0]}</span>
                </Link>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="rounded-xl bg-primary-gradient px-4 py-2 text-xs font-bold text-white shadow-soft-xs hover:shadow-soft-md hover:opacity-95 transition"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <CartDrawer />

      {/* Modern Footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 backdrop-blur-md py-6 text-center text-xs font-medium text-slate-400">
        © 2026 ShopSphere E-Commerce Inc. All rights reserved.
      </footer>
    </div>
  );
}