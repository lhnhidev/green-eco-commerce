import type { UserDto } from '@api/schemas'
import { RoleEnum } from '@api/schemas'
import { ImageDropzone } from '@components/features/upload/ImageDropzone'
import { Button, PasswordInput, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

export type UserFormValues = {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  avatar: string
  role: RoleEnum
  password: string
}

const emptyValues: UserFormValues = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  avatar: '',
  role: RoleEnum.User,
  password: '',
}

const toFormValues = (user: UserDto): UserFormValues => ({
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  phone: user.phone,
  address: user.address,
  avatar: user.avatar,
  role: user.role,
  password: '',
})

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/

type UserFormProps = {
  editingUser: UserDto | null
  onSubmit: (values: UserFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const UserForm = ({ editingUser, onSubmit, onCancel, isSubmitting }: UserFormProps) => {
  const isEditing = !!editingUser

  const form = useForm<UserFormValues>({
    initialValues: editingUser ? toFormValues(editingUser) : emptyValues,
    validate: {
      email: (v) => (!/^\S+@\S+\.\S+$/.test(v) ? 'A valid email is required' : null),
      firstName: (v) => (v.trim().length < 2 ? 'At least 2 characters' : null),
      lastName: (v) => (v.trim().length < 2 ? 'At least 2 characters' : null),
      phone: (v) => (v.trim().length !== 10 ? 'Phone must be exactly 10 digits' : null),
      address: (v) => (v.trim().length < 5 ? 'At least 5 characters' : null),
      password: (v) =>
        !PASSWORD_PATTERN.test(v) ? 'Min 6 chars, incl. uppercase, lowercase, digit & special character' : null,
    },
  })

  useEffect(() => {
    form.setValues(editingUser ? toFormValues(editingUser) : emptyValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingUser])

  return (
    <form onSubmit={form.onSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextInput label="First name" withAsterisk {...form.getInputProps('firstName')} />
        <TextInput label="Last name" withAsterisk {...form.getInputProps('lastName')} />
      </div>
      <TextInput label="Email" withAsterisk {...form.getInputProps('email')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <TextInput
          label="Phone number"
          placeholder="10-digit phone number"
          withAsterisk
          {...form.getInputProps('phone')}
        />
        <Select label="Role" withAsterisk data={Object.values(RoleEnum)} {...form.getInputProps('role')} />
      </div>
      <TextInput label="Address" withAsterisk {...form.getInputProps('address')} />
      <ImageDropzone label="Avatar" value={form.values.avatar} onChange={(url) => form.setFieldValue('avatar', url)} />
      <PasswordInput
        label={isEditing ? 'New password' : 'Password'}
        description={isEditing ? "Sets a new password for this user's account." : undefined}
        withAsterisk
        {...form.getInputProps('password')}
      />
      <div className="flex justify-end gap-2 mt-1">
        <Button variant="subtle" color="gray" size="xs" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="xs" loading={isSubmitting}>
          {isEditing ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}

export default UserForm
