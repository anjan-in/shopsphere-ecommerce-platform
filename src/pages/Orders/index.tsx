import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import type { Order, OrderStatus } from '../../types/order.types';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  ChevronRight,
  MapPin
} from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await orderService.getUserOrders(user.uid);
        // Sort newest first
        setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="h-3 w-3" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-blue-700 border border-blue-200/60">
            <Truck className="h-3 w-3 text-blue-600" /> Shipped
          </span>
        );
      case 'processing':
        return (
          <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-extrabold text-indigo-700 border border-indigo-200/60">
            <Clock className="h-3 w-3" /> Processing
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-extrabold text-red-700 border border-red-200/60">
            <XCircle className="h-3 w-3" /> Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-extrabold text-amber-700 border border-amber-200/60">
            <Clock className="h-3 w-3" /> Order Placed
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto py-8">
        {[1, 2].map((n) => (
          <div key={n} className="h-44 rounded-3xl bg-slate-200/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center space-y-4 my-12 max-w-md mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto">
          <Package className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No Orders Found</h2>
        <p className="text-xs text-slate-400">You haven't placed any purchases yet.</p>
        <Link
          to="/products"
          className="inline-block rounded-xl bg-primary-gradient px-6 py-3 text-xs font-bold text-white shadow-soft-xs hover:opacity-95 transition"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Order History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track shipments, view receipts, and review past orders
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="glass-panel rounded-3xl border border-slate-200/80 p-6 shadow-soft-xs space-y-4 overflow-hidden"
          >
            {/* Top Order Info Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">Order #{order.id?.slice(0, 8)}</span>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Total Amount</span>
                <p className="text-base font-black text-slate-900">${order.summary.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Item Thumbnails & Titles */}
            <div className="space-y-3">
              {order.items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.thumbnail}
                      alt=""
                      className="h-12 w-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200/60"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800 line-clamp-1">{product.title}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">Qty: {quantity}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ${((product.discountPrice ?? product.price) * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Shipping Address Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                <span>Shipping to: <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city}, {order.shippingAddress.state})</span>
              </div>
              
              <Link
                to={`/order-success/${order.id}`}
                className="flex items-center gap-1 font-bold text-blue-600 hover:underline"
              >
                View Receipt <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}