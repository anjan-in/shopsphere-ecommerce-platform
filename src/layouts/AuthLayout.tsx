import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b bg-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-blue-600">🛍️ ShopSphere</Link>
          <Link to="/" className="text-xs font-semibold text-slate-600 hover:text-blue-600">
            ← Back to Store
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>

      <footer className="border-t bg-white p-4 text-center text-xs text-slate-400">
        © 2026 ShopSphere Auth Gateway
      </footer>
    </div>
  );
}