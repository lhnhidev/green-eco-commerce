import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout'
import { HomePage } from '../pages/client/HomePage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
    ],
  },
])
