import { useState, useEffect } from 'react';
import { reviewService } from '../../services/reviewService';
import type { Review } from '../../types/review.types';
import WriteReviewModal from './WriteReviewModal';
import { Star, CheckCircle2, MessageSquare } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  fallbackRating?: number;
  fallbackTotalReviews?: number;
}

export default function ProductReviews({
  productId,
  fallbackRating = 4.8,
  fallbackTotalReviews = 0,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error('Failed to load product reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const { breakdown, average } = reviewService.calculateBreakdown(reviews);
  const totalCount = reviews.length > 0 ? reviews.length : fallbackTotalReviews;
  const displayAverage = reviews.length > 0 ? average : fallbackRating;

  return (
    <div className="space-y-8">
      
      {/* Header & Rating Breakdown Summary Card */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-center rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6">
        
        {/* Left: Overall Score */}
        <div className="text-center space-y-2 border-b md:border-b-0 md:border-r border-slate-200/80 pb-4 md:pb-0 md:pr-6">
          <span className="text-4xl font-black text-slate-900">{displayAverage.toFixed(1)}</span>
          <div className="flex justify-center text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.round(displayAverage) ? 'fill-amber-400' : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] font-semibold text-slate-500">
            Based on {totalCount} verified review{totalCount === 1 ? '' : 's'}
          </p>
        </div>

        {/* Center: Rating Distribution Bars */}
        <div className="space-y-1.5 md:col-span-1 text-[11px] font-medium text-slate-600">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star as keyof typeof breakdown] || 0;
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-3 font-bold text-slate-700">{star}</span>
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <div className="h-2 flex-1 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Right: CTA Button */}
        <div className="text-center space-y-2 md:pl-6 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0">
          <h4 className="text-xs font-extrabold text-slate-900">Have you used this product?</h4>
          <p className="text-[11px] text-slate-400">Share your thoughts with other tech enthusiasts</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-soft-xs hover:bg-blue-600 transition"
          >
            Write a Review
          </button>
        </div>

      </div>

      {/* Reviews List Display */}
      {loading ? (
        <div className="space-y-3 py-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-24 rounded-2xl bg-slate-200/60 animate-pulse" />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 space-y-3 shadow-soft-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-extrabold text-blue-600 text-xs uppercase">
                    {rev.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-slate-900">{rev.userName}</h5>
                      {rev.verifiedPurchase && (
                        <span className="flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black text-emerald-700 border border-emerald-200/60">
                          <CheckCircle2 className="h-2.5 w-2.5" /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < rev.rating ? 'fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h6 className="text-xs font-extrabold text-slate-800">{rev.title}</h6>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center space-y-2">
          <MessageSquare className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-700">No reviews yet</p>
          <p className="text-[11px] text-slate-400">Be the first customer to review this product!</p>
        </div>
      )}

      {/* Write Review Modal */}
      <WriteReviewModal
        productId={productId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReviewSubmitted={fetchReviews}
      />
    </div>
  );
}