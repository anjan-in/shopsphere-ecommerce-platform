import { db } from '../firebase/firebaseConfig';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
} from 'firebase/firestore';
import type { Product, Category, ProductFilters, ProductSortOption } from '../types/product.types';

export const productService = {
  // 1. Fetch All Products safely from Firestore
  async getProducts(filters?: ProductFilters, sort?: ProductSortOption, search?: string): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, 'products'));
    
    let results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    // Filter inactive products only if explicitly set to false
    results = results.filter((p) => p.isActive !== false);

    // Filter by Category
    if (filters?.category && filters.category !== 'all') {
      results = results.filter((p) => p.categoryId?.toLowerCase() === filters.category?.toLowerCase());
    }

    // Filter by Brand
    if (filters?.brand && filters.brand !== 'all') {
      results = results.filter((p) => p.brand?.toLowerCase() === filters.brand?.toLowerCase());
    }

    // Search filter (Safely handle missing titles or descriptions)
    if (search && search.trim() !== '') {
      const searchLower = search.toLowerCase();
      results = results.filter((p) => {
        const title = p.title?.toLowerCase() || '';
        const brand = p.brand?.toLowerCase() || '';
        const desc = p.description?.toLowerCase() || '';
        return title.includes(searchLower) || brand.includes(searchLower) || desc.includes(searchLower);
      });
    }

    // Sorting Logic
    if (sort) {
      switch (sort) {
        case 'price-low-high':
          results.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
          break;
        case 'price-high-low':
          results.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
          break;
        case 'rating':
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'newest':
        default:
          results.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
          break;
      }
    }

    return results;
  },

  // 2. Fetch Single Product
  async getProductById(productId: string): Promise<Product | null> {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : null;
  },

  // 3. Fetch Featured Products for Homepage
  async getFeaturedProducts(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const all = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
    return all.filter((p) => p.featured && p.isActive !== false).slice(0, 8);
  },

  // 4. Fetch Categories
  async getCategories(): Promise<Category[]> {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
  }
};