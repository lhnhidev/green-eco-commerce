import { getGetCartQueryKey, useAddCartItem, useGetProductsByIds } from '@api'
import { removeFromCompare } from '@components/features/compare/compare.slice'
import Loading from '@components/ui/status/Loading'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { Anchor, Breadcrumbs, Button, Rating, Text, Title } from '@mantine/core'
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
].map((item) => (
  <Anchor href={item.href} key={item.href} size="sm">
    {item.title}
  </Anchor>
))

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
  { label: 'Price', render: (p) => `$${p.price.toFixed(2)}` },
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
            color: 'green'
          }),
      },
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

      <div className="flex items-center gap-3 mb-6">
        <ScalesIcon className="text-2xl text-primary" weight="fill" />
        <Title order={2}>Compare Products</Title>
      </div>

      {isLoading ? (
        <Loading text="Loading products…" />
      ) : !products || products.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-4 text-gray-400">
          <ScalesIcon size={48} className="text-gray-200" />
          <Text size="lg" fw={500}>
            Nothing to compare yet
          </Text>
          <Text size="sm">Add 2 or more products from the catalog to compare their specs side by side.</Text>
          <Button component={Link} to="/products" variant="light" color="green" mt="md">
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-175">
            <thead>
            <tr>
              <th className="text-left p-3 w-40 text-xs font-bold uppercase tracking-wide text-gray-400 align-bottom">
                Spec
              </th>
              {products.map((p) => (
                <th key={p.id} className="p-3 text-left align-bottom min-w-52">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => dispatch(removeFromCompare(p.id))}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        aria-label="Remove from compare"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                    <Link to={`/products/${p.id}`}>
                      <img
                        src={resolveImageUrl(p.imageUrl.at(0)) || '/placeholder.png'}
                        alt={p.name}
                        className="w-full h-32 object-cover rounded-xl bg-gray-50"
                      />
                    </Link>
                    <Link to={`/products/${p.id}`} className="font-bold text-gray-900 hover:text-primary line-clamp-2">
                      {p.name}
                    </Link>
                    <Button
                      size="xs"
                      color="primary"
                      leftSection={<ShoppingCartIcon size={14} />}
                      disabled={p.stockQty <= 0}
                      onClick={() => handleAddToCart(p.id, p.name)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {specRows.map((row) => (
              <tr key={row.label} className="border-t border-gray-100">
                <td className="p-3 text-sm font-semibold text-gray-600">{row.label}</td>
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
    </div>
  )
}

export default ComparePage
