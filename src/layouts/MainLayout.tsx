import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CartDrawer from '../components/cart/CartDrawer';
import { FaShoppingBag, FaUser, FaBox } from 'react-icons/fa';

export default function MainLayout() {
  const { summary, toggleDrawer } = useCart();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md p-4 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-blue-600">🛍️ ShopSphere</Link>
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">Home</Link>
          <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-blue-600">All Products</Link>
        </div>
        
        <div className="flex items-center gap-4">
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

          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link to="/orders" className="p-2 text-slate-600 hover:text-blue-600 transition" title="My Orders">
                <FaBox className="h-4 w-4" />
              </Link>
              <Link to="/profile" className="flex items-center gap-2 rounded-full border bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100">
                <FaUser className="h-3 w-3 text-blue-600" />
                <span>{user.fullName?.split(' ')[0]}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-semibold text-blue-600 hover:underline">
              Login
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>

      <CartDrawer />

      <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">© 2026 ShopSphere</footer>
    </div>
  );
}