/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */

import { Button, Modal, NumberInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { FaRegTrashCan } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { getGetApiCartQueryKey, useDeleteApiCartItemsProductId } from '../../../api'
import type { CartDto, CartItemDto } from '../../../api/schemas'

const OrderItem = ({ product }: { product: CartItemDto }) => {
  const price = Number(product.productPrice) * Number(product.quantity)

  const navigation = useNavigate()

  const queryClient = useQueryClient()

  const { mutate: removeProductFromCart } = useDeleteApiCartItemsProductId({
    mutation: {
      onMutate: async (variables) => {
        const cartQueryKey = getGetApiCartQueryKey()
        await queryClient.cancelQueries({ queryKey: cartQueryKey })

        const previousCart = queryClient.getQueryData(cartQueryKey)

        queryClient.setQueryData<CartDto>(cartQueryKey, (oldData) => {
          return {
            ...oldData,
            items: oldData?.items?.filter((item) => item.productId !== variables.productId),
          }
        })

        return { previousCart }
      },
      onError: (_err, _variables, context) => {
        const cartQueryKey = getGetApiCartQueryKey()

        if (context?.previousCart) {
          queryClient.setQueryData(cartQueryKey, context.previousCart)
        }

        notifications.show({
          title: 'Can not remove this product!',
          message: 'Remove product failed. Please try again!',
          color: 'red',
        })
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetApiCartQueryKey() })
      },
    },
  })

  const [opened, { open, close }] = useDisclosure(false)

  const handleDeleteProduct = (productId: string | number | undefined) => {
    removeProductFromCart({ productId: productId as string })
  }

  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        title="Confirm remove product from your cart?"
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <p className="text-sm text-gray-600">This product will be removed from your cart!</p>
        <div className="flex justify-end mt-2 gap-2">
          <Button color="red" onClick={() => handleDeleteProduct(product.productId)}>
            Confirm
          </Button>
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
        </div>
      </Modal>

      <div className="flex gap-5 items-center border border-gray-300 rounded-lg p-4">
        <div className="cursor-pointer" onClick={() => navigation(`/products/${product?.productId}`)}>
          <img className="rounded-lg w-30 h-30" src={product.productImageUrl?.at(0)} alt={product.productName} />
        </div>

        <div className="flex justify-between flex-1">
          <div>
            <p className="font-bold">{product.productName}</p>
            <p>Point: 100</p>
            <p>${product.productPrice}</p>
            <NumberInput
              min={1}
              defaultValue={product.quantity}
              size="xs"
              placeholder="Amount of Product"
              classNames={{ input: '!text-center', root: '!w-25 !mt-3' }}
            />
          </div>
          <div className="w-20 flex-col items-center">
            <p className="mb-3">${price}</p>
            <div onClick={() => open()} className="text-red-500 hover:cursor-pointer hover:text-red-300 transition-all">
              <FaRegTrashCan />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderItem
