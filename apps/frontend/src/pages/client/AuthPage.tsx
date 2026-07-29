import Brand from '@components/ui/Brand'
import Seo from '@components/ui/Seo'
import { useAuth } from '@hooks/useAuth'
import AuthFormLayout from '@layouts/AuthFormLayout'
import { Navigate, useSearchParams } from 'react-router'

const AuthPage = () => {
  const { user, isPending } = useAuth()
  const [searchParams] = useSearchParams()

  if (!isPending && user) {
    const returnTo = searchParams.get('returnTo')
    return <Navigate to={returnTo || (user.role === 'Admin' ? '/admin/dashboard' : '/')} replace />
  }

  return (
    <div className="h-220 w-full plant-gradient flex items-center justify-center">
      <Seo title="Sign In" />
      <div className="flex flex-col items-center">
        <div className="mb-8">
          <Brand linkToHome={false} size="md" />
        </div>

        <div className="bg-white py-4 px-6 rounded-lg shadow-md">
          <AuthFormLayout />
        </div>
      </div>
    </div>
  )
}

export default AuthPage
