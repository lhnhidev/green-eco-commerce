import { Button } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { FaFacebook, FaGoogle, FaRegEnvelope } from 'react-icons/fa'
import { MdLockOutline } from 'react-icons/md'
import type { LoginFormValues } from '../../../types/loginForm.types'
import FormField from '../form-field'
import CheckboxInput from '../form-field/checkbox-input'
import EmailInput from '../form-field/email-input'
import PasswordInputV2 from '../form-field/password-input'

const LoginForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    console.log('Dữ liệu submit:', data)
  }

  return (
    <div className="text-xs mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          <FormField<LoginFormValues>
            name="email"
            control={control}
            label="Email"
            placeholder="Enter your email"
            Icon={FaRegEnvelope}
            errorMessage={errors.email?.message}
            Component={EmailInput}
          />

          <FormField<LoginFormValues>
            name="password"
            control={control}
            rules={{ required: 'Password is required' }}
            label="Password"
            placeholder="Enter your password"
            Icon={MdLockOutline}
            errorMessage={errors.password?.message}
            Component={PasswordInputV2}
          />
        </div>

        <div className="flex justify-between">
          <FormField name="remember" control={control} rules={{}} label="Remember me" Component={CheckboxInput} />

          <a href="/forgot-password" className="text-primary font-medium hover:underline hover:opacity-90">
            Forget password?
          </a>
        </div>

        <div>
          <Button
            size="xs"
            radius="xl"
            color="green.9"
            classNames={{
              root: '!w-full',
            }}
          >
            Sign in
          </Button>

          <p className="text-gray-600 text-center mt-3">Or continue with</p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="default"
            size="xs"
            radius="xl"
            leftSection={<FaFacebook />}
            classNames={{
              root: '!flex-1 !rounded-xl !hover:bg-[var(--color-input-muted)]',
              label: '!text-xs',
            }}
          >
            Facebook
          </Button>
          <Button
            variant="default"
            size="xs"
            radius="xl"
            leftSection={<FaGoogle />}
            classNames={{
              root: '!flex-1 !rounded-xl !hover:bg-[var(--color-input-muted)]',
              label: '!text-xs',
            }}
          >
            Google
          </Button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
