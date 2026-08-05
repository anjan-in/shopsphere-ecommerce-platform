// import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { FaTimes, FaTrash, FaShoppingBag, FaArrowRight } from 'react-icons/fa';

export default function CartDrawer() {
  const { items, isOpen, summary, toggleDrawer, removeItem, setQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
        onClick={() => toggleDrawer(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div className="flex items-center gap-2">
              <FaShoppingBag className="text-blue-600 h-5 w-5" />
              <h2 className="text-lg font-bold text-slate-900">Your Shopping Cart</h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-600">
                {summary.itemCount}
              </span>
            </div>
            <button 
              onClick={() => toggleDrawer(false)}
              className="rounded-lg p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <FaShoppingBag className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800">Your cart is empty</p>
                  <p className="text-xs text-slate-500 mt-1">Looks like you haven't added anything yet.</p>
                </div>
                <button
                  onClick={() => toggleDrawer(false)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => {
                const price = product.discountPrice ?? product.price;
                return (
                  <div key={product.id} className="flex gap-4 p-3 border rounded-xl bg-slate-50/50">
                    <img 
                      src={product.thumbnail} 
                      alt={product.title} 
                      className="h-20 w-20 rounded-lg object-cover bg-slate-100 shrink-0" 
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{product.title}</h4>
                        <button 
                          onClick={() => removeItem(product.id)}
                          className="text-slate-400 hover:text-red-500 transition"
                        >
                          <FaTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center rounded-lg border bg-white shadow-2xs">
                          <button
                            onClick={() => setQuantity(product.id, quantity - 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-l-lg"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800">{quantity}</span>
                          <button
                            onClick={() => setQuantity(product.id, quantity + 1)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-slate-900">₹{(price * quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {items.length > 0 && (
            <div className="border-t p-6 bg-slate-50 space-y-4">
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₹{summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-slate-800">₹{summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-800">
                    {summary.shipping === 0 ? 'FREE' : `₹${summary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t text-sm font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-blue-600">₹{summary.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/cart"
                  onClick={() => toggleDrawer(false)}
                  className="flex items-center justify-center rounded-xl border bg-white py-2.5 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-100 transition"
                >
                  View Full Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => toggleDrawer(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition"
                >
                  Checkout <FaArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}