import CartSidebar from '@components/features/cart/CartSidebar'
import ChatBot from '@components/features/chatbot/ChatBot'
import CompareBar from '@components/features/compare/CompareBar'
import MobileTabBar from '@components/features/MobileTabBar'
import { Navigation } from '@components/features/Navigation'
import Footer from '@components/ui/Footer'
import Loading from '@components/ui/status/Loading'
import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <ScrollRestoration />
      <Navigation />

      <CartSidebar />

      {/* Page component */}
      <Suspense fallback={<Loading text="Loading..." />}>
        <Outlet></Outlet>
      </Suspense>

      <CompareBar />
      <ChatBot />
      <Footer />
      <MobileTabBar />
    </div>
  )
}

export default RootLayout
