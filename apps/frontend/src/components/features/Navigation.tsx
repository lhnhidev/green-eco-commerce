/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
import { Badge, Button, Group, TextInput } from '@mantine/core'
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@phosphor-icons/react'
import { Link, useLocation } from 'react-router'
import Brand from '../ui/Brand'
import ProfileUser from './auth/ProfileUser'

const navigationItems = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/remedies', label: 'Remedies' },
]

export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Brand linkToHome={true} size="md" />
          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button variant={isActive(item.path) ? 'filled' : 'subtle'} color="green.9" radius="xl">
                  {item.label}
                </Button>
              </Link>
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
            <ProfileUser />
            <div className="relative">
              <Link to="/cart">
                <Button
                  variant="subtle"
                  color="gray"
                  size="sm"
                  radius="xl"
                  leftSection={<ShoppingCartIcon className="h-4 w-4" />}
                >
                  <span className="hidden sm:inline">Cart</span>
                </Button>
              </Link>
              <Badge size="sm" circle color="green.9" className="absolute -top-2 -right-2">
                1
              </Badge>
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
              <Link to={item.path} key={item.path}>
                <Button
                  variant={isActive(item.path) ? 'filled' : 'subtle'}
                  color="green.9"
                  size="xs"
                  // onClick={() => navigate(item.path)}
                  radius="xl"
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
