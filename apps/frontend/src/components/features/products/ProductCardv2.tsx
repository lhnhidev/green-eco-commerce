import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { getGetApiCartQueryKey, usePostApiCartItems } from '../../../api'
import type { ProductDto } from '../../../api/schemas'

const ProductCardv2 = ({ product }: { product: ProductDto }) => {
  const { mutate } = usePostApiCartItems()
  const queryClient = useQueryClient()

  const handleAddToCart = (productId: string | undefined, quantity: number) => {
    if (!productId) return

    mutate(
      {
        data: {
          productId,
          quantity,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetApiCartQueryKey() })

          notifications.show({
            title: 'Add Product Sucessed!',
            message: `Product: ${product?.name} - Amount: ${quantity}`,
            color: 'green',
          })
        },
        onError: () => {
          notifications.show({
            title: 'Add Product Failed!',
            message: 'Add product failed. Please try again!',
            color: 'red',
          })
        },
      },
    )
  }

  return (
    <Link to={`/products/${product.id}`}>
      <div className="max-w-120 cursor-pointer group flex flex-col rounded-xl overflow-hidden hover:shadow-[0_20px_40px_-20px_rgba(21,66,18,0.15)] transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <img
            alt="Bamboo toothbrush set"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={`${product?.imageUrl?.at(0)}`}
          />
          <div className="absolute top-2 left-2 flex gap-2">
            <span className="bg-(--color-secondary) text-white px-3 py-1 text-sm rounded-full font-light uppercase tracking-wider">
              {product.materials?.at(0)?.name}
            </span>
          </div>
          {/** biome-ignore lint/a11y/useButtonType: <> */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleAddToCart(product.id, 1)
            }}
            className="absolute cursor-pointer hover:bg-white bottom-4 right-4 bg-white/80 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-sm"
          >
            🛒
          </button>
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-primary">{product.name}</h2>
            <span className="text-lg text-primary font-semibold">${product.price}</span>
          </div>
          <p className="line-clamp-3">{product.description}</p>
          <div className="mt-auto flex items-center gap-2">
            <div className="flex text-primary-container">
              <span className="material-symbols-outlined text-[18px] [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_24]">
                ⭐
              </span>
              <span className="material-symbols-outlined text-[18px] [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_24]">
                ⭐
              </span>
              <span className="material-symbols-outlined text-[18px] [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_24]">
                ⭐
              </span>
              <span className="material-symbols-outlined text-[18px] [font-variation-settings:'FILL'_1,'wght'_400,'GRAD'_0,'opsz'_24]">
                ⭐
              </span>
              <span className="material-symbols-outlined text-[18px] [font-variation-settings:'FILL'_0,'wght'_400,'GRAD'_0,'opsz'_24]">
                ⭐
              </span>
            </div>
            <span className="text-caption text-on-surface-variant">(124 reviews)</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCardv2
