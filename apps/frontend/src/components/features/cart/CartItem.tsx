/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */

import { getGetCartQueryKey, useRemoveCartItem, useUpdateCartItem } from '@api'
import type { CartItemDto } from '@api/schemas'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { setIsShow } from './cart.slice'

const CartItem = ({ cartItem }: { cartItem: CartItemDto }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })

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

  const handleQty = (delta: number) => {
    const newQty = (cartItem.quantity ?? 1) + delta
    if (newQty < 1) return
    updateQty({ data: { productId: cartItem.productId, quantity: newQty } })
  }

  const lineTotal = ((cartItem.productPrice ?? 0) * (cartItem.quantity ?? 1)).toFixed(2)
  const isLoading = updatingQty || removing

  return (
    <div className={`flex gap-3 items-start py-4 border-b border-gray-100 last:border-0 group transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Product image */}
      <div
        className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => {
          dispatch(setIsShow(false))
          navigate(`/products/${cartItem?.productId}`)
        }}
      >
        <img
          src={cartItem?.productImageUrl}
          alt={cartItem?.productName ?? 'Product'}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold text-[13px] text-gray-800 truncate cursor-pointer hover:text-green-700 transition-colors leading-tight"
          onClick={() => {
            dispatch(setIsShow(false))
            navigate(`/products/${cartItem?.productId}`)
          }}
        >
          {cartItem?.productName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">${cartItem?.productPrice?.toFixed(2)} each</p>

        {/* Qty controls + CO₂ badge */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            type="button"
            onClick={() => handleQty(-1)}
            className="w-6 h-6 rounded-full border border-gray-200 bg-white hover:border-red-300 hover:text-red-500 flex items-center justify-center text-gray-500 text-sm font-bold transition-all hover:shadow-sm active:scale-90"
          >
            −
          </button>
          <span className="text-sm font-bold text-gray-800 min-w-5 text-center">
            {cartItem?.quantity}
          </span>
          <button
            type="button"
            onClick={() => handleQty(1)}
            className="w-6 h-6 rounded-full border border-gray-200 bg-white hover:border-green-400 hover:text-green-600 flex items-center justify-center text-gray-500 text-sm font-bold transition-all hover:shadow-sm active:scale-90"
          >
            +
          </button>
        </div>

        {/* CO₂ saved badge */}
        {(cartItem.unitCo2Saved ?? 0) > 0 && (
          <div className="mt-2 inline-flex items-center gap-1 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
            <span className="text-green-600 text-[10px]">🌿</span>
            <span className="text-[10px] font-semibold text-green-700">
              {(cartItem.unitCo2Saved * (cartItem.quantity ?? 1)).toFixed(2)} kg CO₂ saved
            </span>
          </div>
        )}
      </div>

      {/* Price + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="font-bold text-sm text-gray-900">${lineTotal}</span>
        <button
          type="button"
          onClick={() => remove({ productId: cartItem.productId })}
          className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
          title="Remove item"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CartItem
