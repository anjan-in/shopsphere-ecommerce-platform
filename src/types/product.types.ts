export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  brand: string;
  categoryId: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  thumbnail: string;
  rating: number;
  totalReviews: number;
  featured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  rating?: number;
}

export type ProductSortOption = 'price-low-high' | 'price-high-low' | 'newest' | 'rating';

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  searchQuery: string;
  sortOption: ProductSortOption;
}