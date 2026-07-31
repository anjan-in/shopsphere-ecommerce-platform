import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { FaTrash, FaArrowLeft, FaTag, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, summary, promoCode, removeItem, setQuantity, applyPromo, resetCart } = useCart();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    if (promoInput.toUpperCase() === 'PROMO10') {
      applyPromo('PROMO10');
      toast.success('Applied 10% discount!');
      setPromoInput('');
    } else {
      toast.error('Invalid promo code. Try "PROMO10"');
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl py-16 text-center space-y-4">
        <div className="mx-auto h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
          <FaTag className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Your Cart is Currently Empty</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Explore our store and find products you love. Add them to your cart and return here to complete your order.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-xs hover:bg-blue-700 transition"
        >
          <FaArrowLeft className="h-3.5 w-3.5" /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-extrabold text-slate-900">Shopping Cart</h1>
        <button
          onClick={resetCart}
          className="text-xs font-semibold text-red-500 hover:text-red-600 hover:underline"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        
        {/* Item Table Column */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => {
            const price = product.discountPrice ?? product.price;
            return (
              <div 
                key={product.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-2xs"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-20 w-20 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">${price.toFixed(2)} each</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-0 pt-3 sm:pt-0">
                  {/* Quantity adjustment */}
                  <div className="flex items-center rounded-lg border bg-slate-50">
                    <button
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-l-lg font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded-r-lg font-bold"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-base font-bold text-slate-900 min-w-[70px] text-right">
                    ${(price * quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-slate-400 hover:text-red-500 transition p-1"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="rounded-2xl border bg-white p-6 shadow-2xs space-y-6">
          <h2 className="text-base font-bold text-slate-900">Order Summary</h2>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input
              type="text"
              placeholder="Promo Code (PROMO10)"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs uppercase focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              Apply
            </button>
          </form>

          {promoCode && (
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
              <span>Promo applied: {promoCode}</span>
              <span>-10%</span>
            </div>
          )}

          {/* Breakdown List */}
          <div className="space-y-3 text-xs text-slate-600 border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal ({summary.itemCount} items)</span>
              <span className="font-semibold text-slate-900">${summary.subtotal.toFixed(2)}</span>
            </div>

            {summary.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-${summary.discountTotal.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Tax</span>
              <span className="font-semibold text-slate-900">${summary.tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-semibold text-slate-900">
                {summary.shipping === 0 ? 'FREE' : `$${summary.shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between border-t pt-3 text-base font-extrabold text-slate-900">
              <span>Total Amount</span>
              <span className="text-blue-600">${summary.total.toFixed(2)}</span>
            </div>
          </div>

          <Link
            to="/checkout"
            className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-xs hover:bg-blue-700 transition"
          >
            Proceed to Checkout
          </Link>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <FaShieldAlt className="h-3.5 w-3.5" />
            <span>Encrypted & Safe Checkout Guaranteed</span>
          </div>
        </div>

      </div>
    </div>
  );
}