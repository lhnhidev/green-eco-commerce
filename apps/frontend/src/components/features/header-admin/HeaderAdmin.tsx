import { useAppSelector } from '@hooks/useAppSelector'
import { TextInput } from '@mantine/core'
import { CiSearch } from 'react-icons/ci'
import { FaRegBell } from 'react-icons/fa'
import ProfileUser from '../auth/ProfileUser'

const HeaderAdmin = () => {
  const headerName = useAppSelector((state) => state.theNavigation.active)

  return (
    <div className="flex items-center justify-between h-full">
      <div className="text-[18px] font-semibold capitalize text-[#18181b]">{headerName}</div>
      <div className="flex items-center gap-3">
        <TextInput placeholder="Search..." size="xs" leftSection={<CiSearch size={14} />} w={220} />
        <FaRegBell size={15} className="text-muted-foreground" />
        <ProfileUser position="right" />
      </div>
    </div>
  )
}

export default HeaderAdmin
