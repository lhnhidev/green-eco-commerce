import { Suspense } from 'react'
import { Outlet } from 'react-router'
import Footer from '../components/Footer'
import Loading from '../components/Loading'
import { Navigation } from '../components/Navigation'

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
