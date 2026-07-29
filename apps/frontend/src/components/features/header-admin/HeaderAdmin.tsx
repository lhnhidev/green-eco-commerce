import { toggleDesktopSidebar, toggleMobileSidebar } from '@components/features/navigation/navigation.slice'
import NotificationBell from '@components/features/notifications/NotificationBell'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { ActionIcon, AppShell, TextInput } from '@mantine/core'
import { ListIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import ProfileUser from '../auth/ProfileUser'

const HeaderAdmin = () => {
  const dispatch = useAppDispatch()
  const headerName = useAppSelector((state) => state.theNavigation.active)

  return (
    <AppShell.Header px="md" className="flex items-center justify-between gap-3">
      {/* Hamburger — visible only on mobile/tablet */}
      <div className="flex items-center gap-3">
        <ActionIcon
          variant="subtle"
          color="gray"
          size="md"
          className="lg:hidden"
          onClick={() => {
            dispatch(toggleDesktopSidebar())
            dispatch(toggleMobileSidebar())
          }}
          aria-label="Toggle sidebar"
        >
          <ListIcon size={18} />
        </ActionIcon>
        <div className="text-[18px] font-semibold capitalize text-[#18181b]">{headerName}</div>
      </div>

      <div className="flex items-center gap-3">
        <TextInput
          placeholder="Search..."
          size="xs"
          leftSection={<MagnifyingGlassIcon size={14} />}
          className="hidden sm:block"
          w={180}
        />
        <NotificationBell />
        <ProfileUser position="right" />
      </div>
    </AppShell.Header>
  )
}

export default HeaderAdmin
