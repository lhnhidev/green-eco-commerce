import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout'
import AuthPage from '../pages/client/AuthPage'
import { HomePage } from '../pages/client/HomePage'
import ProductPage from '../pages/client/ProductPage'

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
