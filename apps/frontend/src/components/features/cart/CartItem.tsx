import { invalidateGetCart, useRemoveCartItem, useUpdateCartItem } from '@api'
import type { CartItemDto } from '@api/schemas'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { notifications } from '@mantine/notifications'
import { TrashIcon, WarningIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import { Link } from 'react-router'
import { setIsShow } from './cart.slice'

const CartItem = ({ cartItem }: { cartItem: CartItemDto }) => {
  const dispatch = useAppDispatch()
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
  const isLoading = updatingQty || removing

  return (
    <div
      className={`flex gap-3 items-start py-4 border-b border-gray-100 last:border-0 group transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Product image */}
      <Link
        to={`/products/${cartItem?.productId}`}
        onClick={() => dispatch(setIsShow(false))}
        className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-50 border border-border shrink-0 block hover:opacity-80 transition-opacity"
      >
        <img
          src={resolveImageUrl(cartItem?.productImageUrl)}
          alt={cartItem?.productName ?? 'Product'}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${cartItem?.productId}`}
          onClick={() => dispatch(setIsShow(false))}
          className="block font-semibold text-[13px] text-gray-800 truncate hover:text-green-700 transition-colors leading-tight"
        >
          {cartItem?.productName}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(cartItem?.productPrice)} each</p>

        {/* Qty controls + CO₂ badge */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            type="button"
            onClick={() => handleQty(-1)}
            disabled={quantity <= 1}
            className="w-6 h-6 rounded-full border border-gray-200 bg-white hover:border-red-300 hover:text-red-500 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-inherit flex items-center justify-center text-gray-500 text-sm font-bold transition-all hover:shadow-sm active:scale-90"
          >
            −
          </button>
          <span className="text-sm font-bold text-gray-800 min-w-5 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => handleQty(1)}
            disabled={outOfStock || atMaxStock}
            className="w-6 h-6 rounded-full border border-gray-200 bg-white hover:border-green-400 hover:text-green-600 disabled:opacity-40 disabled:hover:border-gray-200 disabled:hover:text-inherit flex items-center justify-center text-gray-500 text-sm font-bold transition-all hover:shadow-sm active:scale-90"
          >
            +
          </button>
        </div>

        {/* Stock warning */}
        {(outOfStock || atMaxStock) && (
          <div className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-amber-600">
            <WarningIcon weight="fill" size={11} />
            {outOfStock ? 'Out of stock' : `Only ${stock} left in stock`}
          </div>
        )}

        {/* CO₂ saved badge */}
        {(cartItem.unitCo2Saved ?? 0) > 0 && (
          <div className="mt-2 inline-flex items-center gap-1 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
            <span className="text-green-600 text-[10px]">🌿</span>
            <span className="text-[10px] font-semibold text-green-700">
              {(cartItem.unitCo2Saved * quantity).toFixed(2)} kg CO₂ saved
            </span>
          </div>
        )}
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-bold text-sm text-gray-900">{formatCurrency(lineTotal)}</span>
        <button
          type="button"
          onClick={() => remove({ productId: cartItem.productId })}
          className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
          title="Remove item"
        >
          <TrashIcon size={13} />
        </button>
      </div>
    </div>
  )
}

export default CartItem
