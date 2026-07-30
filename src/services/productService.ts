import { db } from '../firebase/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  limit, 
  getDocs, 
  doc, 
  getDoc,
  startAfter,
  QueryDocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import type { Product, Category, ProductFilters, ProductSortOption } from '../types/product.types';

export const productService = {
  // 1. Fetch Products (with filtering, sorting & search)
  async getProducts(filters?: ProductFilters, sort?: ProductSortOption, search?: string): Promise<Product[]> {
    const productsRef = collection(db, 'products');
    const constraints: QueryConstraint[] = [where('isActive', '==', true)];

    if (filters?.category) {
      constraints.push(where('categoryId', '==', filters.category));
    }

    const q = query(productsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    // Handle search query filtering in-memory
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Use the `sort` parameter to sort items in-memory
    if (sort) {
      switch (sort) {
        case 'price-low-high':
          results.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
          break;
        case 'price-high-low':
          results.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
          break;
        case 'rating':
          results.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
        default:
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
      }
    }

    return results;
  },

  // 2. Fetch Single Product Details
  async getProductById(productId: string): Promise<Product | null> {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : null;
  },

  // 3. Fetch Featured Products for Homepage
  async getFeaturedProducts(): Promise<Product[]> {
    const q = query(
      collection(db, 'products'), 
      where('featured', '==', true), 
      where('isActive', '==', true), 
      limit(8)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  // 4. Fetch All Categories for Homepage & Filters
  async getCategories(): Promise<Category[]> {
    const q = query(collection(db, 'categories'), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  },

  // 5. Paginated Products Cursor Method
  async getPaginatedProducts(
    filters: ProductFilters, 
    sort: ProductSortOption, 
    lastDoc: QueryDocumentSnapshot | null, 
    pageSize: number = 12
  ) {
    const productsRef = collection(db, 'products');
    const constraints: QueryConstraint[] = [where('isActive', '==', true)];

    if (filters.category) constraints.push(where('categoryId', '==', filters.category));
    if (filters.brand) constraints.push(where('brand', '==', filters.brand));
    
    if (lastDoc) constraints.push(startAfter(lastDoc));
    constraints.push(limit(pageSize));

    const q = query(productsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    return {
      products,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null
    };
  }
};