import { useGetRelatedProducts } from '@api'
import ProductCardv2 from '@components/features/products/ProductCardv2'
import { Skeleton, Text, Title } from '@mantine/core'
import { LeafIcon } from '@phosphor-icons/react'

type Props = {
  productId: string
  categoryId?: string
}

const RelatedProducts = ({ productId }: Props) => {
  const { data: products, isLoading } = useGetRelatedProducts(productId, { limit: 8 })

  if (isLoading) {
    return (
      <div className="mt-12">
        <Title order={3} mb="md">
          Related Products
        </Title>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton key
            <Skeleton key={i} height={280} radius="md" />
          ))}
        </div>
      </div>
    )
  }

  if (!products?.length) return null

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <LeafIcon className="text-green-600 text-2xl" />
        <Title order={3}>Related Eco Products</Title>
        <Text size="sm" c="dimmed" mt={2}>
          ({products.length} more in this category)
        </Text>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCardv2 key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
