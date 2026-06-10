/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
import { Avatar, Divider, Group, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { BiLeaf } from 'react-icons/bi'
import { FiHeart, FiLogOut, FiPackage, FiSettings, FiShoppingBag, FiUser } from 'react-icons/fi'
import type { IconType } from 'react-icons/lib'
import { Link } from 'react-router'
import { getGetApiAuthMeQueryKey, usePostApiAuthLogout } from '../../../api'
import type { UserProfileResponse } from '../../../api/schemas'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { clearAuthUser } from './auth.slice'
import LoginComponent from './LoginComponent'

type ProfileUserType = {
  user: UserProfileResponse | null
}

type menuItemType = {
  id: number
  label: string
  icon: IconType
  url: string
}

const menuList: Array<menuItemType> = [
  {
    id: 1,
    label: 'Profile',
    icon: FiUser,
    url: '/profile',
  },
  {
    id: 2,
    label: 'My orders',
    icon: FiPackage,
    url: '/my-orders',
  },
  {
    id: 3,
    label: 'History shopping',
    icon: FiShoppingBag,
    url: '/history-shopping',
  },
  {
    id: 4,
    label: 'Favorite products',
    icon: FiHeart,
    url: '/favorite-products',
  },
  {
    id: 5,
    label: 'Green wallet',
    icon: BiLeaf,
    url: '/green-wallet',
  },
  {
    id: 6,
    label: 'Settings',
    icon: FiSettings,
    url: '/settings',
  },
]

const ProfileUser = ({ user }: ProfileUserType) => {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const { mutate: logout } = usePostApiAuthLogout()

  if (!user) {
    return <LoginComponent />
  }

  const fullName = user?.firstName?.charAt(0).concat(user?.lastName?.charAt(0)).toUpperCase()

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(clearAuthUser())
        queryClient.removeQueries({ queryKey: getGetApiAuthMeQueryKey() })
        setShowProfileMenu(false)
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

  return user ? (
    // biome-ignore lint/a11y/noStaticElementInteractions: <>
    <div onClick={() => setShowProfileMenu(!showProfileMenu)} className="relative">
      <Avatar
        color="green"
        radius="xl"
        classNames={{
          placeholder: '!transition-colors hover:!bg-green-50 !cursor-pointer',
        }}
      >
        {fullName}
      </Avatar>

      {showProfileMenu && (
        <div
          className={`${
            showProfileMenu ? 'block' : 'hidden'
          } shadow-xl border border-gray-200 py-5 px-4 absolute top-14 left-1/2 -translate-x-1/2 bg-white text-black text-sm w-68 rounded-xl z-50`}
        >
          {user ? (
            <>
              <div>
                <Group gap="sm">
                  <Avatar
                    radius="xl"
                    size="md"
                    color="green"
                    className="font-bold text-xs"
                    classNames={{ placeholder: '!border-gray-300' }}
                  >
                    {fullName}
                  </Avatar>
                  <Stack gap={0} className="max-w-42.5">
                    <Text fw={600} size="sm" className="truncate">
                      {user?.firstName} {user?.lastName}
                    </Text>
                    <Text size="xs" c="dimmed" className="truncate">
                      {user.email}
                    </Text>
                  </Stack>
                </Group>
              </div>

              <Divider my="xs" classNames={{ root: '!border-gray-200 !mt-4' }} />

              <div className="flex flex-col gap-1 px-1">
                {menuList.map((menuItem) => (
                  <Link
                    to={menuItem.url}
                    key={menuItem.id}
                    className="w-full hover:bg-gray-100 -mx-2 p-2 rounded-md transition-colors text-left flex items-center gap-3"
                  >
                    <menuItem.icon size={16} className="text-gray-400" />
                    <span className="text-sm">{menuItem.label}</span>
                  </Link>
                ))}
              </div>

              <Divider my="xs" classNames={{ root: '!border-gray-200 !mt-4' }} />

              {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
              <div
                onClick={handleLogout}
                className="w-full hover:bg-gray-100 -mx-1 p-2 rounded-md transition-colors text-left flex items-center gap-3 cursor-pointer"
              >
                <FiLogOut size={16} className="text-gray-400" />
                <span className="text-sm">Log out</span>
              </div>
            </>
          ) : (
            <LoginComponent />
          )}
        </div>
      )}
    </div>
  ) : (
    <LoginComponent />
  )
}

export default ProfileUser
