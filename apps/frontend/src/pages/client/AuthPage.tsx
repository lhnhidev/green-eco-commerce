import Brand from '../../components/Brand'
import AuthFormLayout from '../../layouts/AuthFormLayout'

const AuthPage = () => {
  return (
    <div className="h-220 w-full plant-gradient flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="mb-8">
          <Brand linkToHome={false} size="md" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <AuthFormLayout></AuthFormLayout>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
