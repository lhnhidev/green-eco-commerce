import Brand from '@components/ui/Brand'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { AppShell, Burger } from '@mantine/core'
import {
  ChatCircleTextIcon,
  FilesIcon,
  GearIcon,
  HouseIcon,
  ImageIcon,
  ReceiptIcon,
  SealPercentIcon,
  SquaresFourIcon,
  StackIcon,
  TableIcon,
  UserIcon,
} from '@phosphor-icons/react'
import type * as React from 'react'
import { NavLink } from 'react-router'
import NavigationIndex from './NavigationIndex'
import { closeMobileSidebar } from './navigation.slice'

type NavItem = {
  to: string
  icon: React.ComponentType<{ className?: string; size?: number }>
  text: string
}

const navSections: { label: string; items: NavItem[] }[] = [
  {
    label: 'Overview',
    items: [{ to: '/admin/dashboard', icon: HouseIcon, text: 'Dashboard' }],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/admin/product', icon: TableIcon, text: 'Products' },
      { to: '/admin/category', icon: SquaresFourIcon, text: 'Categories' },
      { to: '/admin/material', icon: StackIcon, text: 'Materials' },
      { to: '/admin/banner', icon: ImageIcon, text: 'Banners' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { to: '/admin/order', icon: ReceiptIcon, text: 'Orders' },
      { to: '/admin/coupon', icon: SealPercentIcon, text: 'Coupons' },
    ],
  },
  {
    label: 'Customers',
    items: [
      { to: '/admin/user', icon: UserIcon, text: 'Users' },
      { to: '/admin/review', icon: ChatCircleTextIcon, text: 'Reviews' },
    ],
  },
  {
    label: 'Knowledge',
    items: [{ to: '/admin/document', icon: FilesIcon, text: 'Documents' }],
  },
]

const SidebarContent = () => {
  const dispatch = useAppDispatch()
  const mobileSidebarOpen = useAppSelector((state) => state.theNavigation.mobileSidebarOpen)

  return (
    <AppShell.Navbar p="sm">
      <div className="flex mb-4 px-1">
        <Burger opened={mobileSidebarOpen} onClick={() => dispatch(closeMobileSidebar())} hiddenFrom="sm" size="sm" />
        <Brand linkToHome size="sm" />
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="text-2xs uppercase tracking-wide text-fg-subtle px-2 pt-1 pb-1 font-semibold">
              {section.label}
            </p>
            <div className="flex flex-col gap-px">
              {section.items.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => dispatch(closeMobileSidebar())} className="block">
                  {({ isActive }) => <NavigationIndex icon={item.icon} text={item.text} isActive={isActive} />}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1.5 border-t border-border">
        <NavLink to="/admin/settings" onClick={() => dispatch(closeMobileSidebar())} className="block">
          {({ isActive }) => <NavigationIndex icon={GearIcon} text="Settings" isActive={isActive} />}
        </NavLink>
      </div>
    </AppShell.Navbar>
  )
}

export default SidebarContent
