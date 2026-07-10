import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { productService } from '../services/productService';
import { 
  fetchStart, fetchProductsSuccess, fetchCategoriesSuccess, 
  fetchFeaturedSuccess, fetchProductByIdSuccess, fetchFailure 
} from '../redux/slices/productSlice';
import type { RootState } from '../app/store';

export const useProducts = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.products);

  const loadCatalog = useCallback(async () => {
    dispatch(fetchStart());
    try {
      const data = await productService.getProducts(state.filters, state.sortOption, state.searchQuery);
      dispatch(fetchProductsSuccess(data));
    } catch (err: any) {
      dispatch(fetchFailure(err.message || 'Failed to fetch catalog products.'));
    }
  }, [dispatch, state.filters, state.sortOption, state.searchQuery]);

  const loadCategories = useCallback(async () => {
    dispatch(fetchStart());
    try {
      const data = await productService.getCategories();
      dispatch(fetchCategoriesSuccess(data));
    } catch (err: any) {
      dispatch(fetchFailure(err.message));
    }
  }, [dispatch]);

  const loadFeatured = useCallback(async () => {
    dispatch(fetchStart());
    try {
      const data = await productService.getFeaturedProducts();
      dispatch(fetchFeaturedSuccess(data));
    } catch (err: any) {
      dispatch(fetchFailure(err.message));
    }
  }, [dispatch]);

  const loadProductDetails = useCallback(async (id: string) => {
    dispatch(fetchStart());
    try {
      const data = await productService.getProductById(id);
      dispatch(fetchProductByIdSuccess(data));
    } catch (err: any) {
      dispatch(fetchFailure(err.message));
    }
  }, [dispatch]);

  return {
    ...state,
    loadCatalog,
    loadCategories,
    loadFeatured,
    loadProductDetails
  };
};