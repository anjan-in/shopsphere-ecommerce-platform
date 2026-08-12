import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Core Page Imports
import HomePage from '../pages/Home/index';
import ProductsPage from '../pages/Products/index';
import ProductDetailsPage from '../pages/ProductDetails/index';
import CartPage from '../pages/Cart/index';
import CheckoutPage from '../pages/Checkout/index';
import OrderSuccessPage from '../pages/OrderSuccess/index';
import Login from '../pages/Login/index';
import ProfilePage from '../pages/Profile/index';
import OrderHistoryPage from '../pages/Orders/index';
import AdminDashboard from '../pages/Admin/Dashboard/index';
import ManageProductsPage from '../pages/Admin/ManageProducts/index';
import WishlistPage from '../pages/Wishlist';

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
      { 
        path: 'wishlist', 
        element: <WishlistPage /> 
      }
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: '', element: <AdminDashboard /> },
      { path: 'products', element: <ManageProductsPage /> },
    ],
  }
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}