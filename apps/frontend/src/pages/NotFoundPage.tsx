import { Button } from '@mantine/core'
import { HouseIcon, MagnifyingGlassIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

const NotFoundPage = () => {
  return (
    <div className="min-h-150 flex flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-7xl font-black text-primary/20 mb-2">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page not found</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex gap-3">
        <Button component={Link} to="/" color="primary" radius="xl" leftSection={<HouseIcon size={16} />}>
          Back to Home
        </Button>
        <Button
          component={Link}
          to="/products"
          variant="light"
          color="primary"
          radius="xl"
          leftSection={<MagnifyingGlassIcon size={16} />}
        >
          Browse Products
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
