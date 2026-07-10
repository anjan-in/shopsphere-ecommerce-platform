import { db } from '../firebase/firebaseConfig';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  limit, 
  orderBy,
  QueryConstraint
} from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';
import type { Product, Category, ProductFilters, ProductSortOption } from '../types/product.types';

export const productService = {
  // Fetch All Products with optional dynamic filtering
  async getProducts(filters?: ProductFilters, sort?: ProductSortOption, search?: string): Promise<Product[]> {
    const productsRef = collection(db, 'products');
    const constraints: QueryConstraint[] = [where('isActive', '==', true)];

    // Apply categorical constraint if supplied
    if (filters?.category) {
      constraints.push(where('categoryId', '==', filters.category));
    }
    
    // Apply featured flags if filtering defaults
    if (filters?.brand) {
      constraints.push(where('brand', '==', filters.brand));
    }

    // Apply sorting mechanisms
    if (sort === 'price-low-high') constraints.push(orderBy('price', 'asc'));
    else if (sort === 'price-high-low') constraints.push(orderBy('price', 'desc'));
    else if (sort === 'rating') constraints.push(orderBy('rating', 'desc'));
    else constraints.push(orderBy('createdAt', 'desc')); // Default fallback sort

    const q = query(productsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    let results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    // Client-side text parsing for search queries (Firestore requires special indexes for full-text searches)
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(p => 
        p.title.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    return results;
  },

  // Get single product detail profile
  async getProductById(productId: string): Promise<Product | null> {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : null;
  },

  // Fetch quick homepage hero components
  async getFeaturedProducts(): Promise<Product[]> {
    const q = query(collection(db, 'products'), where('featured', '==', true), where('isActive', '==', true), limit(8));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  // Pull down active classification items
  async getCategories(): Promise<Category[]> {
    const q = query(collection(db, 'categories'), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  }
};