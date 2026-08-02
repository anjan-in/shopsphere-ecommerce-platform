import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types/order.types';
import { FaBoxOpen, FaArrowRight } from 'react-icons/fa';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      orderService.getUserOrders(user.uid).then((data) => {
        setOrders(data);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) return <div className="py-16 text-center text-sm font-medium">Loading Order History...</div>;

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-4">
        <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <FaBoxOpen className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Orders Found</h2>
        <p className="text-xs text-slate-500">You haven't placed any orders yet. Explore our store to start shopping!</p>
        <Link to="/products" className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl py-8 space-y-6">
      <h1 className="text-2xl font-extrabold text-slate-900">My Order History</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-2xl border bg-white p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 text-xs">
              <div>
                <span className="text-slate-400">Order ID: </span>
                <span className="font-mono font-bold text-slate-800">{order.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="capitalize rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                  {order.status}
                </span>
                <span className="text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-800">{product.title} (x{quantity})</span>
                  <span className="font-bold text-slate-900">
                    ${((product.discountPrice ?? product.price) * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-3 text-xs">
              <span className="font-extrabold text-slate-900 text-sm">
                Total: <span className="text-blue-600">${order.summary.total.toFixed(2)}</span>
              </span>

              <Link
                to={`/order-success/${order.id}`}
                className="flex items-center gap-1.5 font-bold text-blue-600 hover:underline"
              >
                View Receipt <FaArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}