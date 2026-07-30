import { RequireAuth } from '@components/features/auth/RequireAuth'
import RootLayout from '@layouts/RootLayout'
import RootLayoutAdmin from '@layouts/RootLayoutAdmin'
import AuthPage from '@pages/client/AuthPage'
import CartPage from '@pages/client/Cart/CartPage'
import CheckoutPage from '@pages/client/Checkout/CheckoutPage'
import ComparePage from '@pages/client/Compare/ComparePage'
import { HomePage } from '@pages/client/HomePage'
import MyOrdersPage from '@pages/client/Order/MyOrdersPage'
import OrderDetailPage from '@pages/client/Order/OrderDetailPage'
import OrderSuccessPage from '@pages/client/Order/OrderSuccessPage'
import PaymentPage from '@pages/client/Payment/PaymentPage'
import PaymentQrPage from '@pages/client/Payment/PaymentQrPage'
import ProductDetailPage from '@pages/client/Product/ProductDetailPage'
import ProductPage from '@pages/client/Product/ProductPage'
import ProfilePage from '@pages/client/Profile/ProfilePage'
import AboutPage from '@pages/client/static/AboutPage'
import ContactPage from '@pages/client/static/ContactPage'
import FaqPage from '@pages/client/static/FaqPage'
import PrivacyPage from '@pages/client/static/PrivacyPage'
import ReturnsPage from '@pages/client/static/ReturnsPage'
import ShippingPage from '@pages/client/static/ShippingPage'
import TermsPage from '@pages/client/static/TermsPage'
import GreenWalletPage from '@pages/client/Wallet/GreenWalletPage'
import WishlistPage from '@pages/client/Wishlist/WishlistPage'
import ErrorPage from '@pages/ErrorPage'
import NotFoundPage from '@pages/NotFoundPage'
import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router'

// Admin pages are lazy-loaded — they're a separate console the vast majority of
// storefront visitors never open, and shouldn't bloat the customer-facing bundle.
const Dashboard = lazy(() => import('@pages/admin/Dashboard'))
const ProductList = lazy(() => import('@pages/admin/product/ProductList'))
const ProductCreate = lazy(() => import('@pages/admin/product/ProductCreate'))
const ProductEdit = lazy(() => import('@pages/admin/product/ProductEdit'))
const CategoryList = lazy(() => import('@pages/admin/category/CategoryList'))
const MaterialList = lazy(() => import('@pages/admin/material/MaterialList'))
const OrderList = lazy(() => import('@pages/admin/order/OrderList'))
const UserList = lazy(() => import('@pages/admin/user/UserList'))
const BannerList = lazy(() => import('@pages/admin/banner/BannerList'))
const ReviewList = lazy(() => import('@pages/admin/review/ReviewList'))
const CouponList = lazy(() => import('@pages/admin/coupon/CouponList'))
const DocumentList = lazy(() => import('@pages/admin/document/DocumentList'))
const SettingsPage = lazy(() => import('@pages/admin/SettingsPage'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductPage /> },
      { path: '/products/:id', element: <ProductDetailPage /> },
      {
        path: '/cart',
        element: (
          <RequireAuth>
            <CartPage />
          </RequireAuth>
        ),
      },
      {
        path: '/checkout',
        element: (
          <RequireAuth>
            <CheckoutPage />
          </RequireAuth>
        ),
      },
      { path: '/payment', element: <PaymentPage /> },
      { path: '/payment/qr', element: <PaymentQrPage /> },
      { path: '/auth', element: <AuthPage /> },
      {
        path: '/my-orders',
        element: (
          <RequireAuth>
            <MyOrdersPage />
          </RequireAuth>
        ),
      },
      {
        path: '/my-orders/:id',
        element: (
          <RequireAuth>
            <OrderDetailPage />
          </RequireAuth>
        ),
      },
      {
        path: '/order-success/:id',
        element: (
          <RequireAuth>
            <OrderSuccessPage />
          </RequireAuth>
        ),
      },
      {
        path: '/profile',
        element: (
          <RequireAuth>
            <ProfilePage />
          </RequireAuth>
        ),
      },
      {
        path: '/green-wallet',
        element: (
          <RequireAuth>
            <GreenWalletPage />
          </RequireAuth>
        ),
      },
      {
        path: '/favorite-products',
        element: (
          <RequireAuth>
            <WishlistPage />
          </RequireAuth>
        ),
      },
      { path: '/compare', element: <ComparePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/shipping', element: <ShippingPage /> },
      { path: '/returns', element: <ReturnsPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin',
    element: <RootLayoutAdmin />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'product', element: <ProductList /> },
      { path: 'product/create', element: <ProductCreate /> },
      { path: 'product/:id/edit', element: <ProductEdit /> },
      { path: 'category', element: <CategoryList /> },
      { path: 'material', element: <MaterialList /> },
      { path: 'order', element: <OrderList /> },
      { path: 'user', element: <UserList /> },
      { path: 'banner', element: <BannerList /> },
      { path: 'review', element: <ReviewList /> },
      { path: 'coupon', element: <CouponList /> },
      { path: 'document', element: <DocumentList /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
