import AuthHeader from '../components/features/auth/AuthHeader'
import LoginForm from '../components/features/auth/LoginForm'
import RegisterForm from '../components/features/auth/RegisterForm'
import { useAppSelector } from '../hooks/useAppSelector'

const AuthFormLayout = () => {
  const active = useAppSelector((state) => state.auth.active)

  return (
    <div className="w-90">
      <AuthHeader title="Welcome" description="Join our shopping community" />

      {active === 'register' ? <RegisterForm /> : <LoginForm />}
    </div>
  )
}

export default AuthFormLayout
