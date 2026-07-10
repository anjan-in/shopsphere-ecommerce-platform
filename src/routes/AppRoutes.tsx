import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Import your page components here...
import HomePage from '../pages/Home';
import ProductsPage from '../pages/Products';
import Login from '../pages/Login';

const router = createBrowserRouter([
  // Public & Authenticated Client Routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '', element: <HomePage /> },
      { 
        path: 'products', 
        element: <ProductsPage /> 
      },
      // { path: 'product/:id', element: <ProductDetails /> },
      // { path: 'cart', element: <Cart /> },
    ],
  },
  // Auth Layout Routes
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
    ],
  },
  // Admin Layout Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      // { path: '', element: <AdminAnalytics /> },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}