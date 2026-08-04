import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaChartBar, FaBox, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';

export default function AdminLayout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4 bg-slate-50 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
        <p className="text-xs text-slate-500">You must be logged in as an Administrator to access this area.</p>
        <button onClick={() => navigate('/')} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white">
          Return to Storefront
        </button>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: FaChartBar },
    { label: 'Products', path: '/admin/products', icon: FaBox },
    { label: 'Orders', path: '/admin/orders', icon: FaShoppingBag },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-slate-900 text-white flex flex-col justify-between p-4">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="text-lg font-bold text-blue-400">🛍️ ShopSphere Admin</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 p-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition"
        >
          <FaArrowLeft className="h-3 w-3" /> Back to Storefront
        </Link>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}