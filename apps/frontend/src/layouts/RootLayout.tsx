import { RoleEnum } from '@api/schemas/roleEnum'
import CartSidebar from '@components/features/cart/CartSidebar'
import ChatBot from '@components/features/chatbot/ChatBot'
import CompareBar from '@components/features/compare/CompareBar'
import MobileTabBar from '@components/features/MobileTabBar'
import { Navigation } from '@components/features/Navigation'
import Footer from '@components/ui/Footer'
import Loading from '@components/ui/status/Loading'
import { useAuth } from '@hooks/useAuth'
import { Suspense, useEffect } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigate } from 'react-router'

const RootLayout = () => {
  const { user, isPending } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isPending && user?.role === RoleEnum.Admin && !location.pathname.startsWith('/admin')) {
      navigate('/admin', { replace: true })
    }
  }, [user, isPending, location.pathname, navigate])

  return isPending ? (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loading text="Verifying access..." />
    </div>
  ) : (
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
