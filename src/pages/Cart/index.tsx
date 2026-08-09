import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, summary, removeItem, setQuantity, applyPromo, promoCode } = useCart();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput) return;
    applyPromo(promoInput);
    if (promoInput.toUpperCase() === 'PROMO10') {
      toast.success('10% VIP Discount Applied!');
    } else {
      toast.error('Invalid promo code');
    }
    setPromoInput('');
  };

  if (items.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center space-y-4 my-12 max-w-lg mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mx-auto">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">Explore our tech catalog to add items to your shopping cart.</p>
        <Link
          to="/products"
          className="inline-block rounded-xl bg-primary-gradient px-6 py-3 text-xs font-bold text-white shadow-soft-xs hover:opacity-95 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shopping Cart</h1>
        <p className="text-xs text-slate-500 mt-1">Review your items before proceeding to checkout</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
        
        {/* Cart Itemized Table */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const unitPrice = item.product.discountPrice ?? item.product.price;
            return (
              <div
                key={item.product.id}
                className="glass-panel flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-4 shadow-soft-xs"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.product.thumbnail}
                    alt=""
                    className="h-20 w-20 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-blue-600">{item.product.brand}</span>
                    <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.title}</h3>
                    <p className="text-xs font-black text-slate-900">${unitPrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center rounded-xl border border-slate-200/80 bg-white shadow-soft-xs">
                    <button
                      onClick={() => setQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="p-2 text-slate-500 hover:text-slate-800"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 text-slate-500 hover:text-slate-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-sm font-black text-slate-900 min-w-[70px] text-right">
                    ${(unitPrice * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Promo Block */}
        <div className="glass-panel rounded-3xl p-6 shadow-soft-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b pb-3">Order Summary</h2>

          {/* Promo Form */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-blue-600" /> Apply Promo Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try PROMO10"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-bold uppercase focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition"
              >
                Apply
              </button>
            </div>
            {promoCode && (
              <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 pt-1">
                <CheckCircle2 className="h-3 w-3" /> Code '{promoCode}' active
              </p>
            )}
          </form>

          {/* Cost breakdown */}
          <div className="space-y-2 text-xs border-t pt-4">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">${summary.subtotal.toFixed(2)}</span>
            </div>
            {summary.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>VIP Discount</span>
                <span>-${summary.discountTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Estimated Tax (8%)</span>
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

          <button
            onClick={() => navigate('/checkout')}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary-gradient py-3.5 text-xs font-bold text-white shadow-soft-xs hover:opacity-95 transition"
          >
            Proceed to Checkout <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Encrypted 256-Bit SSL Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
}