import { invalidateGetWishlist, useGetWishlist, useRemoveFromWishlist } from '@api'
import ProductCard from '@components/features/products/ProductCard'
import Container from '@components/ui/primitives/Container'
import EmptyState from '@components/ui/primitives/EmptyState'
import PageHeader from '@components/ui/primitives/PageHeader'
import ProductGrid from '@components/ui/primitives/ProductGrid'
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
        await invalidateGetWishlist(queryClient)
        notifications.show({ title: 'Removed', message: 'Product removed from wishlist.', color: 'green' })
      },
    },
  })

  if (isLoading) return <Loading text="Loading your wishlist..." />

  return (
    <Container className="py-6">
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        icon={HeartIcon}
        iconClassName="text-xl text-rose-500"
        title="My Wishlist"
        suffix={<span className="text-sm text-gray-400">({products?.length ?? 0} items)</span>}
      />

      {!products?.length ? (
        <EmptyState
          icon={HeartIcon}
          color="rose"
          title="Your wishlist is empty"
          description="Save products you love to view them here."
          action={
            <Button component={Link} to="/products" variant="light" mt="sm">
              Browse Products
            </Button>
          }
        />
      ) : (
        <ProductGrid variant="showcase">
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
        </ProductGrid>
      )}
    </Container>
  )
}

export default WishlistPage
