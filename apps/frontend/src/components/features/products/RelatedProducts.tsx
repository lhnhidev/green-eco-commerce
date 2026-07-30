import { useGetRelatedProducts } from '@api'
import ProductCard from '@components/features/products/ProductCard'
import ProductGrid from '@components/ui/primitives/ProductGrid'
import SectionHeading from '@components/ui/primitives/SectionHeading'
import { Skeleton } from '@mantine/core'
import { LeafIcon } from '@phosphor-icons/react'

type Props = {
  productId: string
  categoryId?: string
}

const RelatedProducts = ({ productId }: Props) => {
  const { data: products, isLoading } = useGetRelatedProducts(productId, { limit: 8 })

  if (isLoading) {
    return (
      <div className="mt-section">
        <SectionHeading icon={LeafIcon} size="md" className="mb-4">
          Related Products
        </SectionHeading>
        <ProductGrid variant="showcase">
          {Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader, static count
            <Skeleton key={i} height={240} radius="md" />
          ))}
        </ProductGrid>
      </div>
    )
  }

  if (!products?.length) return null

  return (
    <div className="mt-section">
      <SectionHeading
        icon={LeafIcon}
        size="md"
        description={`${products.length} more in this category`}
        className="mb-4"
      >
        Related Eco Products
      </SectionHeading>
      <ProductGrid variant="showcase">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </div>
  )
}

export default RelatedProducts
