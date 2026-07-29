import CartSidebar from '@components/features/cart/CartSidebar'
import ChatBot from '@components/features/chatbot/ChatBot'
import CompareBar from '@components/features/compare/CompareBar'
import { Navigation } from '@components/features/Navigation'
import Footer from '@components/ui/Footer'
import Loading from '@components/ui/status/Loading'
import { Suspense } from 'react'
import { Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <CartSidebar />

      {/* Page component */}
      <Suspense fallback={<Loading text="Loading..." />}>
        <Outlet></Outlet>
      </Suspense>

      <CompareBar />
      <ChatBot />
      <Footer />
    </div>
  )
}

export default RootLayout
