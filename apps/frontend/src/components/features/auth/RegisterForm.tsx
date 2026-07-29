import { useRegister } from '@api'
import type { ProblemDetails } from '@api/schemas'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { EnvelopeIcon, LockIcon, MapPinIcon, PhoneIcon, UserIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import type { LocalRegisterFormValues } from '@types'
import type { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import FormField from '../form-field'
import EmailInput from '../form-field/email-input'
import TheTextInput from '../form-field/input'
import PasswordInputV2 from '../form-field/password-input'
import { changeActive } from './auth.slice'

const RegisterForm = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LocalRegisterFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
  })

  const { mutate, isPending } = useRegister()

  const onSubmit = (formData: LocalRegisterFormValues) => {
    const { ...data } = formData

    if (data.repeatPassword !== data.password) {
      notifications.show({
        title: 'Invalid repeat password',
        message: 'Password and repeat password must be same',
        color: 'red',
      })
      return
    }

    mutate(
      { data: data },
      {
        onSuccess: async () => {
          queryClient.clear()
          dispatch(changeActive('login'))
          notifications.show({
            title: 'Register sucessed!',
            message: 'Welcome to our shop. Please login your account to shop',
            color: 'green',
          })
        },
        onError: (error) => {
          const axiosError = error as AxiosError<ProblemDetails>
          notifications.show({
            title: 'Register failed!',
            message: axiosError.response?.data.detail || 'Register failed. Please try again!',
            color: 'red',
          })
        },
      },
    )
  }

  return (
    <div className="text-xs mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <FormField<LocalRegisterFormValues>
                name="firstName"
                control={control}
                label="First name"
                placeholder="Joe"
                Icon={UserIcon}
                errorMessage={errors.firstName?.message}
                Component={TheTextInput}
              />
            </div>
            <div className="col-span-1">
              <FormField<LocalRegisterFormValues>
                name="lastName"
                control={control}
                label="Last name"
                placeholder="Doe"
                errorMessage={errors.lastName?.message}
                Component={TheTextInput}
              />
            </div>
          </div>

          <FormField<LocalRegisterFormValues>
            name="phone"
            control={control}
            label="Phone number"
            placeholder="0932397440"
            Icon={PhoneIcon}
            errorMessage={errors.phone?.message}
            Component={TheTextInput}
          />

          <FormField<LocalRegisterFormValues>
            name="address"
            control={control}
            label="Address"
            placeholder="Enter your address"
            Icon={MapPinIcon}
            errorMessage={errors.address?.message}
            Component={TheTextInput}
          />

          <FormField<LocalRegisterFormValues>
            name="email"
            control={control}
            label="Email"
            placeholder="Enter your email"
            Icon={EnvelopeIcon}
            errorMessage={errors.email?.message}
            Component={EmailInput}
          />

          <FormField<LocalRegisterFormValues>
            name="password"
            control={control}
            label="Password"
            placeholder="Enter your password"
            Icon={LockIcon}
            errorMessage={errors.password?.message}
            Component={PasswordInputV2}
          />

          <FormField<LocalRegisterFormValues>
            name="repeatPassword"
            control={control}
            label="Repeat password"
            placeholder="Enter your repeat password"
            Icon={LockIcon}
            errorMessage={errors.repeatPassword?.message}
            Component={PasswordInputV2}
          />
        </div>

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
          Register
        </Button>
      </form>
    </div>
  )
}

export default RegisterForm
