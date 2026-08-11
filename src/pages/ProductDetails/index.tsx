import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/productService';
import type { Product } from '../../types/product.types';
import { useCart } from '../../hooks/useCart';
import toast from 'react-hot-toast';
import ProductReviews from '../../components/review/ProductReviews';
import { 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  ChevronRight, 
  Minus, 
  Plus, 
  Heart, 
  Share2,
  Sparkles
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error('Failed to load product details:', err);
        toast.error('Unable to load product details');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 animate-pulse">
        <div className="h-4 w-48 rounded bg-slate-200/70" />
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-square w-full rounded-3xl bg-slate-200/70" />
          <div className="space-y-4">
            <div className="h-4 w-24 rounded bg-slate-200/70" />
            <div className="h-8 w-3/4 rounded bg-slate-200/70" />
            <div className="h-6 w-32 rounded bg-slate-200/70" />
            <div className="h-24 w-full rounded bg-slate-200/70" />
            <div className="h-12 w-full rounded bg-slate-200/70" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center space-y-4 my-12">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-400">The requested item might have been removed or does not exist.</p>
        <Link to="/products" className="inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-soft-xs hover:bg-blue-700 transition">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.thumbnail];
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`Added ${quantity} ${product.title} to your cart!`);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist');
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-slate-700 transition">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/products" className="hover:text-slate-700 transition">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
        
        {/* Left Column: Interactive Image Gallery */}
        <div className="space-y-4 lg:sticky lg:top-24">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-soft-md">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={images[selectedImageIndex]}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>

            {/* Discount Badge */}
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 rounded-xl bg-red-600 px-3 py-1 text-xs font-black text-white shadow-soft-xs">
                -{discountPercent}% OFF
              </span>
            )}

            {/* Wishlist & Share Quick Action Buttons */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={toggleWishlist}
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 p-2.5 shadow-soft-xs backdrop-blur-md transition ${
                  isWishlisted ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                }`}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard!');
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 p-2.5 text-slate-600 shadow-soft-xs backdrop-blur-md hover:text-blue-600 transition"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails Strip */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-blue-600 shadow-soft-xs scale-105'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Metadata & Order Control */}
        <div className="space-y-6">
          
          {/* Brand & Stock Status Bar */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">
              {product.brand}
            </span>

            {/* Pulsing Urgency Stock Dot */}
            <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700 border border-emerald-200/60">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>In Stock ({product.stock || 15} available)</span>
            </div>
          </div>

          {/* Title & Rating */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="ml-1 text-slate-800 font-extrabold">{product.rating || '4.8'}</span>
              </div>
              <span className="text-xs font-semibold text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500 hover:underline cursor-pointer">
                {product.totalReviews || 24} Customer Reviews
              </span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="flex items-baseline gap-3 rounded-2xl bg-slate-100/60 p-4">
            <span className="text-3xl font-black text-slate-900">
              ${product.discountPrice ?? product.price}
            </span>
            {product.discountPrice && (
              <span className="text-base font-semibold text-slate-400 line-through">
                ${product.price}
              </span>
            )}
            {product.discountPrice && discountPercent > 0 && (
              <span className="ml-auto text-xs font-extrabold text-emerald-600 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                Save ${(product.price - product.discountPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-600 leading-relaxed">
            {product.description || 'Premium build quality designed for maximum efficiency and durability.'}
          </p>

          <hr className="border-slate-200/80" />

          {/* Quantity Selector & Action CTA Buttons */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center rounded-xl border border-slate-200/80 bg-white shadow-soft-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-slate-500 hover:text-slate-800 transition"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-extrabold text-slate-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 text-slate-500 hover:text-slate-800 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-soft-xs hover:bg-blue-600 transition"
              >
                <ShoppingBag className="h-4 w-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary-gradient py-3.5 text-xs font-bold text-white shadow-soft-xs hover:opacity-95 transition"
              >
                <Sparkles className="h-4 w-4" /> Buy Now
              </button>
            </div>
          </div>

          {/* Value Prop Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 text-[11px] font-semibold text-slate-600">
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 text-center border border-slate-200/80 shadow-soft-xs">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 text-center border border-slate-200/80 shadow-soft-xs">
              <RotateCcw className="h-4 w-4 text-emerald-600" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-3 text-center border border-slate-200/80 shadow-soft-xs">
              <ShieldCheck className="h-4 w-4 text-purple-600" />
              <span>2-Yr Warranty</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Glassmorphism Tabbed Architecture */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 shadow-soft-xs space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-200/80 gap-6 overflow-x-auto">
          {[
            { id: 'description', label: 'Description' },
            { id: 'specs', label: 'Specifications' },
            { id: 'shipping', label: 'Shipping & Returns' },
            { id: 'reviews', label: `Reviews (${product.totalReviews || 24})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-bold transition border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="text-xs text-slate-600 leading-relaxed pt-2">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <p>Built using industry-standard engineering materials to ensure long-term reliability and exceptional performance under daily operation.</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="overflow-hidden rounded-2xl border border-slate-200/80">
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-700 w-1/3">Brand</td>
                    <td className="p-3 font-medium text-slate-600">{product.brand}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Category</td>
                    <td className="p-3 font-medium text-slate-600 capitalize">{product.categoryId || 'Electronics'}</td>
                  </tr>
                  <tr className="bg-slate-50/50">
                    <td className="p-3 font-bold text-slate-700">Stock Availability</td>
                    <td className="p-3 font-medium text-slate-600">{product.stock || 15} Units</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Warranty</td>
                    <td className="p-3 font-medium text-slate-600">2-Year Official Manufacturer Warranty</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800">Express Delivery Policy</h4>
              <p>All orders placed before 2 PM EST ship same-day. Orders over $100 automatically qualify for free 2-day express shipping across all supported regions.</p>
              <h4 className="font-bold text-slate-800 pt-2">30-Day Hassle-Free Returns</h4>
              <p>If you're not satisfied with your purchase, return it within 30 days in its original packaging for a full refund or exchange.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <>
            <ProductReviews
              productId={product.id}
              fallbackRating={product.rating}
              fallbackTotalReviews={product.totalReviews}
            />
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">Customer Reviews</h4>
                  <p className="text-[11px] text-slate-400">Verified purchases from real buyers</p>
                </div>
                <button 
                  onClick={() => toast.success('Review submission modal available in Phase 9!')} 
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  Write a Review
                </button>
              </div>

              {/* Sample Review Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-white/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-800">Alex M.</span>
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-700">
                      Verified Buyer
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">2 days ago</span>
                </div>
                <p className="text-xs text-slate-600">
                  Exceptional quality! The product arrived sooner than expected and matches the description perfectly.
                </p>
              </div>
            </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}