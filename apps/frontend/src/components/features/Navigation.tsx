import { useGetAllProducts, useGetCart, useGetWishlist } from '@api'
import CategoryMenu from '@components/features/categories/CategoryMenu'
import NotificationBell from '@components/features/notifications/NotificationBell'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useAuth } from '@hooks/useAuth'
import { Badge, Loader, TextInput } from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { HeartIcon, ListIcon, MagnifyingGlassIcon, ShoppingCartIcon, XIcon } from '@phosphor-icons/react'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import type * as React from 'react'
import { Fragment, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Brand from '../ui/Brand'
import ProfileUser from './auth/ProfileUser'
import { setIsShow } from './cart/cart.slice'

const navigationItems = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/my-orders', label: 'Orders' },
  { path: '/green-wallet', label: 'Wallet' },
]

// ─── Search autocomplete ─────────────────────────────────────────────────────

const SearchAutocomplete = ({ className, onSelect }: { className?: string; onSelect?: () => void }) => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchValue, 300)
  const [isFocused, setIsFocused] = useState(false)

  const { data: searchData, isLoading: isSearching } = useGetAllProducts(
    { search: debouncedSearch, pageSize: 5 },
    { query: { enabled: debouncedSearch.trim().length > 0 } },
  )

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`)
      setIsFocused(false)
      onSelect?.()
    }
  }

  const showDropdown = isFocused && searchValue.trim().length > 0

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="w-full">
        <TextInput
          placeholder="Search eco products…"
          leftSection={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
          radius="xl"
          size="sm"
          className="w-full"
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          classNames={{
            input: 'bg-gray-50 border-gray-200 focus:border-green-400 focus:ring-1 focus:ring-green-400/20 text-sm',
          }}
        />
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[200] flex flex-col max-h-96">
          {isSearching && (
            <div className="p-4 flex justify-center">
              <Loader size="sm" color="green" />
            </div>
          )}
          {!isSearching && searchData?.items && searchData.items.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">No products found</div>
          )}
          {!isSearching && searchData?.items && searchData.items.length > 0 && (
            <div className="overflow-y-auto">
              {searchData.items.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  onClick={() => {
                    setIsFocused(false)
                    onSelect?.()
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <img
                    src={resolveImageUrl(product.imageUrl?.[0]) || '/placeholder.png'}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">{product.name}</div>
                    <div className="text-green-700 text-xs font-bold">{formatCurrency(product.price)}</div>
                  </div>
                </Link>
              ))}
              <button
                type="button"
                className="w-full p-3 text-center text-xs font-bold text-green-700 hover:bg-green-50 border-t border-gray-100 transition-colors"
                onClick={() => {
                  navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`)
                  setIsFocused(false)
                  onSelect?.()
                }}
              >
                View all results →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Navigation ─────────────────────────────────────────────────────────

export function Navigation() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const cartIsOpen = useAppSelector((state) => state.cart.isShow)
  const [mobileOpen, { toggle: toggleMobile, close: closeMobile }] = useDisclosure(false)
  const { user } = useAuth()

  const { data: cartData } = useGetCart()
  const cartCount = cartData?.items?.length ?? 0

  const { data: wishlistData } = useGetWishlist({ query: { enabled: !!user } })
  const wishlistCount = wishlistData?.length ?? 0

  const isActive = (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path))

  return (
    <>
      {/* ── Sticky header bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          {/* Brand */}
          <Link to="/" className="shrink-0">
            <Brand linkToHome={false} size="md" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-2">
            {navigationItems.map((item, index) => (
              <Fragment key={item.path}>
                <Link
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 ${
                    isActive(item.path)
                      ? 'bg-green-700 text-white shadow-sm shadow-green-500/30'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  {item.label}
                </Link>
                {index === 0 && <CategoryMenu />}
              </Fragment>
            ))}
          </nav>

          {/* Search — desktop: flexible, tablet: narrower */}
          <div className="hidden sm:block flex-1 lg:max-w-sm xl:max-w-md ml-auto">
            <SearchAutocomplete />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto sm:ml-3">
            {/* Wishlist button */}
            {user && (
              <Link
                to="/favorite-products"
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
                aria-label="View wishlist"
              >
                <HeartIcon size={20} />
                {wishlistCount > 0 && (
                  <Badge
                    size="xs"
                    circle
                    color="red"
                    className="absolute -top-0.5 -right-0.5 shadow-sm text-[9px] min-w-4 h-4"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </Badge>
                )}
              </Link>
            )}

            {/* Cart button */}
            <button
              type="button"
              onClick={() => dispatch(setIsShow(!cartIsOpen))}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-green-700 hover:bg-green-50 transition-all active:scale-95"
              aria-label="Open cart"
            >
              <ShoppingCartIcon size={20} />
              {cartCount > 0 && (
                <Badge
                  size="xs"
                  circle
                  color="primary.8"
                  className="absolute -top-0.5 -right-0.5 shadow-sm text-[9px] min-w-4 h-4"
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </Badge>
              )}
            </button>

            {/* Notifications */}
            {user && <NotificationBell />}

            {/* Profile */}
            <ProfileUser />

            {/* Hamburger — mobile/tablet */}
            <button
              type="button"
              onClick={toggleMobile}
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-green-700 hover:bg-green-50 transition-all active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <XIcon /> : <ListIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer backdrop ─────────────────────────────────── */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-49 bg-black/30 backdrop-blur-[1px] lg:hidden cursor-default"
          onClick={closeMobile}
        />
      )}

      {/* ── Mobile/tablet slide-down menu ─────────────────────────── */}
      <div
        className={`
          fixed top-16 left-0 right-0 z-50
          bg-white border-b border-gray-100 shadow-xl
          transform transition-all duration-250 ease-out
          lg:hidden
          ${mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-4 opacity-0 pointer-events-none'}
        `}
      >
        <div className="container mx-auto px-4 pb-5 pt-4 flex flex-col gap-4">
          {/* Mobile search */}
          <SearchAutocomplete onSelect={closeMobile} />

          {/* Mobile nav links */}
          <nav className="flex flex-col gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-700 text-white'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
