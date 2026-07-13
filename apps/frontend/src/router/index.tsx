import { createBrowserRouter } from 'react-router'
import RootLayout from '../layouts/RootLayout'
import RootLayoutAdmin from '../layouts/RootLayoutAdmin'
import Dashboard from '../pages/admin/Dashboard'
import AuthPage from '../pages/client/AuthPage'
import { HomePage } from '../pages/client/HomePage'
import PaymentPage from '../pages/client/Payment/PaymentPage'
import ProductDetailPage from '../pages/client/Product/ProductDetailPage'
import ProductPage from '../pages/client/Product/ProductPage'
import MaterialList from '../pages/admin/material/MaterialList'
import MaterialCreate from '../pages/admin/material/MaterialCreate'
import CategoryList from '../pages/admin/category/CategoryList'
import CategoryCreate from '../pages/admin/category/CategoryCreate'
import ProductList from '../pages/admin/product/ProductList'
import ProductCreate from '../pages/admin/product/ProductCreate'
import OrderList from '../pages/admin/order/OrderList'
import UserList from '../pages/admin/user/UserList'
import DocumentList from '../pages/admin/document/DocumentList'
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
        path: 'product',
        element: <ProductList />,
      },
      {
        path: 'product/create',
        element: <ProductCreate />,
      },
      {
        path: 'category',
        element: <CategoryList />,
      },
      {
        path: 'category/create',
        element: <CategoryCreate />,
      },
      {
        path: 'material',
        element: <MaterialList />,
      },
      {
        path: 'material/create',
        element: <MaterialCreate />,
      },
      {
        path: 'order',
        element: <OrderList />,
      },
      {
        path: 'user',
        element: <UserList />,
      },
      {
        path: 'document',
        element: <DocumentList />,
      },
      {
        path: 'analyst',
        element: <Dashboard />,
      },
    ],
  },
])
