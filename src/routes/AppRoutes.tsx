import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
// import AdminLayout from '../layouts/AdminLayout';

// Core Page Imports
import HomePage from '../pages/Home/index';
import ProductsPage from '../pages/Products/index';
import ProductDetailsPage from '../pages/ProductDetails/index';
import CartPage from '../pages/Cart/index';
import CheckoutPage from '../pages/Checkout/index';
import OrderSuccessPage from '../pages/OrderSuccess/index';
import Login from '../pages/Login';
import ProtectedRoute from './ProtectedRoute';
import ProfilePage from '../pages/Profile/index';
import OrderHistoryPage from '../pages/Orders/index';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { 
        path: '', 
        element: <HomePage />
      },
      { 
        path: 'products', 
        element: <ProductsPage /> 
      },
      { 
        path: 'product/:id', 
        element: <ProductDetailsPage /> 
      },
      { 
        path: 'cart', 
        element: <CartPage /> 
      },
      { 
        path: 'checkout', 
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'order-success/:id', 
        element: <OrderSuccessPage /> 
      },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'orders', 
        element: (
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        ) 
      },
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}