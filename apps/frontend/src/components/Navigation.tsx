import { Badge, Button, Group, TextInput } from '@mantine/core'
import { LeafIcon, MagnifyingGlassIcon, ShoppingCartIcon, UserIcon } from '@phosphor-icons/react'
import { useLocation } from 'wouter'
import { useCart } from '../context/CartContext'

const navigationItems = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/remedies', label: 'Remedies' },
]

export function Navigation() {
  const [location, navigate] = useLocation()
  const { cartItems } = useCart()

  const isActive = (path: string) => (path === '/' ? location === '/' : location.startsWith(path))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <LeafIcon className="h-5 w-5 text-white" weight="fill" />
            </div>
            <span className="text-xl font-semibold text-primary">GreenCart</span>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? 'filled' : 'subtle'}
                color="green.9"
                radius="xl"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <TextInput
              placeholder="Search plants..."
              leftSection={<MagnifyingGlassIcon className="h-4 w-4" />}
              radius="xl"
              className="w-full"
            />
          </div>

          {/* User Actions */}
          <Group gap="xs">
            <Button
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => navigate('/auth')}
              radius="xl"
              leftSection={<UserIcon className="h-4 w-4" />}
            >
              <span className="hidden sm:inline">Login</span>
            </Button>
            <div className="relative">
              <Button
                variant="subtle"
                color="gray"
                size="sm"
                onClick={() => navigate('/cart')}
                radius="xl"
                leftSection={<ShoppingCartIcon className="h-4 w-4" />}
              >
                <span className="hidden sm:inline">Cart</span>
              </Button>
              {cartItems.length > 0 && (
                <Badge size="sm" circle color="green.9" className="absolute -top-2 -right-2">
                  {cartItems.length}
                </Badge>
              )}
            </div>
          </Group>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <TextInput
            placeholder="Search plants..."
            leftSection={<MagnifyingGlassIcon className="h-4 w-4" />}
            radius="xl"
            className="mb-4"
          />
          <nav className="flex items-center gap-2 overflow-x-auto">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? 'filled' : 'subtle'}
                color="green.9"
                size="xs"
                onClick={() => navigate(item.path)}
                radius="xl"
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
