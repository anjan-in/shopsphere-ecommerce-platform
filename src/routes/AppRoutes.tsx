import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
// import AdminLayout from '../layouts/AdminLayout';

// Core Page Imports
import HomePage from '../pages/Home/index';
import ProductsPage from '../pages/Products/index';
import ProductDetailsPage from '../pages/ProductDetails/index';
import Login from '../pages/Login';

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