import { db } from '../firebase/firebaseConfig';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import type { Review, RatingBreakdown } from '../types/review.types';

export const reviewService = {
  // 1. Fetch all reviews for a specific product
  async getProductReviews(productId: string): Promise<Review[]> {
    const q = query(
      collection(db, 'reviews'), 
      where('productId', '==', productId)
    );
    const querySnapshot = await getDocs(q);
    const reviews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];

    // Sort newest first
    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  // 2. Submit a new review and recalculate the product's average rating
  async addReview(reviewData: Omit<Review, 'id'>): Promise<string> {
    // Add review document
    const docRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: new Date().toISOString(),
    });

    // Fetch all reviews for this product to recalculate total and average rating
    const existingReviews = await this.getProductReviews(reviewData.productId);
    const totalCount = existingReviews.length;
    const sumRating = existingReviews.reduce((acc, r) => acc + r.rating, 0);
    const newAverage = Number((sumRating / totalCount).toFixed(1));

    // Update parent product document in Firestore
    const productRef = doc(db, 'products', reviewData.productId);
    await updateDoc(productRef, {
      rating: newAverage,
      totalReviews: totalCount,
    });

    return docRef.id;
  },

  // 3. Helper to calculate star distribution breakdown percentages
  calculateBreakdown(reviews: Review[]): { breakdown: RatingBreakdown; average: number } {
    const breakdown: RatingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews.length === 0) return { breakdown, average: 0 };

    let totalRatingSum = 0;
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      breakdown[star] = (breakdown[star] || 0) + 1;
      totalRatingSum += r.rating;
    });

    return {
      breakdown,
      average: Number((totalRatingSum / reviews.length).toFixed(1)),
    };
  },
};