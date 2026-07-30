import {
  getGetCartQueryKey,
  getGetWishlistQueryKey,
  getIsInWishlistQueryKey,
  useAddCartItem,
  useAddToWishlist,
  useGetProductById,
  useIsInWishlist,
  useRemoveFromWishlist,
} from '@api'
import { MAX_COMPARE_ITEMS, toggleCompare } from '@components/features/compare/compare.slice'
import RecentlyViewedProducts from '@components/features/products/RecentlyViewedProducts'
import { recordProductView } from '@components/features/products/recentlyViewed.slice'
import RelatedProducts from '@components/features/products/RelatedProducts'
import ProductReviews from '@components/features/reviews/ProductReviews'
import ImgSlider from '@components/ui/img-slider/ImgSlider'
import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Container from '@components/ui/primitives/Container'
import PriceTag from '@components/ui/primitives/PriceTag'
import Prose from '@components/ui/primitives/Prose'
import Stat from '@components/ui/primitives/Stat'
import Seo from '@components/ui/Seo'
import Loading from '@components/ui/status/Loading'
import StockBadge from '@components/ui/StockBadge'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useAuth } from '@hooks/useAuth'
import { ActionIcon, Badge, Button, Modal, NumberInput, Rating, Tabs } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  ArrowsOutIcon,
  CaretLeftIcon,
  CaretRightIcon,
  HeartIcon,
  LeafIcon,
  ScalesIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TreeIcon,
  XIcon,
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { formatParam } from '@utils/formatParam'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import type * as React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

const ProductDetailPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const compareIds = useAppSelector((state) => state.compare.productIds)
  const isComparing = !!id && compareIds.includes(id)

  const [amountProduct, setAmountProduct] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<string | null>('description')

  const {
    data: product,
    isLoading,
    isError,
    // biome-ignore lint/style/noNonNullAssertion: <>
  } = useGetProductById(id!, {
    query: {
      enabled: !!id,
    },
  })

  const [activeImg, setActiveImg] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center' })

  const resolvedImages = product?.imageUrl.map((url) => resolveImageUrl(url) ?? url) ?? []

  // Reset the active image (and record the view) whenever we land on a different product —
  // this component instance is reused across navigations between /products/:id routes.
  useEffect(() => {
    if (product) {
      setActiveImg(resolveImageUrl(product.imageUrl[0]) ?? product.imageUrl[0] ?? '')
      dispatch(recordProductView(product.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id])

  const queryClient = useQueryClient()

  const { mutate } = useAddCartItem({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
      },
    },
  })

  const { data: isWishlisted } = useIsInWishlist(id ?? '', {
    query: {
      enabled: !!user && !!id,
      staleTime: 1000 * 60 * 5,
    },
  })
  const invalidateWishlist = () => {
    queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() })
    if (id) queryClient.invalidateQueries({ queryKey: getIsInWishlistQueryKey(id) })
  }
  const { mutate: addWishlist } = useAddToWishlist({ mutation: { onSuccess: invalidateWishlist } })
  const { mutate: removeWishlist } = useRemoveFromWishlist({ mutation: { onSuccess: invalidateWishlist } })

  const handleWishlist = () => {
    if (!id) return
    if (!user) {
      notifications.show({ title: 'Login required', message: 'Please log in to save to wishlist.', color: 'orange' })
      return
    }
    if (isWishlisted) removeWishlist({ productId: id })
    else addWishlist({ productId: id })
  }

  const handleCompare = () => {
    if (!id) return
    if (!isComparing && compareIds.length >= MAX_COMPARE_ITEMS) {
      notifications.show({
        title: 'Compare list full',
        message: `You can compare up to ${MAX_COMPARE_ITEMS} products at a time.`,
        color: 'orange',
      })
      return
    }
    dispatch(toggleCompare(id))
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
            title: 'Added to cart',
            message: `${product?.name} — qty ${quantity}`,
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

  if (isLoading) {
    return (
      <div className="min-h-150 flex items-center justify-center">
        <Loading text="Loading product details..." />
      </div>
    )
  }

  if (isError || product === undefined) {
    return (
      <div className="min-h-150 flex items-center justify-center text-red-500 font-medium">
        Oops! We couldn't find this product.
      </div>
    )
  }

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: product.name, href: `/products/${product.id}` },
  ]

  const outOfStock = product.stockQty <= 0

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({ transformOrigin: `${x}% ${y}%` })
  }

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center' })
  }

  const carbonSaved =
    product.baselineCarbonIndex > product.carbonIndex
      ? (((product.baselineCarbonIndex - product.carbonIndex) / product.baselineCarbonIndex) * 100).toFixed(0)
      : null

  return (
    <div className="min-h-screen bg-white pb-20 lg:pb-0">
      <Seo
        title={product.name}
        description={product.description ?? undefined}
        image={resolveImageUrl(product.imageUrl[0]) ?? undefined}
      />

      <Container className="py-6">
        <PageBreadcrumbs items={breadcrumbItems} className="mb-4" separator="/" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          {/* Image Gallery */}
          <div className="flex flex-col gap-3">
            {/** biome-ignore lint/a11y/noStaticElementInteractions: mouse-driven zoom, not a control */}
            <div
              className="relative w-full aspect-square overflow-hidden rounded-lg bg-white border border-border group cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                className="w-full h-full object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-105"
                style={zoomStyle}
                alt={product.name}
                src={activeImg}
              />
              <div className="absolute top-3 left-3">
                <Badge size="sm" color="primary" variant="light" leftSection={<LeafIcon weight="fill" size={11} />}>
                  Eco-certified
                </Badge>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxOpen(true)
                }}
                className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
                aria-label="View full size image"
              >
                <ArrowsOutIcon size={15} />
              </button>
            </div>

            <ImgSlider
              imgs={resolvedImages}
              isAuto={false}
              delayTime={0}
              percent="25%"
              activeImg={activeImg}
              onSelect={setActiveImg}
            />
          </div>

          {/* Buy box */}
          <div className="lg:sticky lg:top-[72px] lg:self-start flex flex-col gap-3">
            {product.materials && product.materials.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.materials.map((material) => (
                  <Badge key={material.id} size="sm" variant="light" color="gray">
                    {material.name}
                  </Badge>
                ))}
              </div>
            )}

            <h1 className="text-2xl font-semibold text-gray-900 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-2">
              <Rating value={product?.rating ?? 0} fractions={2} readOnly size="xs" />
              <button
                type="button"
                onClick={() => {
                  setActiveTab('reviews')
                  document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {product.reviewsCount === 1 ? '1 review' : `${product.reviewsCount} reviews`}
              </button>
            </div>

            <PriceTag value={product.price} size="lg" />

            <div className="flex items-center gap-2">
              <StockBadge stockQty={product.stockQty} />
              {carbonSaved && (
                <span className="inline-flex items-center gap-1 text-xs text-primary">
                  <ShieldCheckIcon weight="fill" size={13} />
                  {carbonSaved}% less CO₂e than baseline
                </span>
              )}
            </div>

            <div className="flex items-end gap-3 pt-1">
              <NumberInput
                label="Quantity"
                min={1}
                max={product.stockQty}
                value={amountProduct}
                disabled={outOfStock}
                w={90}
                onChange={(value) => {
                  const parsed = typeof value === 'number' ? value : parseInt(value.toString(), 10) || 1
                  setAmountProduct(Math.min(Math.max(1, parsed), product.stockQty))
                }}
              />
              <span className="text-sm text-muted-foreground pb-2">
                Total: <PriceTag value={product.price * amountProduct} size="sm" colorClassName="text-gray-900" />
              </span>
            </div>

            <Button
              size="md"
              fullWidth
              disabled={outOfStock}
              onClick={() => handleAddToCart(product.id, amountProduct)}
              leftSection={<ShoppingCartIcon weight="bold" size={16} />}
            >
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>

            <div className="flex items-center gap-2">
              <ActionIcon
                variant="subtle"
                size="lg"
                color={isWishlisted ? 'red' : 'gray'}
                onClick={handleWishlist}
                aria-label={isWishlisted ? 'Remove from favorites' : 'Save to favorites'}
                title={isWishlisted ? 'Remove from favorites' : 'Save to favorites'}
              >
                <HeartIcon weight={isWishlisted ? 'fill' : 'bold'} size={17} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                size="lg"
                color={isComparing ? 'primary' : 'gray'}
                onClick={handleCompare}
                aria-label={isComparing ? 'Remove from compare' : 'Add to compare'}
                title={isComparing ? 'Remove from compare' : 'Add to compare'}
              >
                <ScalesIcon weight={isComparing ? 'fill' : 'bold'} size={17} />
              </ActionIcon>
            </div>
          </div>
        </div>

        <Tabs id="product-tabs" value={activeTab} onChange={setActiveTab} className="mt-section">
          <Tabs.List>
            <Tabs.Tab value="description">Description</Tabs.Tab>
            <Tabs.Tab value="sustainability">Sustainability</Tabs.Tab>
            <Tabs.Tab value="reviews">Reviews ({product.reviewsCount})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="description" pt="md">
            <Prose>{formatParam(product.description, '\n\n')}</Prose>
          </Tabs.Panel>

          <Tabs.Panel value="sustainability" pt="md">
            <div className="flex items-center gap-2 mb-4">
              <TreeIcon weight="fill" size={18} className="text-primary" />
              <h3 className="text-sm font-semibold text-gray-800">Environmental impact</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Product carbon footprint" value={`${product.carbonIndex} kg`} tone="primary" />
              <Stat label="Standard baseline" value={`${product.baselineCarbonIndex} kg`} />
              {carbonSaved && <Stat label="CO₂e saved" value={`${carbonSaved}%`} tone="primary" />}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="reviews" pt="md">
            <ProductReviews productId={product.id} reviewsCount={product.reviewsCount} averageRating={product.rating} />
          </Tabs.Panel>
        </Tabs>

        <RelatedProducts productId={product.id} />
        <RecentlyViewedProducts excludeProductId={product.id} />
      </Container>

      {/* Sticky mobile add-to-cart bar */}
      <div className="lg:hidden fixed bottom-14 left-0 right-0 z-30 bg-white border-t border-border px-4 py-2.5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 truncate">{product.name}</p>
          <PriceTag value={product.price * amountProduct} size="md" />
        </div>
        <Button
          size="sm"
          disabled={outOfStock}
          onClick={() => handleAddToCart(product.id, amountProduct)}
          leftSection={<ShoppingCartIcon weight="bold" size={14} />}
        >
          {outOfStock ? 'Out of stock' : 'Add to cart'}
        </Button>
      </div>

      {/* Lightbox */}
      <Modal
        opened={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        size="auto"
        centered
        padding={0}
        withCloseButton={false}
        classNames={{ body: 'relative bg-black', content: 'bg-black' }}
      >
        <button
          type="button"
          onClick={() => setLightboxOpen(false)}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>
        <img src={activeImg} alt={product.name} className="max-w-[90vw] max-h-[85vh] object-contain mx-auto" />
        {resolvedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                const idx = resolvedImages.indexOf(activeImg)
                const prevIdx = (idx - 1 + resolvedImages.length) % resolvedImages.length
                setActiveImg(resolvedImages[prevIdx])
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <CaretLeftIcon size={20} />
            </button>
            <button
              type="button"
              onClick={() => {
                const idx = resolvedImages.indexOf(activeImg)
                const nextIdx = (idx + 1) % resolvedImages.length
                setActiveImg(resolvedImages[nextIdx])
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <CaretRightIcon size={20} />
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}

export default ProductDetailPage
