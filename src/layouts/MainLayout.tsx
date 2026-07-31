import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import CartDrawer from '../components/cart/CartDrawer';
import { FaShoppingBag } from 'react-icons/fa';

export default function MainLayout() {
  const { summary, toggleDrawer } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-blue-600">🛍️ ShopSphere</Link>
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">Home</Link>
          <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-blue-600">All Products</Link>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Cart Icon Drawer Trigger */}
          <button 
            onClick={() => toggleDrawer(true)}
            className="relative p-2 text-slate-600 hover:text-blue-600 transition"
          >
            <FaShoppingBag className="h-5 w-5" />
            {summary.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {summary.itemCount}
              </span>
            )}
          </button>

          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">Login</Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>

      {/* Global Mount for Slide-Over Cart Drawer */}
      <CartDrawer />

      <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">© 2026 ShopSphere</footer>
    </div>
  );
}