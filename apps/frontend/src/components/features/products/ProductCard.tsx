import {
  invalidateGetCart,
  invalidateGetWishlist,
  invalidateIsInWishlist,
  useAddCartItem,
  useAddToWishlist,
  useIsInWishlist,
  useRemoveFromWishlist,
} from '@api'
import type { ProductDto } from '@api/schemas'
import { MAX_COMPARE_ITEMS, toggleCompare } from '@components/features/compare/compare.slice'
import ImageWithFallback from '@components/ui/ImageWithFallback'
import PriceTag from '@components/ui/primitives/PriceTag'
import StockBadge from '@components/ui/StockBadge'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useAuth } from '@hooks/useAuth'
import { Rating } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { EyeIcon, HeartIcon, ScalesIcon, ShoppingCartIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import type * as React from 'react'
import { useState } from 'react'
import { Link } from 'react-router'
import QuickViewModal from './QuickViewModal'

const ProductCard = ({ product }: { product: ProductDto }) => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const compareIds = useAppSelector((state) => state.compare.productIds)
  const isComparing = compareIds.includes(product.id)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const { mutate, isPending } = useAddCartItem({
    mutation: {
      onSuccess: async () => {
        await invalidateGetCart(queryClient)
      },
    },
  })

  const { data: isWishlisted } = useIsInWishlist(product.id, { query: { enabled: !!user, staleTime: 1000 * 60 * 5 } })
  const { mutate: addWishlist } = useAddToWishlist({
    mutation: {
      onSuccess: async () => {
        await invalidateGetWishlist(queryClient)
        await invalidateIsInWishlist(queryClient, product.id)
      },
    },
  })
  const { mutate: removeWishlist } = useRemoveFromWishlist({
    mutation: {
      onSuccess: async () => {
        await invalidateGetWishlist(queryClient)
        await invalidateIsInWishlist(queryClient, product.id)
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

  const outOfStock = product.stockQty <= 0

  return (
    <>
      <Link to={`/products/${product.id}`} className="group block h-full">
        <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-white border border-border shadow-xs transition-shadow duration-200 hover:shadow-md">
          {/* Image Section */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-50/50">
            <ImageWithFallback
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              src={resolveImageUrl(product?.imageUrl?.at(0))}
            />

            {/* Subtle dark gradient overlay on hover to make icons pop */}
            <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Material & Stock Badges */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-2 items-start">
              {product.materials?.at(0) !== undefined && (
                <span className="bg-secondary/95 text-primary border border-primary/20 px-2 py-0.5 text-2xs font-medium rounded-full shadow-sm backdrop-blur-md">
                  {product.materials?.at(0)?.name}
                </span>
              )}
              <StockBadge stockQty={product.stockQty} />
            </div>

            {/* Dim the image when unavailable */}
            {outOfStock && <div className="absolute inset-0 bg-white/40 z-[5]" />}

            {/* Wishlist, Compare & Quick View Buttons */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {user && (
                <button
                  type="button"
                  onClick={handleWishlist}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
                  aria-label="Toggle wishlist"
                >
                  <HeartIcon size={16} className={isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-500'} />
                </button>
              )}
              <button
                type="button"
                onClick={handleCompare}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
                aria-label="Toggle compare"
              >
                <ScalesIcon
                  size={16}
                  weight={isComparing ? 'fill' : 'regular'}
                  className={isComparing ? 'text-primary' : 'text-gray-500'}
                />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setQuickViewOpen(true)
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-105"
                aria-label="Quick view"
              >
                <EyeIcon size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Add to cart reveal */}
            <button
              type="button"
              disabled={isPending || outOfStock}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAddToCart(product.id, 1)
              }}
              className="absolute inset-x-2 bottom-2 z-10 h-9 rounded-md bg-white/95 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur-sm translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add to cart"
              title={outOfStock ? 'Out of stock' : 'Add to cart'}
            >
              <ShoppingCartIcon size={14} />
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </button>
          </div>

          {/* Content Section */}
          <div className="flex flex-1 flex-col p-3">
            <div className="mb-1.5 flex flex-col items-start gap-1">
              <h2 className="text-md font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h2>
              <PriceTag value={product.price} size="md" />
            </div>

            {/* Footer (Rating & Reviews) */}
            <div className="mt-auto flex items-center gap-1.5 pt-2 border-t border-gray-100">
              <Rating value={product.rating} fractions={2} readOnly size="xs" />
              <span className="text-2xs text-gray-400">
                ({product.rating.toFixed(1)}) · {product.reviewsCount}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <QuickViewModal product={quickViewOpen ? product : null} onClose={() => setQuickViewOpen(false)} />
    </>
  )
}

export default ProductCard
