import { invalidateGetAllUsers, useCreateUser } from '@api'
import type { ProblemDetails } from '@api/schemas'
import UserForm, { type UserFormValues } from '@components/features/user/UserForm'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useNavigate } from 'react-router'

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as AxiosError<ProblemDetails>).response?.data.detail || fallback

const UserCreate = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createUser, isPending } = useCreateUser({
    mutation: {
      onSuccess: async () => {
        await invalidateGetAllUsers(queryClient)
      },
    },
  })

  const handleSubmit = (values: UserFormValues) => {
    createUser(
      { data: values },
      {
        onSuccess: () => {
          notifications.show({ title: 'Created', message: 'User account created.', color: 'green' })
          navigate('/admin/user')
        },
        onError: (error) => {
          notifications.show({
            title: 'Error',
            message: getErrorMessage(error, 'Could not create user.'),
            color: 'red',
          })
        },
      },
    )
  }

  return <UserForm editingUser={null} onSubmit={handleSubmit} isSubmitting={isPending} />
}

export default UserCreate
