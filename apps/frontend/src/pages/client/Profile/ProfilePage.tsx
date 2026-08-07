import { getGetMeQueryKey, useGetMe, useUpdateUserProfile } from '@api'
import AddressManager from '@components/features/addresses/AddressManager'
import StatisticsTab from '@components/features/statistics/StatisticsTab'
import { ImageDropzone } from '@components/features/upload/ImageDropzone'
import Container from '@components/ui/primitives/Container'
import PageHeader from '@components/ui/primitives/PageHeader'
import Panel from '@components/ui/primitives/Panel'
import { Avatar, Button, Divider, PasswordInput, Skeleton, Tabs, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { ChartBarIcon, MapPinIcon, UserIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import { useEffect } from 'react'

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Profile', href: '/profile' },
]

const ProfilePage = () => {
  const queryClient = useQueryClient()
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
      firstName: (v) => (v.trim().length < 2 ? 'First name must be at least 2 characters' : null),
      lastName: (v) => (v.trim().length < 2 ? 'Last name must be at least 2 characters' : null),
      phone: (v) => (v.trim().length !== 10 ? 'Phone must be exactly 10 digits' : null),
      address: (v) => (v.trim().length < 5 ? 'Address must be at least 5 characters' : null),
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
          queryClient.setQueryData(getGetMeQueryKey(), updated)
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
    <Container width="narrow" className="py-6">
      <PageHeader breadcrumbItems={breadcrumbItems} icon={UserIcon} title="My Profile" />

      <Tabs defaultValue="profile" keepMounted={false}>
        <Tabs.List mb="lg">
          <Tabs.Tab value="profile" leftSection={<UserIcon />}>
            Profile
          </Tabs.Tab>
          <Tabs.Tab value="addresses" leftSection={<MapPinIcon />}>
            Addresses
          </Tabs.Tab>
          <Tabs.Tab value="stats" leftSection={<ChartBarIcon />}>
            Statistics
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <Panel padding="lg">
            {/* Avatar section */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar src={resolveImageUrl(user?.avatar) ?? null} size={64} radius="xl" color="green">
                {!user?.avatar && initials}
              </Avatar>
              <div>
                <p className="font-semibold text-gray-800 text-md">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-400">{user?.email}</p>
                <p className="text-xs text-gray-300 capitalize mt-0.5">{user?.role}</p>
              </div>
            </div>

            <Divider mb="lg" />

            {isLoading ? (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <Skeleton height={60} radius="md" />
                  <Skeleton height={60} radius="md" />
                </div>
                <Skeleton height={60} radius="md" />
                <Skeleton height={60} radius="md" />
                <Skeleton height={100} radius="md" />
                <Skeleton height={60} radius="md" />
              </div>
            ) : (
              <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <TextInput
                    label="First Name"
                    placeholder="First name"
                    withAsterisk
                    {...form.getInputProps('firstName')}
                  />
                  <TextInput
                    label="Last Name"
                    placeholder="Last name"
                    withAsterisk
                    {...form.getInputProps('lastName')}
                  />
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

                <ImageDropzone
                  label="Avatar"
                  value={form.values.avatar}
                  onChange={(url) => form.setFieldValue('avatar', url)}
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
          </Panel>
        </Tabs.Panel>

        <Tabs.Panel value="addresses">
          <Panel padding="lg">
            <AddressManager />
          </Panel>
        </Tabs.Panel>

        <Tabs.Panel value="stats">
          <StatisticsTab />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default ProfilePage
