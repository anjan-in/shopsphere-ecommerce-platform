import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import type { ShippingAddress, PaymentMethod } from '../../types/order.types';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, summary, resetCart } = useCart();

  // Extract `user` directly from your useAuth hook
  const { user } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || '', // ✅ Cleanly accesses user.fullName
    email: user?.email || '',       // ✅ Cleanly accesses user.email
    phone: user?.phone || '',       // ✅ Cleanly accesses user.phone if present
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.streetAddress || !address.city || !address.zipCode || !address.phone) {
      toast.error('Please fill in all required shipping fields');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const newOrder = {
        userId: user?.uid || 'guest-user',
        items,
        summary,
        shippingAddress: address,
        paymentMethod,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
      };

      const orderId = await orderService.createOrder(newOrder);
      resetCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${orderId}`);
    } catch (err: any) {
      toast.error('Failed to place order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">No items to checkout</h2>
        <button onClick={() => navigate('/products')} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Checkout Progress Stepper */}
      <div className="flex items-center justify-center gap-8 border-b pb-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs">1</span>
          <span className="text-sm">Shipping Address</span>
        </div>
        <span className="text-slate-300">—</span>
        <div className={`flex items-center gap-2 ${step === 2 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs">2</span>
          <span className="text-sm">Payment & Place Order</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Form Steps */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-2xs">
          {step === 1 ? (
            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Shipping Details</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="mt-1 w-full rounded-lg border p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="mt-1 w-full rounded-lg border p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 555-0199"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="mt-1 w-full rounded-lg border p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="123 Main St, Apt 4B"
                    value={address.streetAddress}
                    onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                    className="mt-1 w-full rounded-lg border p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="mt-1 w-full rounded-lg border p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="mt-1 w-full rounded-lg border p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">ZIP Code *</label>
                  <input
                    type="text"
                    required
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="mt-1 w-full rounded-lg border p-2.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition"
              >
                Continue to Payment →
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900">Select Payment Method</h2>

              <div className="space-y-3">
                <label className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-blue-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Cash on Delivery (COD)</p>
                      <p className="text-xs text-slate-500">Pay cash upon delivery at your doorstep.</p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-blue-600"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Credit / Debit Card</p>
                      <p className="text-xs text-slate-500">Simulated test payment gateway.</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 disabled:bg-slate-300 transition"
                >
                  {loading ? 'Processing Order...' : `Place Order ($${summary.total.toFixed(2)})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mini Order Summary */}
        <div className="rounded-2xl border bg-white p-6 shadow-2xs space-y-4 h-fit">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-3">Order Items ({summary.itemCount})</h3>
          
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between items-center text-xs">
                <span className="line-clamp-1 flex-1 font-medium">{product.title} (x{quantity})</span>
                <span className="font-bold text-slate-800 ml-2">
                  ${((product.discountPrice ?? product.price) * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">${summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold">{summary.shipping === 0 ? 'FREE' : `$${summary.shipping}`}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t pt-2">
              <span>Total</span>
              <span className="text-blue-600">${summary.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}