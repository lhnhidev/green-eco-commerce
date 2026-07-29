import { getGetWishlistQueryKey, useGetWishlist, useRemoveFromWishlist } from '@api'
import ProductCard from '@components/features/products/ProductCard'
import EmptyState from '@components/ui/primitives/EmptyState'
import PageHeader from '@components/ui/primitives/PageHeader'
import Loading from '@components/ui/status/Loading'
import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { HeartIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Favorites', href: '/favorite-products' },
]

const WishlistPage = () => {
  const queryClient = useQueryClient()
  const { data: products, isLoading } = useGetWishlist()
  const { mutate: remove, isPending: removing } = useRemoveFromWishlist({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() })
        notifications.show({ title: 'Removed', message: 'Product removed from wishlist.', color: 'green' })
      },
    },
  })

  if (isLoading) return <Loading text="Loading your wishlist..." />

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        icon={HeartIcon}
        iconClassName="text-2xl text-rose-500"
        title="My Wishlist"
        suffix={<span className="text-sm text-gray-400 mt-1">({products?.length ?? 0} items)</span>}
      />

      {!products?.length ? (
        <EmptyState
          icon={HeartIcon}
          color="rose"
          title="Your wishlist is empty"
          description="Save products you love to view them here."
          action={
            <Button component={Link} to="/products" variant="light" color="green" mt="md">
              Browse Products
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <Button
                size="compact-xs"
                color="red"
                variant="light"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                loading={removing}
                onClick={() => remove({ productId: product.id })}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistPage
