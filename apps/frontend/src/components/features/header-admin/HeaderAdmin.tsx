import { toggleDesktopSidebar, toggleMobileSidebar } from '@components/features/navigation/navigation.slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { ActionIcon, AppShell, TextInput } from '@mantine/core'
import { CiSearch } from 'react-icons/ci'
import { FaRegBell } from 'react-icons/fa'
import { RiMenuLine } from 'react-icons/ri'
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
          <RiMenuLine size={18} />
        </ActionIcon>
        <div className="text-[18px] font-semibold capitalize text-[#18181b]">{headerName}</div>
      </div>

      <div className="flex items-center gap-3">
        <TextInput
          placeholder="Search..."
          size="xs"
          leftSection={<CiSearch size={14} />}
          className="hidden sm:block"
          w={180}
        />
        <FaRegBell size={15} className="text-muted-foreground hidden sm:block" />
        <ProfileUser position="right" />
      </div>
    </AppShell.Header>
  )
}

export default HeaderAdmin
