import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ProductState, Product, Category, ProductFilters, ProductSortOption } from '../../types/product.types';

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  categories: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {},
  searchQuery: '',
  sortOption: 'newest',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.loading = false;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
    },
    fetchFeaturedSuccess: (state, action: PayloadAction<Product[]>) => {
      state.featuredProducts = action.payload;
      state.loading = false;
    },
    fetchProductByIdSuccess: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
      state.loading = false;
    },
    fetchFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSorting: (state, action: PayloadAction<ProductSortOption>) => {
      state.sortOption = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.searchQuery = '';
      state.sortOption = 'newest';
    }
  }
});

export const {
  fetchStart, fetchProductsSuccess, fetchCategoriesSuccess,
  fetchFeaturedSuccess, fetchProductByIdSuccess, fetchFailure,
  setSearchQuery, setFilters, setSorting, clearFilters
} = productSlice.actions;

export default productSlice.reducer;