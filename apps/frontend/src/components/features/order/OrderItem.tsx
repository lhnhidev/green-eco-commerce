import { getGetCartQueryKey, invalidateGetCart, useRemoveCartItem } from '@api'
import type { CartDto, CartItemDto } from '@api/schemas'
import ImageWithFallback from '@components/ui/ImageWithFallback'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { TrashIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import { useNavigate } from 'react-router'

const OrderItem = ({ product }: { product: CartItemDto }) => {
  const lineTotal = Number(product.productPrice) * Number(product.quantity)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate: removeProductFromCart } = useRemoveCartItem({
    mutation: {
      onMutate: async (variables) => {
        const cartQueryKey = getGetCartQueryKey()
        await queryClient.cancelQueries({ queryKey: cartQueryKey })

        const previousCart = queryClient.getQueryData(cartQueryKey)

        queryClient.setQueryData<CartDto>(cartQueryKey, (oldData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            items: oldData.items.filter((item) => item.productId !== variables.productId),
          }
        })

        return { previousCart }
      },
      onError: (_err, _variables, context) => {
        const cartQueryKey = getGetCartQueryKey()

        if (context?.previousCart) {
          queryClient.setQueryData(cartQueryKey, context.previousCart)
        }

        notifications.show({
          title: 'Could not remove product',
          message: 'Please try again.',
          color: 'red',
        })
      },
      onSettled: async () => {
        await invalidateGetCart(queryClient)
      },
    },
  })

  const [opened, { open, close }] = useDisclosure(false)

  return (
    <div className="flex gap-3 items-center">
      <button type="button" onClick={() => navigate(`/products/${product.productId}`)} className="shrink-0">
        <ImageWithFallback
          className="rounded-md w-12 h-12 object-cover bg-gray-50"
          src={resolveImageUrl(product.productImageUrl)}
          alt={product.productName}
        />
      </button>

      <div className="flex justify-between items-center flex-1 min-w-0">
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{product.productName}</p>
          <p className="text-xs text-muted-foreground">Qty {product.quantity}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-semibold">{formatCurrency(lineTotal)}</span>
          <button
            type="button"
            onClick={open}
            className="text-gray-300 hover:text-red-500 transition-colors"
            aria-label="Remove item"
          >
            <TrashIcon size={14} />
          </button>
        </div>
      </div>

      <ConfirmModal
        opened={opened}
        onClose={close}
        onConfirm={() => {
          removeProductFromCart({ productId: product.productId })
          close()
        }}
        title="Remove item"
        message="This product will be removed from your cart."
        confirmLabel="Remove"
      />
    </div>
  )
}

export default OrderItem
