import { RoleEnum } from '@api/schemas/roleEnum'
import CartSidebar from '@components/features/cart/CartSidebar'
import ChatBot from '@components/features/chatbot/ChatBot'
import CompareBar from '@components/features/compare/CompareBar'
import MobileTabBar from '@components/features/MobileTabBar'
import { Navigation } from '@components/features/Navigation'
import Footer from '@components/ui/Footer'
import Loading from '@components/ui/status/Loading'
import { useAuth } from '@hooks/useAuth'
import { Suspense } from 'react'
import { Navigate, Outlet, ScrollRestoration } from 'react-router'

const RootLayout = () => {
  const { user, isPending } = useAuth()

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loading text="Verifying access..." />
      </div>
    )
  }

  if (user?.role === RoleEnum.Admin) {
    return <Navigate to="/admin" replace />
  }

  return (
    <div className="min-h-screen bg-background pb-14 lg:pb-0">
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
