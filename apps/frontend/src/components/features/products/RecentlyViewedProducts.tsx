import { useGetProductsByIds } from '@api'
import { useAppSelector } from '@hooks/useAppSelector'
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import ProductGrid from '@components/ui/primitives/ProductGrid'
import SectionHeading from '@components/ui/primitives/SectionHeading'
import ProductCard from './ProductCard'

const RecentlyViewedProducts = ({ excludeProductId }: { excludeProductId?: string }) => {
  const productIds = useAppSelector((state) => state.recentlyViewed.productIds)
  const idsToShow = productIds.filter((id) => id !== excludeProductId)

  const { data: products } = useGetProductsByIds({ ids: idsToShow }, { query: { enabled: idsToShow.length > 0 } })

  if (idsToShow.length === 0 || !products || products.length === 0) return null

  // Preserve most-recently-viewed-first order — the batch endpoint doesn't guarantee it.
  const ordered = idsToShow.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined)

  return (
    <div className="mb-section">
      <SectionHeading icon={ClockCounterClockwiseIcon} size="md" className="mb-4">
        Recently Viewed
      </SectionHeading>
      <ProductGrid variant="showcase">
        {ordered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductGrid>
    </div>
  )
}

export default RecentlyViewedProducts
