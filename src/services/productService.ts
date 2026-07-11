import { db } from '../firebase/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  limit, 
  orderBy, 
  getDocs, 
  startAfter,
  QueryDocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import type { Product, ProductFilters, ProductSortOption } from '../types/product.types';

export const productService = {
  async getPaginatedProducts(
    filters: ProductFilters, 
    sort: ProductSortOption, 
    lastDoc: QueryDocumentSnapshot | null, 
    pageSize: number = 12
  ) {
    const productsRef = collection(db, 'products');
    const constraints: QueryConstraint[] = [where('isActive', '==', true)];

    // Apply Active Multi-Filters Together
    if (filters.category) constraints.push(where('categoryId', '==', filters.category));
    if (filters.brand) constraints.push(where('brand', '==', filters.brand));
    if (filters.rating) constraints.push(where('rating', '>=', filters.rating));

    // Handle Sorting Configurations
    if (sort === 'price-low-high') constraints.push(orderBy('price', 'asc'));
    else if (sort === 'price-high-low') constraints.push(orderBy('price', 'desc'));
    else if (sort === 'rating') constraints.push(orderBy('rating', 'desc'));
    else constraints.push(orderBy('createdAt', 'desc')); // Newest

    // Apply Pagination Cursors Safely
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    constraints.push(limit(pageSize));

    const q = query(productsRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    const products = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Product));

    return {
      products,
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null
    };
  }
};