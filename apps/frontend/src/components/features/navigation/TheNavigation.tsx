/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */

import Brand from '@components/ui/Brand'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { AppShell, Burger } from '@mantine/core'
import {
  FilesIcon,
  GearIcon,
  GridNineIcon,
  HouseIcon,
  ImageIcon,
  ReceiptIcon,
  SealPercentIcon,
  TableIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { MdCategory } from 'react-icons/md'
import { TbCategory, TbMessageStar } from 'react-icons/tb'
import { Link } from 'react-router'
import NavigationIndex from './NavigationIndex'
import { type ActiveType, closeMobileSidebar, setActive } from './navigation.slice'

const navigateMems = [
  {
    id: 'dashboard',
    icon: HouseIcon,
    text: 'Dashboard',
  },
  {
    id: 'product',
    icon: TableIcon,
    text: 'Products',
  },
  {
    id: 'category',
    icon: MdCategory,
    text: 'Category',
  },
  {
    id: 'user',
    icon: UserIcon,
    text: 'User',
  },
  {
    id: 'order',
    icon: ReceiptIcon,
    text: 'Orders',
  },
  {
    id: 'material',
    icon: TbCategory,
    text: 'Material',
  },
  {
    id: 'review',
    icon: TbMessageStar,
    text: 'Reviews',
  },
  {
    id: 'coupon',
    icon: SealPercentIcon,
    text: 'Coupons',
  },
  {
    id: 'banner',
    icon: ImageIcon,
    text: 'Banners',
  },
  {
    id: 'document',
    icon: FilesIcon,
    text: 'Document',
  },
  {
    id: 'analyst',
    icon: GridNineIcon,
    text: 'Analyst',
  },
]

const SidebarContent = () => {
  const dispatch = useAppDispatch()
  const active = useAppSelector((state) => state.theNavigation.active)
  const mobileSidebarOpen = useAppSelector((state) => state.theNavigation.mobileSidebarOpen)

  return (
    <AppShell.Navbar p="md">
      <div className="flex mb-4">
        <Burger opened={mobileSidebarOpen} onClick={() => dispatch(closeMobileSidebar())} hiddenFrom="sm" size="sm" />
        <Brand linkToHome={true} size="md" />
      </div>
      <div className="flex flex-col gap-px">
        {navigateMems.map((item) => (
          <Link
            to={`${item.id}`}
            key={item.id}
            onClick={() => {
              dispatch(setActive(item.id as ActiveType))
              dispatch(closeMobileSidebar())
            }}
            className="w-full text-left"
          >
            <NavigationIndex icon={item.icon} text={item.text} isActive={active.toLocaleLowerCase() === item.id} />
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-1.5 border-t border-[#ececee]">
        <button
          type="button"
          onClick={() => {
            dispatch(setActive('setting'))
          }}
          className="w-full text-left"
        >
          <NavigationIndex icon={GearIcon} text="Setting" isActive={active === 'setting'} />
        </button>
      </div>
    </AppShell.Navbar>
  )
}

export default SidebarContent
