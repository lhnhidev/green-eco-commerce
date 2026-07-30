import { toggleDesktopSidebar, toggleMobileSidebar } from '@components/features/navigation/navigation.slice'
import NotificationBell from '@components/features/notifications/NotificationBell'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { AppShell, Burger } from '@mantine/core'
import { Spotlight, type SpotlightActionData, spotlight } from '@mantine/spotlight'
import {
  ChatCircleTextIcon,
  FilesIcon,
  GearIcon,
  HouseIcon,
  ImageIcon,
  MagnifyingGlassIcon,
  ReceiptIcon,
  SealPercentIcon,
  SquaresFourIcon,
  StackIcon,
  TableIcon,
  UserIcon,
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import ProfileUser from '../auth/ProfileUser'

const buildActions = (navigate: ReturnType<typeof useNavigate>): SpotlightActionData[] => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    leftSection: <HouseIcon size={16} />,
    onClick: () => navigate('/admin/dashboard'),
  },
  { id: 'product', label: 'Products', leftSection: <TableIcon size={16} />, onClick: () => navigate('/admin/product') },
  {
    id: 'category',
    label: 'Categories',
    leftSection: <SquaresFourIcon size={16} />,
    onClick: () => navigate('/admin/category'),
  },
  {
    id: 'material',
    label: 'Materials',
    leftSection: <StackIcon size={16} />,
    onClick: () => navigate('/admin/material'),
  },
  { id: 'banner', label: 'Banners', leftSection: <ImageIcon size={16} />, onClick: () => navigate('/admin/banner') },
  { id: 'order', label: 'Orders', leftSection: <ReceiptIcon size={16} />, onClick: () => navigate('/admin/order') },
  {
    id: 'coupon',
    label: 'Coupons',
    leftSection: <SealPercentIcon size={16} />,
    onClick: () => navigate('/admin/coupon'),
  },
  { id: 'user', label: 'Users', leftSection: <UserIcon size={16} />, onClick: () => navigate('/admin/user') },
  {
    id: 'review',
    label: 'Reviews',
    leftSection: <ChatCircleTextIcon size={16} />,
    onClick: () => navigate('/admin/review'),
  },
  {
    id: 'document',
    label: 'Documents',
    leftSection: <FilesIcon size={16} />,
    onClick: () => navigate('/admin/document'),
  },
  {
    id: 'settings',
    label: 'Settings',
    leftSection: <GearIcon size={16} />,
    onClick: () => navigate('/admin/settings'),
  },
]

const HeaderAdmin = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  return (
    <AppShell.Header px="md" className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <Burger hiddenFrom="sm" onClick={() => dispatch(toggleMobileSidebar())} aria-label="Toggle sidebar" />
        <Burger
          visibleFrom="sm"
          onClick={() => dispatch(toggleDesktopSidebar())}
          aria-label="Toggle sidebar"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => spotlight.open()}
          className="hidden sm:flex items-center gap-2 h-8 px-3 w-[200px] rounded-md border border-border text-xs text-muted-foreground hover:border-border-strong transition-colors"
        >
          <MagnifyingGlassIcon size={14} />
          Search...
          <span className="ml-auto text-2xs">Ctrl+K</span>
        </button>
        <Spotlight actions={buildActions(navigate)} shortcut={['mod + K']} nothingFound="No pages found" />
        <NotificationBell />
        <ProfileUser position="right" />
      </div>
    </AppShell.Header>
  )
}

export default HeaderAdmin
