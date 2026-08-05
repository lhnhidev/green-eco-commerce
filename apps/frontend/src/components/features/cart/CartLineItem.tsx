import { invalidateGetCart, useRemoveCartItem, useUpdateCartItem } from '@api'
import type { CartItemDto } from '@api/schemas'
import ImageWithFallback from '@components/ui/ImageWithFallback'
import { notifications } from '@mantine/notifications'
import { MinusIcon, PlusIcon, TrashIcon, WarningIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import { Link } from 'react-router'

const CartLineItem = ({ cartItem }: { cartItem: CartItemDto }) => {
  const queryClient = useQueryClient()
  const invalidate = () => invalidateGetCart(queryClient)

  const { mutate: updateQty, isPending: updatingQty } = useUpdateCartItem({
    mutation: {
      onSuccess: invalidate,
      onError: () => notifications.show({ title: 'Error', message: 'Could not update quantity.', color: 'red' }),
    },
  })

  const { mutate: remove, isPending: removing } = useRemoveCartItem({
    mutation: {
      onSuccess: invalidate,
      onError: () => notifications.show({ title: 'Error', message: 'Could not remove item.', color: 'red' }),
    },
  })

  const stock = cartItem.currentStockQuantity ?? 0
  const quantity = cartItem.quantity ?? 1
  const outOfStock = stock <= 0
  const atMaxStock = quantity >= stock

  const handleQty = (delta: number) => {
    const newQty = quantity + delta
    if (newQty < 1 || newQty > stock) return
    updateQty({ data: { productId: cartItem.productId, quantity: newQty } })
  }

  const lineTotal = (cartItem.productPrice ?? 0) * quantity
  const isBusy = updatingQty || removing

  return (
    <div
      className={`flex gap-3 items-center py-4 border-b border-gray-100 last:border-0 transition-opacity ${isBusy ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <Link to={`/products/${cartItem.productId}`} className="shrink-0">
        <ImageWithFallback
          src={resolveImageUrl(cartItem.productImageUrl)}
          alt={cartItem.productName}
          className="w-16 h-16 rounded-md object-cover bg-gray-50 border border-border"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${cartItem.productId}`}
          className="font-medium text-sm text-gray-900 hover:text-primary transition-colors line-clamp-1"
        >
          {cartItem.productName}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(cartItem.productPrice)} each</p>

        {outOfStock ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-500">
            <WarningIcon weight="fill" size={14} /> Out of stock — remove to continue checkout
          </p>
        ) : atMaxStock ? (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-600">
            <WarningIcon weight="fill" size={14} /> Only {stock} left in stock
          </p>
        ) : null}

        <div className="flex items-center gap-2 mt-3">
          <button
            type="button"
            onClick={() => handleQty(-1)}
            disabled={quantity <= 1}
            className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-inherit flex items-center justify-center text-gray-500 transition-all"
            aria-label="Decrease quantity"
          >
            <MinusIcon size={12} />
          </button>
          <span className="text-sm font-bold text-gray-800 min-w-6 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => handleQty(1)}
            disabled={outOfStock || atMaxStock}
            className="w-7 h-7 rounded-full border border-gray-200 bg-white hover:border-green-400 hover:text-green-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-inherit flex items-center justify-center text-gray-500 transition-all"
            aria-label="Increase quantity"
          >
            <PlusIcon size={12} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 shrink-0">
        <span className="font-semibold text-sm text-gray-900">{formatCurrency(lineTotal)}</span>
        <button
          type="button"
          onClick={() => remove({ productId: cartItem.productId })}
          className="text-gray-300 hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-medium"
        >
          <TrashIcon size={14} /> Remove
        </button>
      </div>
    </div>
  )
}

export default CartLineItem
