import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { 
  ShoppingBag, 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  Sparkles 
} from 'lucide-react';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { items, isOpen, summary, toggleDrawer, removeItem, setQuantity } = useCart();

  const FREE_SHIPPING_THRESHOLD = 100;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - summary.subtotal);
  const shippingProgress = Math.min(100, (summary.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => toggleDrawer(false)}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-screen max-w-md bg-white/95 backdrop-blur-xl shadow-soft-lg flex flex-col justify-between border-l border-slate-200/80"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                <h2 className="text-base font-extrabold text-slate-900">Your Cart</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                  {summary.itemCount}
                </span>
              </div>
              <button
                onClick={() => toggleDrawer(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dynamic Free Shipping Progress Bar Widget */}
            <div className="bg-slate-50 p-4 border-b border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Truck className="h-4 w-4 text-blue-600" />
                  {amountToFreeShipping > 0 ? (
                    <span>Add <strong className="text-blue-600">${amountToFreeShipping.toFixed(2)}</strong> for FREE Express Shipping</span>
                  ) : (
                    <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" /> You unlocked FREE Express Shipping!
                    </span>
                  )}
                </div>
                <span className="text-slate-400 text-[10px]">{Math.round(shippingProgress)}%</span>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-200/80 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    shippingProgress >= 100 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : 'bg-primary-gradient'
                  }`}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center space-y-3 py-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">Your cart is empty</p>
                  <p className="text-xs text-slate-400 max-w-xs">Looks like you haven't added any tech gear yet.</p>
                  <button
                    onClick={() => {
                      toggleDrawer(false);
                      navigate('/products');
                    }}
                    className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition shadow-soft-xs"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const unitPrice = item.product.discountPrice ?? item.product.price;
                  return (
                    <div
                      key={item.product.id}
                      className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-soft-xs"
                    >
                      <img
                        src={item.product.thumbnail}
                        alt=""
                        className="h-20 w-20 rounded-xl object-cover bg-slate-100 shrink-0"
                      />

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase text-blue-600">
                              {item.product.brand}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {item.product.title}
                            </h4>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-slate-400 hover:text-red-500 transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <span className="text-xs font-black text-slate-900">
                            ${(unitPrice * item.quantity).toFixed(2)}
                          </span>

                          <div className="flex items-center rounded-lg border border-slate-200/80 bg-slate-50">
                            <button
                              onClick={() => setQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="p-1 text-slate-500 hover:text-slate-800"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-[11px] font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-slate-500 hover:text-slate-800"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {items.length > 0 && (
              <div className="border-t border-slate-200/80 bg-slate-50/80 p-5 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800">${summary.subtotal.toFixed(2)}</span>
                  </div>
                  {summary.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount</span>
                      <span>-${summary.discountTotal.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Tax</span>
                    <span className="font-bold text-slate-800">${summary.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-800">
                      {summary.shipping === 0 ? 'FREE' : `$${summary.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-black text-slate-900">
                    <span>Total Due</span>
                    <span>${summary.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    to="/cart"
                    onClick={() => toggleDrawer(false)}
                    className="flex-1 rounded-xl border border-slate-200/80 bg-white py-3 text-center text-xs font-bold text-slate-700 shadow-soft-xs hover:bg-slate-100 transition"
                  >
                    View Cart
                  </Link>
                  <button
                    onClick={() => {
                      toggleDrawer(false);
                      navigate('/checkout');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary-gradient py-3 text-xs font-bold text-white shadow-soft-xs hover:opacity-95 transition"
                  >
                    Checkout <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}