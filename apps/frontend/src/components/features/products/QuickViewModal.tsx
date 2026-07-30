import { invalidateGetCart, useAddCartItem } from '@api'
import type { ProductDto } from '@api/schemas'
import PriceTag from '@components/ui/primitives/PriceTag'
import StockBadge from '@components/ui/StockBadge'
import { Modal, NumberInput, Rating } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ShoppingCartIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'

type QuickViewModalProps = {
  product: ProductDto | null
  onClose: () => void
}

const QuickViewModal = ({ product, onClose }: QuickViewModalProps) => {
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)

  // Reset quantity whenever a different product is opened.
  useEffect(() => setQuantity(1), [product?.id])

  const { mutate, isPending } = useAddCartItem({
    mutation: {
      onSuccess: async () => {
        await invalidateGetCart(queryClient)
        notifications.show({
          title: 'Added to cart!',
          message: `${product?.name} has been added to your cart.`,
          color: 'green',
        })
      },
      onError: () => {
        notifications.show({
          title: 'Action failed',
          message: 'Could not add product to cart. Please try again.',
          color: 'red',
        })
      },
    },
  })

  if (!product) return null

  const outOfStock = product.stockQty <= 0

  const handleAddToCart = () => {
    mutate({ data: { productId: product.id, quantity } })
  }

  return (
    <Modal opened={!!product} onClose={onClose} size="lg" title="Quick View" centered>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <img
          src={resolveImageUrl(product.imageUrl?.at(0)) || '/placeholder.png'}
          alt={product.name}
          className="w-full aspect-square object-cover rounded-lg bg-gray-50"
        />

        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h2>

          <div className="flex items-center gap-2">
            <Rating value={product.rating} fractions={2} readOnly size="sm" />
            <span className="text-xs text-gray-400">
              ({product.rating.toFixed(1)}) · {product.reviewsCount} {product.reviewsCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <PriceTag value={product.price} size="lg" />

          <StockBadge stockQty={product.stockQty} />

          {product.description && <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>}

          <div className="flex items-center gap-3 mt-2">
            <NumberInput
              min={1}
              max={product.stockQty}
              value={quantity}
              disabled={outOfStock}
              size="sm"
              w={90}
              onChange={(value) => {
                const parsed = typeof value === 'number' ? value : parseInt(value.toString(), 10) || 1
                setQuantity(Math.min(Math.max(1, parsed), product.stockQty))
              }}
            />
            <button
              type="button"
              disabled={outOfStock || isPending}
              onClick={handleAddToCart}
              className="flex-1 cursor-pointer bg-primary text-white font-semibold text-sm py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCartIcon weight="bold" size={15} />
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <Link
            to={`/products/${product.id}`}
            onClick={onClose}
            className="text-sm font-semibold text-primary hover:text-green-700 transition-colors mt-1 text-center sm:text-left"
          >
            View full details →
          </Link>
        </div>
      </div>
    </Modal>
  )
}

export default QuickViewModal
