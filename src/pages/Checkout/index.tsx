import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import type { ShippingAddress } from '../../types/order.types';
import toast from 'react-hot-toast';
import { 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, summary, resetCart } = useCart();
  const { user } = useAuth();

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  // Match the ShippingAddress interface properties from order.types.ts
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');

  const handleCompleteOrder = async () => {
    if (!shippingAddress.streetAddress || !shippingAddress.city || !shippingAddress.zipCode || !shippingAddress.email) {
      toast.error('Please complete all required shipping fields');
      setActiveStep(1);
      return;
    }

    try {
      setSubmitting(true);
      // orderService returns orderId as string
      const orderId = await orderService.createOrder({
        userId: user?.uid || 'guest',
        items,
        summary,
        shippingAddress,
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      resetCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${orderId}`);
    } catch (err: any) {
      toast.error('Failed to place order: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center space-y-4 my-12 max-w-md mx-auto">
        <h2 className="text-xl font-bold text-slate-800">No Items to Checkout</h2>
        <p className="text-xs text-slate-400">Add items to your cart before entering checkout.</p>
        <button onClick={() => navigate('/products')} className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white">
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Checkout</h1>
        <p className="text-xs text-slate-500 mt-1">Complete your order details below</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Accordion Steps Column */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* STEP 1: Shipping Address Accordion */}
          <div className="glass-panel rounded-2xl border border-slate-200/80 overflow-hidden shadow-soft-xs">
            <button
              onClick={() => setActiveStep(1)}
              className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-800 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${
                  activeStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  1
                </span>
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Shipping Address</span>
              </div>
              {activeStep === 1 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {activeStep === 1 && (
              <div className="p-5 pt-0 space-y-4 border-t border-slate-100 text-xs">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-slate-600">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      className="mt-1 w-full rounded-xl border p-2.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                      className="mt-1 w-full rounded-xl border p-2.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-semibold text-slate-600">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="123 Innovation Way, Suite 400"
                      value={shippingAddress.streetAddress}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                      className="mt-1 w-full rounded-xl border p-2.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border p-2.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-600">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="mt-1 w-full rounded-xl border p-2.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600">State *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="mt-1 w-full rounded-xl border p-2.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600">Zip Code *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      className="mt-1 w-full rounded-xl border p-2.5 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 font-bold text-white hover:bg-blue-600 transition"
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: Payment Selection Accordion */}
          <div className="glass-panel rounded-2xl border border-slate-200/80 overflow-hidden shadow-soft-xs">
            <button
              onClick={() => setActiveStep(2)}
              className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-800 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${
                  activeStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  2
                </span>
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span>Payment Selection</span>
              </div>
              {activeStep === 2 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {activeStep === 2 && (
              <div className="p-5 pt-0 space-y-4 border-t border-slate-100 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${
                    paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200/80'
                  }`}>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span>Credit/Debit Card</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="accent-blue-600"
                    />
                  </label>

                  <label className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${
                    paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50 font-bold' : 'border-slate-200/80'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-emerald-600" />
                      <span>Cash on Delivery</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-blue-600"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep(3)}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 font-bold text-white hover:bg-blue-600 transition"
                >
                  Review Order Details
                </button>
              </div>
            )}
          </div>

          {/* STEP 3: Order Review Accordion */}
          <div className="glass-panel rounded-2xl border border-slate-200/80 overflow-hidden shadow-soft-xs">
            <button
              onClick={() => setActiveStep(3)}
              className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-800 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${
                  activeStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  3
                </span>
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span>Review & Submit</span>
              </div>
              {activeStep === 3 ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {activeStep === 3 && (
              <div className="p-5 pt-0 space-y-4 border-t border-slate-100 text-xs">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800">Order Items ({items.length})</h4>
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center justify-between py-1 border-b border-slate-100">
                      <span className="font-medium text-slate-700">{item.product.title} (x{item.quantity})</span>
                      <span className="font-bold text-slate-900">
                        ${((item.product.discountPrice ?? item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCompleteOrder}
                  disabled={submitting}
                  className="w-full rounded-2xl bg-primary-gradient py-3.5 text-xs font-bold text-white shadow-soft-xs hover:opacity-95 transition disabled:opacity-50"
                >
                  {submitting ? 'Processing Order...' : `Place Order ($${summary.total.toFixed(2)})`}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Sticky Order Summary */}
        <div className="glass-panel rounded-3xl p-6 shadow-soft-xs space-y-4 h-fit">
          <h3 className="text-base font-extrabold text-slate-900 border-b pb-3">Payment Summary</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">${summary.subtotal.toFixed(2)}</span>
            </div>
            {summary.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Discount</span>
                <span>-${summary.discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Tax (8%)</span>
              <span className="font-bold text-slate-800">${summary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span className="font-bold text-slate-800">
                {summary.shipping === 0 ? 'FREE' : `$${summary.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-900">
              <span>Total</span>
              <span>${summary.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-3 text-[11px] font-semibold text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Guaranteed 100% Encrypted Payment</span>
          </div>
        </div>

      </div>
    </div>
  );
}