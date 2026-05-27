import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { Navigation } from '../components/features/Navigation'
import Footer from '../components/ui/Footer'
import Loading from '../components/ui/status/Loading'

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Page component */}
      <Suspense fallback={<Loading text="Loading..." />}>
        <Outlet></Outlet>
      </Suspense>

      <Footer />
    </div>
  )
}

export default RootLayout
