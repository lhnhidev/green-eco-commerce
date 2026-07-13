import Brand from '@components/ui/Brand'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { FaHome, FaUser } from 'react-icons/fa'
import { FaTableCells } from 'react-icons/fa6'
import { IoIosDocument, IoIosSettings } from 'react-icons/io'
import { IoReceipt } from 'react-icons/io5'
import { MdCategory } from 'react-icons/md'
import { TbCategory } from 'react-icons/tb'
import { Link } from 'react-router'
import NavigationIndex from './NavigationIndex'
import { type ActiveType, setActive } from './navigation.slice'

const navigateMems = [
  {
    id: 'dashboard',
    icon: FaHome,
    text: 'Dashboard',
  },
  {
    id: 'product',
    icon: MdCategory,
    text: 'Product',
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
    <div className="w-64 flex flex-col bg-white border-r border-primary/10 shadow-sm h-screen px-4 py-6 z-10">
      <div className="flex justify-center mb-8">
        <Brand linkToHome={true} size="lg" />
      </div>
      <div className="flex flex-col gap-2">
        {navigateMems.map((item) => (
          <Link
            to={`${item.id}`}
            key={item.id}
            onClick={() => dispatch(setActive(item.id as ActiveType))}
            className="w-full text-left"
          >
            <NavigationIndex icon={item.icon} text={item.text} isActive={active.toLocaleLowerCase() === item.id} />
          </Link>
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
