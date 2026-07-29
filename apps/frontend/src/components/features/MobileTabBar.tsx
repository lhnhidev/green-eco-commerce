import { useGetCart } from '@api'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAuth } from '@hooks/useAuth'
import { Badge } from '@mantine/core'
import { HeartIcon, HouseIcon, ShoppingCartIcon, StorefrontIcon, UserIcon } from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router'
import { setIsShow } from './cart/cart.slice'

const MobileTabBar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { data: cartData } = useGetCart({ query: { enabled: !!user } })
  const cartCount = cartData?.items?.length ?? 0

  const isActive = (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path))

  const tabs = [
    { key: 'home', label: 'Home', icon: HouseIcon, onClick: () => navigate('/'), active: isActive('/') },
    {
      key: 'shop',
      label: 'Shop',
      icon: StorefrontIcon,
      onClick: () => navigate('/products'),
      active: isActive('/products'),
    },
    {
      key: 'cart',
      label: 'Cart',
      icon: ShoppingCartIcon,
      onClick: () => dispatch(setIsShow(true)),
      active: false,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      key: 'wishlist',
      label: 'Wishlist',
      icon: HeartIcon,
      onClick: () => navigate('/favorite-products'),
      active: isActive('/favorite-products'),
    },
    {
      key: 'account',
      label: 'Account',
      icon: UserIcon,
      onClick: () => navigate(user ? '/profile' : '/auth'),
      active: isActive('/profile'),
    },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.04)] flex items-stretch">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={tab.onClick}
          className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors ${
            tab.active ? 'text-primary' : 'text-gray-400'
          }`}
        >
          <div className="relative">
            <tab.icon size={20} weight={tab.active ? 'fill' : 'regular'} />
            {tab.badge !== undefined && (
              <Badge
                size="xs"
                circle
                color="red"
                className="absolute -top-1.5 -right-2 shadow-sm text-[8px] min-w-4 h-4"
              >
                {tab.badge > 9 ? '9+' : tab.badge}
              </Badge>
            )}
          </div>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default MobileTabBar
