import RootLayout from '@layouts/RootLayout'
import RootLayoutAdmin from '@layouts/RootLayoutAdmin'
import BannerList from '@pages/admin/banner/BannerList'
import CategoryCreate from '@pages/admin/category/CategoryCreate'
import CategoryList from '@pages/admin/category/CategoryList'
import CouponList from '@pages/admin/coupon/CouponList'
import Dashboard from '@pages/admin/Dashboard'
import DocumentList from '@pages/admin/document/DocumentList'
import MaterialCreate from '@pages/admin/material/MaterialCreate'
import MaterialList from '@pages/admin/material/MaterialList'
import OrderList from '@pages/admin/order/OrderList'
import ProductCreate from '@pages/admin/product/ProductCreate'
import ProductEdit from '@pages/admin/product/ProductEdit'
import ProductList from '@pages/admin/product/ProductList'
import ReviewList from '@pages/admin/review/ReviewList'
import UserList from '@pages/admin/user/UserList'
import AuthPage from '@pages/client/AuthPage'
import { HomePage } from '@pages/client/HomePage'
import MyOrdersPage from '@pages/client/Order/MyOrdersPage'
import PaymentPage from '@pages/client/Payment/PaymentPage'
import ProductDetailPage from '@pages/client/Product/ProductDetailPage'
import ProductPage from '@pages/client/Product/ProductPage'
import ProfilePage from '@pages/client/Profile/ProfilePage'
import GreenWalletPage from '@pages/client/Wallet/GreenWalletPage'
import { createBrowserRouter } from 'react-router'

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
      {
        path: '/my-orders',
        element: <MyOrdersPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/green-wallet',
        element: <GreenWalletPage />,
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
        path: 'product/:id/edit',
        element: <ProductEdit />,
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
        path: 'banner',
        element: <BannerList />,
      },
      {
        path: 'review',
        element: <ReviewList />,
      },
      {
        path: 'coupon',
        element: <CouponList />,
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
