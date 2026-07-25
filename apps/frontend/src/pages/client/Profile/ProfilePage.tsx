import { useGetMe, useUpdateUserProfile } from '@api'
import { setAuthUser } from '@components/features/auth/auth.slice'
import StatisticsTab from '@components/features/statistics/StatisticsTab'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Anchor, Avatar, Breadcrumbs, Button, Divider, PasswordInput, Tabs, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useEffect } from 'react'
import { FiBarChart2, FiUser } from 'react-icons/fi'

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Profile', href: '/profile' },
].map((item) => (
  <Anchor href={item.href} key={item.href} size="sm">
    {item.title}
  </Anchor>
))

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const { data: user, isLoading } = useGetMe()
  const { mutate: updateProfile, isPending } = useUpdateUserProfile()

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      avatar: '',
      password: '',
    },
    validate: {
      firstName: (v) => (v.trim().length < 2 ? 'At least 2 characters' : null),
      lastName: (v) => (v.trim().length < 2 ? 'At least 2 characters' : null),
      phone: (v) => (v.trim().length !== 10 ? 'Phone must be exactly 10 digits' : null),
      address: (v) => (v.trim().length < 5 ? 'At least 5 characters' : null),
    },
  })

  useEffect(() => {
    if (user) {
      form.setValues({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        phone: user.phone ?? '',
        address: user.address ?? '',
        avatar: user.avatar ?? '',
        password: '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, form.setValues])

  const handleSubmit = (values: typeof form.values) => {
    updateProfile(
      {
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          address: values.address,
          avatar: values.avatar,
          password: values.password || '',
        },
      },
      {
        onSuccess: (updated) => {
          dispatch(setAuthUser(updated))
          notifications.show({ title: 'Profile updated', message: 'Your info has been saved.', color: 'green' })
          form.setFieldValue('password', '')
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Could not update profile.', color: 'red' })
        },
      },
    )
  }

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : ''

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

      <div className="flex items-center gap-3 mb-6">
        <FiUser className="text-2xl text-primary" />
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      </div>

      <Tabs defaultValue="profile" keepMounted={false}>
        <Tabs.List mb="lg">
          <Tabs.Tab value="profile" leftSection={<FiUser />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="stats" leftSection={<FiBarChart2 />}>
            Statistics
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        {/* Avatar section */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar src={user?.avatar || null} size={72} radius="xl" color="green">
            {!user?.avatar && initials}
          </Avatar>
          <div>
            <p className="font-semibold text-gray-800 text-lg">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <p className="text-xs text-gray-300 capitalize mt-0.5">{user?.role}</p>
          </div>
        </div>

        <Divider mb="lg" />

        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading profile…</div>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <TextInput
                label="First Name"
                placeholder="First name"
                withAsterisk
                {...form.getInputProps('firstName')}
              />
              <TextInput label="Last Name" placeholder="Last name" withAsterisk {...form.getInputProps('lastName')} />
            </div>

            <TextInput
              label="Phone Number"
              placeholder="10-digit phone number"
              withAsterisk
              {...form.getInputProps('phone')}
            />

            <TextInput
              label="Delivery Address"
              placeholder="Your delivery address"
              withAsterisk
              {...form.getInputProps('address')}
            />

            <TextInput
              label="Avatar URL"
              placeholder="https://example.com/avatar.jpg"
              {...form.getInputProps('avatar')}
            />

            <PasswordInput
              label="New Password"
              description="Leave blank to keep your current password"
              placeholder="Enter new password"
              {...form.getInputProps('password')}
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" color="primary" loading={isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
          </div>
        </Tabs.Panel>

        <Tabs.Panel value="stats">
          <StatisticsTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export default ProfilePage
