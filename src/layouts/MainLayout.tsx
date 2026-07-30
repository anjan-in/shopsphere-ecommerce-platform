import { Outlet, Link } from 'react-router-dom';
import { seedDatabase } from '../utils/seedData';
import toast from 'react-hot-toast';

export default function MainLayout() {
  const handleSeed = async () => {
    try {
      await seedDatabase();
      toast.success('Database seeded successfully! Refresh the page.');
    } catch (err: any) {
      toast.error('Seeding failed: ' + err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b bg-white p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-bold text-blue-600">🛍️ ShopSphere</Link>
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-blue-600">Home</Link>
          <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-blue-600">All Products</Link>
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">Login</Link>
        </div>
        
        {/* Temporary Seed Button */}
        <button 
          onClick={handleSeed}
          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
        >
          🌱 Seed Firestore Data
        </button>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>

      <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">© 2026 ShopSphere</footer>
    </div>
  );
}