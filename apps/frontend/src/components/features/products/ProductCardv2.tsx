import { getGetCartQueryKey, useAddCartItem } from '@api'
import type { ProductDto } from '@api/schemas'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi'
import { Link } from 'react-router'

const ProductCardv2 = ({ product }: { product: ProductDto }) => {
  const { mutate, isPending } = useAddCartItem()
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
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })

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
    )
  }

  // Assuming price is a number, format it nicely
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price ?? 0)

  return (
    <Link to={`/products/${product.id}`} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(16,177,87,0.15)] plant-shadow">
        {/* Image Section */}
        <div className="relative aspect-4/3 overflow-hidden bg-gray-50/50">
          <img
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={product?.imageUrl?.at(0) || '/placeholder.png'}
          />

          {/* Subtle dark gradient overlay on hover to make icons pop */}
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Material Badge */}
          {product.materials?.at(0) !== undefined && (
            <div className="absolute left-3 top-3 z-10 flex gap-2">
              <span className="bg-secondary/95 text-primary border border-primary/20 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm backdrop-blur-md">
                {product.materials?.at(0)?.name}
              </span>
            </div>
          )}

          {/* Floating Add to Cart Button */}
          <div className="absolute bottom-4 right-4 z-10 translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddToCart(product.id, 1)
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:scale-110 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              aria-label="Add to cart"
            >
              <FiShoppingCart size={20} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex flex-col items-start gap-1">
            <h2 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h2>
            <span className="text-lg font-extrabold text-primary">{formattedPrice}</span>
          </div>

          {/* Footer (Rating & Reviews) */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100/80">
            <div className="flex items-center gap-1.5 text-amber-400">
              <FaStar size={14} />
              <FaStar size={14} />
              <FaStar size={14} />
              <FaStar size={14} />
              <FaStarHalfAlt size={14} />
            </div>
            <span className="text-xs font-medium text-gray-400 hover:text-primary transition-colors">124 reviews</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCardv2
