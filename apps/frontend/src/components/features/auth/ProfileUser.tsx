import { Avatar, Button, Divider, Group, Stack, Text } from '@mantine/core'
import { UserIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { BiLeaf } from 'react-icons/bi'
import { FiHeart, FiLogOut, FiPackage, FiSettings, FiShoppingBag, FiUser } from 'react-icons/fi'
import type { IconType } from 'react-icons/lib'
import { Link } from 'react-router'
import type { UserProfileResponse } from '../../../api/schemas'

type ProfileUserType = {
  user: UserProfileResponse | null
}

type menuItemType = {
  id: number
  label: string
  icon: IconType
}

const menuList: Array<menuItemType> = [
  {
    id: 1,
    label: 'Profile',
    icon: FiUser,
  },
  {
    id: 2,
    label: 'My orders',
    icon: FiPackage,
  },
  {
    id: 3,
    label: 'History shopping',
    icon: FiShoppingBag,
  },
  {
    id: 4,
    label: 'Favorite products',
    icon: FiHeart,
  },
  {
    id: 5,
    label: 'Green wallet',
    icon: BiLeaf,
  },
  {
    id: 5,
    label: 'Settings',
    icon: FiSettings,
  },
]

const ProfileUser = ({ user }: ProfileUserType) => {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false)

  const fullName = user?.firstName.charAt(0).concat(user?.lastName.charAt(0)).toUpperCase()

  return user ? (
    // biome-ignore lint/a11y/noStaticElementInteractions: <>
    // biome-ignore lint/a11y/useKeyWithClickEvents: <>
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
                  <div
                    key={menuItem.id}
                    className="w-full hover:bg-gray-100 -mx-2 p-2 rounded-md transition-colors text-left flex items-center gap-3"
                  >
                    <menuItem.icon size={16} className="text-gray-400" />
                    <span className="text-sm">{menuItem.label}</span>
                  </div>
                ))}
              </div>

              <Divider my="xs" classNames={{ root: '!border-gray-200 !mt-4' }} />

              <div className="w-full hover:bg-gray-100 -mx-1   p-2 rounded-md transition-colors text-left flex items-center gap-3">
                <FiLogOut size={16} className="text-gray-400" />
                <span className="text-sm">Log out</span>
              </div>
            </>
          ) : (
            <Link to="/auth">
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                radius="xl"
                leftSection={<UserIcon className="h-4 w-4" />}
              >
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  ) : (
    <Link to="/auth">
      <Button variant="subtle" color="gray" size="sm" radius="xl" leftSection={<UserIcon className="h-4 w-4" />}>
        <span className="hidden sm:inline">Login</span>
      </Button>
    </Link>
  )
}

export default ProfileUser
