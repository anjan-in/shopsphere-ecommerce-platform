import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';
import { Heart, Trash2, ShoppingBag, Sparkles } from 'lucide-react';

export default function WishlistPage() {
  const { wishlistItems, removeItem, resetWishlist } = useWishlist();
  const { addItem } = useCart();

  const handleMoveToCart = (product: any) => {
    addItem(product);
    removeItem(product.id);
    toast.success(`Moved ${product.title} to your cart!`);
  };

  const handleMoveAllToCart = () => {
    wishlistItems.forEach((p) => addItem(p));
    resetWishlist();
    toast.success('Moved all saved gear to your cart!');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center space-y-4 my-12 max-w-lg mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 mx-auto border border-red-100">
          <Heart className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-400">Save items you love by tapping the heart icon on any product card.</p>
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
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Saved Gear & Wishlist</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {wishlistItems.length} item{wishlistItems.length === 1 ? '' : 's'} saved for later
          </p>
        </div>

        <button
          onClick={handleMoveAllToCart}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-soft-xs hover:bg-blue-600 transition"
        >
          <Sparkles className="h-3.5 w-3.5" /> Move All to Cart
        </button>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {wishlistItems.map((product) => (
          <div
            key={product.id}
            className="glass-panel flex flex-col justify-between rounded-2xl p-4 shadow-soft-xs hover:shadow-soft-md transition duration-300 space-y-4"
          >
            <div className="space-y-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
                <img src={product.thumbnail} alt="" className="h-full w-full object-cover" />
                <button
                  onClick={() => removeItem(product.id)}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 p-2 text-slate-400 hover:text-red-500 shadow-soft-xs backdrop-blur-md transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase text-blue-600">{product.brand}</span>
                <Link to={`/product/${product.id}`} className="block">
                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1 hover:text-blue-600 transition">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-sm font-black text-slate-900 mt-1">
                  ${product.discountPrice ?? product.price}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleMoveToCart(product)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-gradient py-2.5 text-xs font-bold text-white shadow-soft-xs hover:opacity-95 transition"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Move to Cart
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}