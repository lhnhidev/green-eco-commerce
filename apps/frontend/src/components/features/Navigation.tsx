import { useGetAllProducts, useGetCart, useGetWishlist } from '@api'
import CategoryMenu from '@components/features/categories/CategoryMenu'
import NotificationBell from '@components/features/notifications/NotificationBell'
import Container from '@components/ui/primitives/Container'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useAuth } from '@hooks/useAuth'
import { Badge, Loader, TextInput } from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { HeartIcon, ListIcon, MagnifyingGlassIcon, ShoppingCartIcon, XIcon } from '@phosphor-icons/react'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import type * as React from 'react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Brand from '../ui/Brand'
import ProfileUser from './auth/ProfileUser'
import { setIsShow } from './cart/cart.slice'

const navigationItems = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Contact' },
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
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-lg shadow-lg border border-border overflow-hidden z-[200] flex flex-col max-h-96">
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
      <header className="sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur-xl">
        <Container width="wide" className="h-14 flex items-center gap-6">
          {/* Brand */}
          <div className="shrink-0">
            <Brand linkToHome size="sm" />
          </div>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1">
            <CategoryMenu />
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-subtle text-primary'
                    : 'text-gray-600 hover:text-primary hover:bg-green-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex-1" />

          {/* Search — desktop only */}
          <div className="hidden md:block w-[280px]">
            <SearchAutocomplete />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Wishlist button */}
            {user && (
              <Link
                to="/favorite-products"
                className="group relative w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                aria-label="View wishlist"
              >
                <HeartIcon
                  size={20}
                  weight="bold"
                  className="opacity-0 group-hover:opacity-100 absolute text-rose-500 transition-opacity"
                />
                <HeartIcon size={20} className="group-hover:opacity-0 absolute text-gray-500 transition-opacity" />
                {wishlistCount > 0 && (
                  <Badge
                    size="xs"
                    circle
                    color="red"
                    className="absolute -top-1 -right-1 border-2 border-white min-w-5 h-5"
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
              className="group relative w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-green-50 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCartIcon
                size={20}
                weight="bold"
                className="opacity-0 group-hover:opacity-100 absolute text-primary transition-opacity"
              />
              <ShoppingCartIcon size={20} className="group-hover:opacity-0 absolute text-gray-500 transition-opacity" />
              {cartCount > 0 && (
                <Badge
                  size="xs"
                  circle
                  color="primary"
                  className="absolute -top-1 -right-1 border-2 border-white min-w-5 h-5"
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
              className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:text-primary hover:bg-green-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <XIcon size={20} /> : <ListIcon size={20} />}
            </button>
          </div>
        </Container>
      </header>

      {/* ── Mobile drawer backdrop ─────────────────────────────────── */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden cursor-default transition-opacity"
          onClick={closeMobile}
        />
      )}

      {/* ── Mobile/tablet slide-down menu ─────────────────────────── */}
      <div
        className={`
          fixed top-14 left-0 right-0 z-40
          bg-white border-b border-border shadow-lg
          transform transition-all duration-200 ease-in-out origin-top
          lg:hidden
          ${mobileOpen ? 'translate-y-0 opacity-100 pointer-events-auto scale-y-100' : '-translate-y-4 opacity-0 pointer-events-none scale-y-95'}
        `}
      >
        <div className="px-4 pb-5 pt-4 flex flex-col gap-4">
          {/* Mobile search */}
          <SearchAutocomplete onSelect={closeMobile} />

          {/* Mobile nav links */}
          <nav className="flex flex-col gap-1">
            <Link
              to="/products"
              onClick={closeMobile}
              className={`px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                isActive('/products')
                  ? 'bg-primary-subtle text-primary'
                  : 'text-gray-700 hover:bg-green-50 hover:text-primary'
              }`}
            >
              Shop All
            </Link>
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobile}
                className={`px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-subtle text-primary'
                    : 'text-gray-700 hover:bg-green-50 hover:text-primary'
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
