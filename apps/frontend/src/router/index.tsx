import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout'
import AuthPage from '../pages/client/AuthPage'
import { HomePage } from '../pages/client/HomePage'
import ProductDetailPage from '../pages/client/Product/ProductDetailPage'
import ProductPage from '../pages/client/Product/ProductPage'

export const router = createBrowserRouter([
  {
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
        path: '/remedies',
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
])
