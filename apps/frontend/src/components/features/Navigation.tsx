/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */

import { useGetCart, useGetAllProducts } from '@api'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { Badge, Button, Group, TextInput, Loader } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Brand from '../ui/Brand'
import ProfileUser from './auth/ProfileUser'
import { setIsShow } from './cart/cart.slice'

const navigationItems = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/payment', label: 'Payment' },
  { path: '/support', label: 'Support' },
]

const SearchAutocomplete = ({ className }: { className?: string }) => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch] = useDebouncedValue(searchValue, 300)
  const [isFocused, setIsFocused] = useState(false)

  const { data: searchData, isLoading: isSearching } = useGetAllProducts(
    { Search: debouncedSearch, PageSize: 5 },
    { query: { enabled: debouncedSearch.trim().length > 0 } }
  )

  const handleSearch = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`)
      setIsFocused(false)
    }
  }

  const showDropdown = isFocused && searchValue.trim().length > 0

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className='w-full'>
        <TextInput
          placeholder="Search products..."
          leftSection={<MagnifyingGlassIcon className="h-4 w-4" />}
          radius="xl"
          className="w-full"
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-100 flex flex-col max-h-96">
          {isSearching && (
            <div className="p-4 flex justify-center"><Loader size="sm" color="green" /></div>
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
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <img
                    src={product.imageUrl?.[0] || '/placeholder.png'}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-md bg-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-gray-900 truncate">{product.name}</div>
                    <div className="text-primary text-xs font-bold">
                      ${product.price}
                    </div>
                  </div>
                </Link>
              ))}
              <div
                className="p-3 text-center text-sm font-bold text-primary hover:bg-green-50 cursor-pointer border-t border-gray-100"
                onClick={() => {
                  navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`)
                  setIsFocused(false)
                }}
              >
                View all results
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function Navigation() {
  const location = useLocation()
  const dispatch = useAppDispatch()

  const isActive = (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path))

  const { data } = useGetCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 shadow-sm bg-white/80 backdrop-blur-md supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Brand linkToHome={true} size="md" />
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'filled' : 'subtle'}
                  color="primary.8"
                  radius="xl"
                  className="transition-all hover:scale-105"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <SearchAutocomplete className="hidden md:flex flex-1 mx-4" />

          {/* User Actions */}
          <Group gap="xs">
            <ProfileUser />
            <div className="relative">
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                radius="xl"
                onClick={() => dispatch(setIsShow(true))}
                leftSection={<ShoppingCartIcon className="h-4 w-4" />}
              >
                <span className="hidden sm:inline">Cart</span>
              </Button>
              {data?.items?.length === undefined ? (
                <div></div>
              ) : (
                <Badge size="sm" circle color="primary.8" className="absolute -top-2 -right-2 shadow-md animate-pulse">
                  {data?.items?.length}
                </Badge>
              )}
            </div>
          </Group>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <SearchAutocomplete className="mb-4" />
          <nav className="flex items-center gap-2 overflow-x-auto">
            {navigationItems.map((item) => (
              <Link to={item.path} key={item.path}>
                <Button
                  variant={isActive(item.path) ? 'filled' : 'subtle'}
                  color="primary.8"
                  size="xs"
                  radius="xl"
                  className="transition-all"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

