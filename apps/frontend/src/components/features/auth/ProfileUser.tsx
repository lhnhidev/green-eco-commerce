import { getGetMeQueryKey, useLogout } from '@api'
import { RoleEnum } from '@api/schemas'
import { useAuth } from '@hooks/useAuth'
import { Avatar, Divider, Group, Menu, Skeleton, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  GaugeIcon,
  HeartIcon,
  LeafIcon,
  PackageIcon,
  ScalesIcon,
  SignOutIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import type { IconType } from 'react-icons/lib'
import { Link, useNavigate } from 'react-router'
import LoginComponent from './LoginComponent'

type MenuItemType = {
  id: number
  label: string
  icon: IconType
  url: string
}

const menuList: Array<MenuItemType> = [
  { id: 1, label: 'Profile', icon: UserIcon, url: '/profile' },
  { id: 2, label: 'My orders', icon: PackageIcon, url: '/my-orders' },
  { id: 3, label: 'Favorite products', icon: HeartIcon, url: '/favorite-products' },
  { id: 4, label: 'Green wallet', icon: LeafIcon, url: '/green-wallet' },
  { id: 5, label: 'Compare', icon: ScalesIcon, url: '/compare' },
]

const positionMap = {
  center: 'bottom' as const,
  left: 'bottom-start' as const,
  right: 'bottom-end' as const,
}

type ProfileUserType = {
  position?: 'center' | 'left' | 'right'
}

const ProfileUser = ({ position = 'center' }: ProfileUserType) => {
  const queryClient = useQueryClient()
  const { mutate: logout } = useLogout()
  const navigate = useNavigate()
  const { user, isPending } = useAuth()

  if (isPending) {
    return <Skeleton height={38} circle />
  }

  if (!user) {
    return <LoginComponent />
  }

  const fullName = user?.firstName?.charAt(0).concat(user?.lastName?.charAt(0)).toUpperCase()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.clear()
        queryClient.removeQueries({ queryKey: getGetMeQueryKey() })
        navigate('/')
        notifications.show({
          title: 'Logout successed!',
          message: 'See you later...',
          color: 'blue',
        })
      },
      onError: () => {
        notifications.show({
          title: 'Logout failed!',
          message: 'Please try again.',
          color: 'red',
        })
      },
    })
  }

  return (
    <Menu shadow="xl" width={272} position={positionMap[position]} offset={8}>
      <Menu.Target>
        <Avatar
          src={resolveImageUrl(user?.avatar)}
          color="green"
          radius="xl"
          alt="it's me"
          className="cursor-pointer"
          classNames={{
            placeholder: '!transition-colors hover:!bg-green-50 !cursor-pointer',
          }}
        >
          {!user?.avatar && fullName}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown className="!p-4">
        <Group gap="sm" px={4}>
          <Avatar
            src={resolveImageUrl(user?.avatar)}
            color="green"
            radius="xl"
            alt="it's me"
            classNames={{
              placeholder: '!transition-colors hover:!bg-green-50 !cursor-pointer',
            }}
          >
            {!user?.avatar && fullName}
          </Avatar>
          <Stack gap={0} className="max-w-42.5">
            <Text fw={600} size="sm" className="truncate">
              {user.firstName} {user.lastName}
            </Text>
            <Text size="xs" c="dimmed" className="truncate">
              {user.email}
            </Text>
          </Stack>
        </Group>

        <Divider my="xs" />

        {menuList.map((menuItem) => (
          <Menu.Item
            key={menuItem.id}
            component={Link}
            to={menuItem.url}
            leftSection={<menuItem.icon size={16} className="text-gray-400" />}
          >
            {menuItem.label}
          </Menu.Item>
        ))}

        {user.role === RoleEnum.Admin && (
          <Menu.Item component={Link} to="/admin/dashboard" leftSection={<GaugeIcon size={16} className="text-gray-400" />}>
            Admin dashboard
          </Menu.Item>
        )}

        <Divider my="xs" />

        <Menu.Item color="red" leftSection={<SignOutIcon size={16} />} onClick={handleLogout}>
          Log out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default ProfileUser
