import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { selectedProduct, loading, loadProductDetails } = useProducts();
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (id) {
      loadProductDetails(id);
    }
  }, [id, loadProductDetails]);

  useEffect(() => {
    if (selectedProduct) {
      setActiveImage(selectedProduct.thumbnail);
    }
  }, [selectedProduct]);

  if (loading) return <div className="p-12 text-center text-sm font-medium">Loading Product Metrics...</div>;
  if (!selectedProduct) return <div className="p-12 text-center text-slate-400">Product profile not found.</div>;

  const hasDiscount = selectedProduct.discountPrice && selectedProduct.discountPrice < selectedProduct.price;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        
        {/* Gallery Interface System */}
        <div className="flex flex-col-reverse gap-4 md:flex-row">
          <div className="flex flex-row gap-2 overflow-x-auto md:flex-col md:overflow-x-visible shrink-0">
            {selectedProduct.images?.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`h-20 w-20 overflow-hidden rounded-lg border bg-slate-50 transition-all ${
                  activeImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="aspect-square w-full overflow-hidden rounded-xl border bg-slate-50">
            <img src={activeImage} alt={selectedProduct.title} className="h-full w-full object-cover" />
          </div>
        </div>

        {/* Product Information Column */}
        <div className="flex flex-col space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{selectedProduct.brand}</span>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{selectedProduct.title}</h1>
            
            <div className="mt-3 flex items-center gap-2">
              <div className="flex text-sm text-amber-400">{'★'.repeat(Math.round(selectedProduct.rating))}</div>
              <span className="text-xs font-medium text-slate-500">({selectedProduct.totalReviews} customer reviews)</span>
            </div>
          </div>

          <div className="border-t border-b py-4 flex items-baseline gap-3">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-black text-slate-900">${selectedProduct.discountPrice}</span>
                <span className="text-base text-slate-400 line-through">${selectedProduct.price}</span>
              </>
            ) : (
              <span className="text-3xl font-black text-slate-900">${selectedProduct.price}</span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{selectedProduct.description}</p>

          {/* Sticky Purchase Card Mock Actions */}
          <div className="rounded-xl border bg-slate-50 p-4 space-y-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500">
              <span>Availability Status</span>
              <span className={selectedProduct.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
                {selectedProduct.stock > 0 ? `In Stock (${selectedProduct.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => toast.success('Added to basket!')}
                disabled={selectedProduct.stock === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400"
              >
                <FaShoppingCart /> Add To Cart
              </button>
              
              <button
                onClick={() => toast.success('Added to Wishlist')}
                className="flex items-center justify-center rounded-lg border bg-white px-4 py-3 text-slate-600 transition hover:bg-slate-50 hover:text-red-500"
              >
                <FaHeart />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <section className="mt-16 border-t pt-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Customer Feedback Reviews</h2>
        <div className="rounded-xl border p-6 text-center text-sm text-slate-400 bg-white">
          No feedback entries verified yet for this SKU stock selection block.
        </div>
      </section>
    </div>
  );
}