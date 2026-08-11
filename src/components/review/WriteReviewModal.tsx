import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';
import { Star, X, Sparkles } from 'lucide-react';

interface WriteReviewModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export default function WriteReviewModal({
  productId,
  isOpen,
  onClose,
  onReviewSubmitted,
}: WriteReviewModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error('Please sign in to submit a review');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast.error('Please fill in all review fields');
      return;
    }

    try {
      setSubmitting(true);
      await reviewService.addReview({
        productId,
        userId: user.uid,
        userName: user.fullName || 'Verified Customer',
        userAvatar: (user as any).avatarUrl,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
        verifiedPurchase: true,
      });

      toast.success('Thank you! Your review has been published.');
      onReviewSubmitted();
      onClose();

      // Reset form
      setTitle('');
      setComment('');
      setRating(5);
    } catch (err: any) {
      toast.error('Failed to submit review: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
        
        {/* Backdrop click */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft-lg"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-base font-extrabold text-slate-900">Write a Product Review</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            
            {/* Interactive Star Picker */}
            <div className="space-y-1.5 text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="font-bold text-slate-700">Overall Rating</label>
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const activeStar = hoverRating ? star <= hoverRating : star <= rating;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          activeStar ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] font-extrabold text-amber-600">
                {rating === 5 && 'Outstanding! Excellent product'}
                {rating === 4 && 'Good quality! Satisfied'}
                {rating === 3 && 'Average experience'}
                {rating === 2 && 'Below expectations'}
                {rating === 1 && 'Poor quality'}
              </p>
            </div>

            {/* Review Title */}
            <div>
              <label className="font-bold text-slate-700">Review Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g., Amazing sound quality and battery life!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white p-3 font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Written Review */}
            <div>
              <label className="font-bold text-slate-700">Detailed Feedback *</label>
              <textarea
                required
                rows={4}
                placeholder="Share what you liked or disliked about this item..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200/80 bg-white p-3 font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-primary-gradient py-3.5 text-xs font-bold text-white shadow-soft-xs hover:opacity-95 transition disabled:opacity-50"
              >
                {submitting ? 'Publishing Review...' : 'Submit Review'}
              </button>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}