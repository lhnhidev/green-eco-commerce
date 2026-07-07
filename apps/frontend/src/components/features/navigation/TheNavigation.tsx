import { FaHome, FaUser } from 'react-icons/fa'
import { FaTableCells } from 'react-icons/fa6'
import { IoIosDocument, IoIosSettings } from 'react-icons/io'
import { IoReceipt } from 'react-icons/io5'
import { MdCategory } from 'react-icons/md'
import { TbCategory } from 'react-icons/tb'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import Brand from '../../ui/Brand'
import NavigationIndex from './NavigationIndex'
import { type ActiveType, setActive } from './navigation.slice'

const navigateMems = [
  {
    id: 'dashboard',
    icon: FaHome,
    text: 'Dashboard',
  },
  {
    id: 'category',
    icon: MdCategory,
    text: 'Category',
  },
  {
    id: 'material',
    icon: TbCategory,
    text: 'Material',
  },
  {
    id: 'order',
    icon: IoReceipt,
    text: 'Order',
  },
  {
    id: 'user',
    icon: FaUser,
    text: 'User',
  },
  {
    id: 'document',
    icon: IoIosDocument,
    text: 'Document',
  },
  {
    id: 'analyst',
    icon: FaTableCells,
    text: 'Analyst',
  },
]

const TheNavigation = () => {
  const dispatch = useAppDispatch()
  const active = useAppSelector((state) => state.theNavigation.active)

  return (
    <div className="w-75 flex flex-col flex- bg-(--color-background) border-r border-r-[#e5e7e0] h-screen px-4 py-5">
      <div className="flex justify-center mb-6">
        <Brand linkToHome={true} size="lg" />
      </div>
      <div className="flex flex-col gap-2">
        {navigateMems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dispatch(setActive(item.id as ActiveType))}
            className="w-full text-left"
          >
            <NavigationIndex icon={item.icon} text={item.text} isActive={active === item.id} />
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <button type="button" onClick={() => dispatch(setActive('setting'))} className="w-full text-left">
          <NavigationIndex icon={IoIosSettings} text="Setting" isActive={active === 'setting'} />
        </button>
      </div>
    </div>
  )
}

export default TheNavigation
