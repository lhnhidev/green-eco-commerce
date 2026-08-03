import { useUploadImage } from '@api'
import type { UserDto } from '@api/schemas'
import { RoleEnum } from '@api/schemas'
import FormGrid from '@components/ui/primitives/FormGrid'
import FormPanel from '@components/ui/primitives/FormPanel'
import { ActionIcon, Avatar, FileButton, Loader, PasswordInput, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { CameraIcon } from '@phosphor-icons/react'
import { resolveImageUrl } from '@utils/resolveImageUrl'
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
  isSubmitting?: boolean
}

const UserForm = ({ editingUser, onSubmit, isSubmitting }: UserFormProps) => {
  const isEditing = !!editingUser
  const { mutateAsync: uploadImage, isPending: isUploadingAvatar } = useUploadImage()

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

  const handleAvatarChange = async (file: File | null) => {
    if (!file) return
    try {
      const result = await uploadImage({ data: { file } })
      form.setFieldValue('avatar', result.url)
    } catch {
      notifications.show({ title: 'Upload failed', message: 'Could not upload avatar.', color: 'red' })
    }
  }

  return (
    <FormPanel
      title={isEditing ? 'Edit User' : 'Add New User'}
      description={isEditing ? 'Update this account’s details.' : 'Fill in the details to create a new account.'}
      backTo="/admin/user"
      cancelTo="/admin/user"
      submitLabel={isEditing ? 'Save Changes' : 'Create User'}
      isSubmitting={isSubmitting}
      onSubmit={form.onSubmit(onSubmit)}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <FormGrid>
            <TextInput label="First name" withAsterisk {...form.getInputProps('firstName')} />
            <TextInput label="Last name" withAsterisk {...form.getInputProps('lastName')} />
          </FormGrid>
        </div>
        <FileButton onChange={handleAvatarChange} accept="image/*">
          {(props) => (
            <div className="relative shrink-0 cursor-pointer" {...props}>
              <Avatar
                src={form.values.avatar ? resolveImageUrl(form.values.avatar) : null}
                size={64}
                radius="50%"
                className="border border-border"
              />
              <ActionIcon size="sm" radius="xl" variant="filled" className="absolute -bottom-0.5 -right-0.5">
                {isUploadingAvatar ? <Loader size={10} color="white" /> : <CameraIcon size={12} />}
              </ActionIcon>
            </div>
          )}
        </FileButton>
      </div>
      <TextInput label="Email" withAsterisk {...form.getInputProps('email')} />
      <FormGrid>
        <TextInput
          label="Phone number"
          placeholder="10-digit phone number"
          withAsterisk
          {...form.getInputProps('phone')}
        />
        <Select label="Role" withAsterisk data={Object.values(RoleEnum)} {...form.getInputProps('role')} />
      </FormGrid>
      <TextInput label="Address" withAsterisk {...form.getInputProps('address')} />
      <PasswordInput
        label={isEditing ? 'New password' : 'Password'}
        description={isEditing ? "Sets a new password for this user's account." : undefined}
        withAsterisk
        {...form.getInputProps('password')}
      />
    </FormPanel>
  )
}

export default UserForm
