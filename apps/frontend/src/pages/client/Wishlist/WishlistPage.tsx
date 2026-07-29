import { getGetWishlistQueryKey, useGetWishlist, useRemoveFromWishlist } from '@api'
import ProductCard from '@components/features/products/ProductCardv2.tsx'
import Loading from '@components/ui/status/Loading'
import { Anchor, Breadcrumbs, Button, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { HeartIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Favorites', href: '/favorite-products' },
].map((item) => (
  <Anchor href={item.href} key={item.href} size="sm">
    {item.title}
  </Anchor>
))

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
      <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

      <div className="flex items-center gap-3 mb-6">
        <HeartIcon className="text-2xl text-rose-500" />
        <Title order={2}>My Wishlist</Title>
        <span className="text-sm text-gray-400 mt-1">({products?.length ?? 0} items)</span>
      </div>

      {!products?.length ? (
        <div className="flex flex-col items-center py-24 gap-4 text-gray-400">
          <HeartIcon size={48} className="text-rose-200" />
          <Text size="lg" fw={500}>
            Your wishlist is empty
          </Text>
          <Text size="sm">Save products you love to view them here.</Text>
          <Button component={Link} to="/products" variant="light" color="green" mt="md">
            Browse Products
          </Button>
        </div>
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
