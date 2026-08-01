import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import type { Order } from '../../types/order.types';
import { FaCheckCircle, FaShoppingBag } from 'react-icons/fa';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      orderService.getOrderById(id).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="py-16 text-center text-sm font-medium">Loading Order Details...</div>;

  return (
    <div className="mx-auto max-w-2xl py-12 px-4 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <FaCheckCircle className="h-10 w-10" />
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Order Confirmed</span>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Thank You For Your Order!</h1>
        <p className="mt-1 text-xs text-slate-500">Order ID: <span className="font-mono font-bold text-slate-800">{id}</span></p>
      </div>

      {order && (
        <div className="rounded-2xl border bg-white p-6 text-left space-y-4 shadow-2xs text-xs">
          <div className="border-b pb-3 flex justify-between font-bold">
            <span>Shipping To:</span>
            <span className="text-slate-600">{order.shippingAddress.fullName}</span>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-slate-700">Items Ordered:</p>
            {order.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-slate-600">
                <span>{product.title} x {quantity}</span>
                <span className="font-bold">${((product.discountPrice ?? product.price) * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 flex justify-between font-extrabold text-sm text-slate-900">
            <span>Total Paid:</span>
            <span className="text-blue-600">${order.summary.total.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="pt-4 flex justify-center gap-4">
        <Link to="/products" className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-blue-700">
          <FaShoppingBag /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}