import { invalidateGetAllUsers, useGetUserById, useUpdateUser } from '@api'
import type { ProblemDetails } from '@api/schemas'
import UserForm, { type UserFormValues } from '@components/features/user/UserForm'
import Loading from '@components/ui/status/Loading'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useNavigate, useParams } from 'react-router'

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as AxiosError<ProblemDetails>).response?.data.detail || fallback

const UserEdit = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: user, isLoading: isLoadingUser } = useGetUserById(id!, {
    query: { enabled: !!id },
  })
  const { mutate: updateUser, isPending } = useUpdateUser({
    mutation: {
      onSuccess: async () => {
        await invalidateGetAllUsers(queryClient)
      },
    },
  })

  const handleSubmit = (values: UserFormValues) => {
    if (!id) return
    updateUser(
      { id, data: values },
      {
        onSuccess: () => {
          notifications.show({ title: 'Updated', message: 'User account updated.', color: 'green' })
          navigate('/admin/user')
        },
        onError: (error) => {
          notifications.show({
            title: 'Error',
            message: getErrorMessage(error, 'Could not update user.'),
            color: 'red',
          })
        },
      },
    )
  }

  if (isLoadingUser) {
    return <Loading text="Loading user..." />
  }

  return <UserForm editingUser={user ?? null} onSubmit={handleSubmit} isSubmitting={isPending} />
}

export default UserEdit
