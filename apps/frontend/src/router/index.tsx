import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout'
import RootLayoutAdmin from '../layouts/RootLayoutAdmin'
import Dashboard from '../pages/admin/Dashboard'
import AuthPage from '../pages/client/AuthPage'
import { HomePage } from '../pages/client/HomePage'
import PaymentPage from '../pages/client/Payment/PaymentPage'
import ProductDetailPage from '../pages/client/Product/ProductDetailPage'
import ProductPage from '../pages/client/Product/ProductPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/products',
        element: <ProductPage />,
      },
      {
        path: '/products/:id',
        element: <ProductDetailPage />,
      },
      {
        path: '/payment',
        element: <PaymentPage />,
      },
      {
        path: '/support',
        element: <></>,
      },
      {
        path: '/auth',
        element: <AuthPage />,
      },
      {
        path: '/cart',
        element: <></>,
      },
    ],
  },
  {
    path: '/admin',
    element: <RootLayoutAdmin />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'category',
        element: <Dashboard />,
      },
      {
        path: 'material',
        element: <Dashboard />,
      },
      {
        path: 'order',
        element: <Dashboard />,
      },
      {
        path: 'user',
        element: <Dashboard />,
      },
      {
        path: 'document',
        element: <Dashboard />,
      },
      {
        path: 'analyst',
        element: <Dashboard />,
      },
    ],
  },
])
