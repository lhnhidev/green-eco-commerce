import { useGetProductsByIds } from '@api'
import { useAppSelector } from '@hooks/useAppSelector'
import { ClockCounterClockwiseIcon } from '@phosphor-icons/react'
import ProductCard from './ProductCard'

const RecentlyViewedProducts = ({ excludeProductId }: { excludeProductId?: string }) => {
  const productIds = useAppSelector((state) => state.recentlyViewed.productIds)
  const idsToShow = productIds.filter((id) => id !== excludeProductId)

  const { data: products } = useGetProductsByIds({ ids: idsToShow }, { query: { enabled: idsToShow.length > 0 } })

  if (idsToShow.length === 0 || !products || products.length === 0) return null

  // Preserve most-recently-viewed-first order — the batch endpoint doesn't guarantee it.
  const ordered = idsToShow.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined)

  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <ClockCounterClockwiseIcon className="text-2xl text-primary" />
        <h2 className="text-xl font-bold text-gray-800">Recently Viewed</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {ordered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default RecentlyViewedProducts
