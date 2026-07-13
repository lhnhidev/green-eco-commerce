import { useAppSelector } from '@hooks/useAppSelector'
import { TextInput } from '@mantine/core'
import { CiSearch } from 'react-icons/ci'
import { FaRegBell } from 'react-icons/fa'
import ProfileUser from '../auth/ProfileUser'

const HeaderAdmin = () => {
  const headerName = useAppSelector((state) => state.theNavigation.active)

  return (
    <div className="text-2xl flex justify-between tracking-widest uppercase font-bold text-primary">
      <div>{headerName}</div>
      <div className="flex items-center gap-4">
        <div className="font-normal w-100 mr-10">
          <TextInput
            placeholder="Search your key work here..."
            leftSection={<CiSearch />}
            classNames={{ input: '!pl-12' }}
          />
        </div>
        <div>
          <FaRegBell />
        </div>
        <div className="font-normal text-gray-800">|</div>
        <div className="font-normal">
          <ProfileUser position="right" />
        </div>
      </div>
    </div>
  )
}

export default HeaderAdmin
