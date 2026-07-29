import {
  getGetCartQueryKey,
  getGetWishlistQueryKey,
  getIsInWishlistQueryKey,
  useAddCartItem,
  useAddToWishlist,
  useIsInWishlist,
  useRemoveFromWishlist,
} from '@api'
import type { ProductDto } from '@api/schemas'
import { MAX_COMPARE_ITEMS, toggleCompare } from '@components/features/compare/compare.slice'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useAuth } from '@hooks/useAuth'
import { Rating } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { HeartIcon, ScalesIcon, ShoppingCartIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import type * as React from 'react'
import { Link } from 'react-router'

const ProductCardv2 = ({ product }: { product: ProductDto }) => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const compareIds = useAppSelector((state) => state.compare.productIds)
  const isComparing = compareIds.includes(product.id)
  const { mutate, isPending } = useAddCartItem({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
      },
    },
  })

  const { data: isWishlisted } = useIsInWishlist(product.id, { query: { enabled: !!user, staleTime: 1000 * 60 * 5 } })
  const { mutate: addWishlist } = useAddToWishlist({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() })
        queryClient.invalidateQueries({ queryKey: getIsInWishlistQueryKey(product.id) })
      },
    },
  })
  const { mutate: removeWishlist } = useRemoveFromWishlist({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() })
        queryClient.invalidateQueries({ queryKey: getIsInWishlistQueryKey(product.id) })
      },
    },
  })

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      notifications.show({ title: 'Login required', message: 'Please log in to save to wishlist.', color: 'orange' })
      return
    }
    if (isWishlisted) removeWishlist({ productId: product.id })
    else addWishlist({ productId: product.id })
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isComparing && compareIds.length >= MAX_COMPARE_ITEMS) {
      notifications.show({
        title: 'Compare list full',
        message: `You can compare up to ${MAX_COMPARE_ITEMS} products at a time.`,
        color: 'orange',
      })
      return
    }
    dispatch(toggleCompare(product.id))
  }

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
            src={resolveImageUrl(product?.imageUrl?.at(0)) || '/placeholder.png'}
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

          {/* Wishlist & Compare Buttons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {user && (
              <button
                type="button"
                onClick={handleWishlist}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110"
                aria-label="Toggle wishlist"
              >
                <HeartIcon size={15} className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-500'} />
              </button>
            )}
            <button
              type="button"
              onClick={handleCompare}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110"
              aria-label="Toggle compare"
            >
              <ScalesIcon
                size={15}
                weight={isComparing ? 'fill' : 'regular'}
                className={isComparing ? 'text-primary' : 'text-gray-500'}
              />
            </button>
          </div>

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
              <ShoppingCartIcon size={20} />
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
            <Rating value={product.rating} fractions={2} readOnly />
            <span className="text-xs font-medium text-gray-400 hover:text-primary transition-colors">
              ({product.rating.toFixed(1)}) · {product.reviewsCount} {product.reviewsCount === 1 ? 'review' : 'reviews'}
            </span>
            {/*<div className="flex items-center gap-1.5 text-amber-400">*/}
            {/*  <FaStar size={14} />*/}
            {/*  <FaStar size={14} />*/}
            {/*  <FaStar size={14} />*/}
            {/*  <FaStar size={14} />*/}
            {/*  <FaStarHalfAlt size={14} />*/}
            {/*</div>*/}
            {/*<span className="text-xs font-medium text-gray-400 hover:text-primary transition-colors">124 reviews</span>*/}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCardv2
