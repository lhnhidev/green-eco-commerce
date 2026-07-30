import { getGetCartQueryKey, useAddCartItem, useGetProductsByIds } from '@api'
import { removeFromCompare } from '@components/features/compare/compare.slice'
import Container from '@components/ui/primitives/Container'
import EmptyState from '@components/ui/primitives/EmptyState'
import PageHeader from '@components/ui/primitives/PageHeader'
import Panel from '@components/ui/primitives/Panel'
import PriceTag from '@components/ui/primitives/PriceTag'
import Seo from '@components/ui/Seo'
import Loading from '@components/ui/status/Loading'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Button, Rating } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ScalesIcon, ShoppingCartIcon, TrashIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Products', href: '/products' },
  { title: 'Compare', href: '/compare' },
]

type SpecProduct = {
  rating: number
  carbonIndex: number
  baselineCarbonIndex: number
  decomposePercent: number
  recyclePercent: number
  stockQty: number
  materials: { id: string; name: string }[]
  price: number
}

const specRows: { label: string; render: (p: SpecProduct) => ReactNode }[] = [
  { label: 'Price', render: (p) => <PriceTag value={p.price} size="sm" /> },
  { label: 'Rating', render: (p) => <Rating value={p.rating} fractions={2} readOnly size="sm" /> },
  { label: 'Carbon Footprint', render: (p) => `${p.carbonIndex} kg CO₂e` },
  { label: 'Baseline (conventional)', render: (p) => `${p.baselineCarbonIndex} kg CO₂e` },
  {
    label: 'CO₂ Saved',
    render: (p) => `${Math.max(0, p.baselineCarbonIndex - p.carbonIndex).toFixed(2)} kg`,
  },
  { label: 'Decompose %', render: (p) => `${p.decomposePercent}%` },
  { label: 'Recycle %', render: (p) => `${p.recyclePercent}%` },
  { label: 'Stock', render: (p) => (p.stockQty > 0 ? `${p.stockQty} available` : 'Out of stock') },
  { label: 'Materials', render: (p) => p.materials.map((m) => m.name).join(', ') || '—' },
]

const ComparePage = () => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const productIds = useAppSelector((state) => state.compare.productIds)

  const { data: products, isLoading } = useGetProductsByIds(
    { ids: productIds },
    { query: { enabled: productIds.length > 0 } },
  )

  const { mutate: addToCart } = useAddCartItem({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
      },
    },
  })

  const handleAddToCart = (productId: string, name: string) => {
    addToCart(
      { data: { productId, quantity: 1 } },
      {
        onSuccess: () =>
          notifications.show({
            title: 'Added to cart!',
            message: `${name} has been added to your cart.`,
            color: 'green',
          }),
      },
    )
  }

  return (
    <Container className="py-6">
      <Seo title="Compare Products" description="Compare eco-friendly products side by side." />
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        icon={ScalesIcon}
        iconClassName="text-xl text-primary"
        title="Compare Products"
      />

      {isLoading ? (
        <Loading text="Loading products…" />
      ) : !products || products.length === 0 ? (
        <EmptyState
          icon={ScalesIcon}
          color="gray"
          title="Nothing to compare yet"
          description="Add 2 or more products from the catalog to compare their specs side by side."
          action={
            <Button component={Link} to="/products" variant="light" mt="sm">
              Browse Products
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-175">
            <thead>
              <tr>
                <th className="text-left p-3 w-40 text-2xs font-semibold uppercase tracking-wide text-gray-400 align-bottom">
                  Spec
                </th>
                {products.map((p) => (
                  <th key={p.id} className="p-3 text-left align-bottom min-w-48">
                    <Panel padding="md" className="flex flex-col gap-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => dispatch(removeFromCompare(p.id))}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          aria-label="Remove from compare"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                      <Link to={`/products/${p.id}`}>
                        <img
                          src={resolveImageUrl(p.imageUrl.at(0)) || '/placeholder.png'}
                          alt={p.name}
                          className="w-full aspect-[4/3] object-cover rounded-md bg-gray-50"
                        />
                      </Link>
                      <Link
                        to={`/products/${p.id}`}
                        className="font-medium text-sm text-gray-900 hover:text-primary line-clamp-2"
                      >
                        {p.name}
                      </Link>
                      <Button
                        size="xs"
                        leftSection={<ShoppingCartIcon size={13} />}
                        disabled={p.stockQty <= 0}
                        onClick={() => handleAddToCart(p.id, p.name)}
                      >
                        Add to Cart
                      </Button>
                    </Panel>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specRows.map((row) => (
                <tr key={row.label} className="border-t border-border">
                  <td className="p-3 text-sm font-medium text-gray-600">{row.label}</td>
                  {products.map((p) => (
                    <td key={p.id} className="p-3 text-sm text-gray-700">
                      {row.render(p)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  )
}

export default ComparePage
