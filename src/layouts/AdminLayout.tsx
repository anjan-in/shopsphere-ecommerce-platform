import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b bg-white p-4 font-bold shadow-sm">ShopSphere Header (Navbar)</header>
      <main className="flex-1 container mx-auto p-6">
        <Outlet />
      </main>
      <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">© 2026 ShopSphere</footer>
    </div>
  );
}
