import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout'
import AuthPage from '../pages/client/AuthPage'
import { HomePage } from '../pages/client/HomePage'

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
        element: <></>,
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
