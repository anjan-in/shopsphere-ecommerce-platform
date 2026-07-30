import { Outlet, Link } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b bg-white p-4 shadow-sm flex gap-4">
        <span className="font-bold mr-4">🛍️ ShopSphere</span>
        {/* Temporary Navigation Links */}
        <Link to="/" className="text-sm text-blue-600 hover:underline">Home</Link>
        <Link to="/products" className="text-sm text-blue-600 hover:underline">All Products</Link>
        <Link to="/product/prod-001" className="text-sm text-blue-600 hover:underline">Sample Product</Link>
        <Link to="/login" className="text-sm text-blue-600 hover:underline">Login</Link>
      </header>
      
      <main className="flex-1 container mx-auto p-6">
        <Outlet /> 
      </main>
      
      <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">© 2026 ShopSphere</footer>
    </div>
  );
}