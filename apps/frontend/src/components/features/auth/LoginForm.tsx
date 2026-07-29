import { useFacebookLogin, useGoogleLogin, useLogin } from '@api'
import type { LoginCommand, ProblemDetails, UserProfileDto } from '@api/schemas'
import { useFacebookSdk } from '@hooks/useFacebookSdk'
import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { EnvelopeIcon, FacebookLogoIcon, LockIcon } from '@phosphor-icons/react'
import { GoogleLogin } from '@react-oauth/google'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router'
import FormField from '../form-field'
import EmailInput from '../form-field/email-input'
import PasswordInputV2 from '../form-field/password-input'

const LoginForm = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isReady: isFacebookReady, login: facebookLogin } = useFacebookSdk()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginCommand>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutate, isPending } = useLogin()

  const handleAuthSuccess = (profile: UserProfileDto) => {
    queryClient.clear()
    const returnTo = searchParams.get('returnTo')
    navigate(returnTo || (profile.role === 'Admin' ? '/admin/dashboard' : '/'))
    notifications.show({ title: 'Login sucessed!', message: 'Welcome to our shop.', color: 'green' })
  }

  const handleAuthError = (error: unknown, fallback: string) => {
    const axiosError = error as AxiosError<ProblemDetails>
    notifications.show({
      title: 'Login failed!',
      message: axiosError.response?.data?.detail || fallback,
      color: 'red',
    })
  }

  const onSubmit = (formData: LoginCommand) => {
    mutate(
      { data: formData },
      {
        onSuccess: handleAuthSuccess,
        onError: (error) => handleAuthError(error, 'Login failed. Please try again!'),
      },
    )
  }

  const { mutate: googleLogin, isPending: googlePending } = useGoogleLogin({
    mutation: {
      onSuccess: handleAuthSuccess,
      onError: (error) => handleAuthError(error, 'Google sign-in failed. Please try again!'),
    },
  })

  const { mutate: facebookLoginMutation, isPending: facebookPending } = useFacebookLogin({
    mutation: {
      onSuccess: handleAuthSuccess,
      onError: (error) => handleAuthError(error, 'Facebook sign-in failed. Please try again!'),
    },
  })

  const handleFacebookClick = async () => {
    try {
      const accessToken = await facebookLogin()
      facebookLoginMutation({ data: { accessToken } })
    } catch {
      notifications.show({ title: 'Facebook sign-in cancelled', message: '', color: 'orange' })
    }
  }

  return (
    <div className="text-xs mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          <FormField<LoginCommand>
            name="email"
            control={control}
            label="Email"
            placeholder="Enter your email"
            Icon={EnvelopeIcon}
            errorMessage={errors.email?.message}
            Component={EmailInput}
          />

          <FormField<LoginCommand>
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            label="Password"
            placeholder="Enter your password"
            Icon={LockIcon}
            errorMessage={errors.password?.message}
            Component={PasswordInputV2}
          />
        </div>

        <div className="flex justify-between">
          {/* <FormField name="remember" control={control} rules={{}} label="Remember me" Component={CheckboxInput} /> */}

          <a href="/forgot-password" className="text-primary font-medium hover:underline hover:opacity-90">
            Forget password?
          </a>
        </div>

        <div>
          <Button
            type="submit"
            size="xs"
            radius="xl"
            color="green.9"
            loading={isPending}
            classNames={{
              root: '!w-full',
            }}
          >
            Sign in
          </Button>

          <p className="text-gray-600 text-center mt-3">Or continue with</p>
        </div>

        <div className="flex gap-4 items-center">
          <Button
            variant="default"
            size="xs"
            radius="xl"
            leftSection={<FacebookLogoIcon />}
            loading={facebookPending}
            disabled={!isFacebookReady}
            onClick={handleFacebookClick}
            classNames={{
              root: '!flex-1 !rounded-xl !hover:bg-[var(--color-input-muted)]',
              label: '!text-xs',
            }}
          >
            Facebook
          </Button>
          <div className="flex-1 flex justify-center [&>div]:w-full">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (!credentialResponse.credential) return
                googleLogin({ data: { idToken: credentialResponse.credential } })
              }}
              onError={() =>
                notifications.show({ title: 'Google sign-in failed', message: 'Please try again.', color: 'red' })
              }
              theme="outline"
              size="medium"
              shape="pill"
            />
          </div>
          {googlePending && <span className="sr-only">Signing in with Google…</span>}
        </div>
      </form>
    </div>
  )
}

export default LoginForm
