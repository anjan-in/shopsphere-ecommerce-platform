import { useEffect, useState } from 'react';
import { db } from '../../../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { FaDollarSign, FaBox, FaShoppingBag, FaUsers } from 'react-icons/fa';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'products')),
          getDocs(collection(db, 'users')),
        ]);

        let revenue = 0;
        ordersSnap.docs.forEach((doc) => {
          revenue += doc.data().summary?.total || 0;
        });

        setMetrics({
          totalRevenue: revenue,
          totalOrders: ordersSnap.size,
          totalProducts: productsSnap.size,
          totalUsers: usersSnap.size,
        });
      } catch (err) {
        console.error('Error loading admin metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) return <div className="text-sm font-semibold text-slate-500">Loading metrics...</div>;

  const statCards = [
    { label: 'Total Revenue', value: `$${metrics.totalRevenue.toFixed(2)}`, icon: FaDollarSign, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Total Orders', value: metrics.totalOrders, icon: FaShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Products', value: metrics.totalProducts, icon: FaBox, color: 'text-purple-600 bg-purple-50' },
    { label: 'Registered Users', value: metrics.totalUsers, icon: FaUsers, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Admin Analytics Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">High-level store performance summary</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="rounded-2xl border bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{card.label}</span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{card.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}