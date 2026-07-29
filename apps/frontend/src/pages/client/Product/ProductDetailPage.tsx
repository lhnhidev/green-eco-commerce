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
import PriceTag from '@components/ui/primitives/PriceTag'
import Seo from '@components/ui/Seo'
import Loading from '@components/ui/status/Loading'
import StockBadge from '@components/ui/StockBadge'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useAuth } from '@hooks/useAuth'
import { Modal, NumberInput, Rating } from '@mantine/core'
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
import { formatCurrency } from '@utils/formatCurrency'
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

  const [isShowMore, setIsShowMore] = useState<boolean>(false)
  const [amountProduct, setAmountProduct] = useState<number>(1)

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
      staleTime: 1000 * 60 * 5
    }
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

  if (isLoading) {
    return (
      <div className="min-h-200 flex items-center justify-center">
        <Loading text="Loading product details..."></Loading>
      </div>
    )
  }

  if (isError || product === undefined) {
    return (
      <div className="min-h-200 flex items-center justify-center text-red-500 font-medium">
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

  return (
    <div className="min-h-screen bg-gray-50/30 pb-36 lg:pb-0">
      <Seo
        title={product.name}
        description={product.description ?? undefined}
        image={resolveImageUrl(product.imageUrl[0]) ?? undefined}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <PageBreadcrumbs
          items={breadcrumbItems}
          separator="/"
          className="mb-8"
          classNames={{ breadcrumb: 'text-sm text-gray-500 hover:text-primary transition-colors' }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Image Gallery Section */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
            <div
              className="relative w-full aspect-square overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100 group cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                className="w-full h-full object-contain p-4 transition-transform duration-300 ease-out group-hover:scale-150"
                style={zoomStyle}
                alt={product.name}
                src={activeImg}
              />
              <div className="absolute top-4 left-4">
                <div
                  className="backdrop-blur-md bg-white/70 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
                  <LeafIcon weight="fill" className="text-green-600 text-sm" />
                  <span className="text-[11px] font-bold tracking-widest text-green-800 uppercase">Eco-Certified</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxOpen(true)
                }}
                className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-600 hover:text-primary hover:scale-110 transition-all"
                aria-label="View full size image"
              >
                <ArrowsOutIcon size={16} />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <ImgSlider imgs={resolvedImages} isAuto={false} delayTime={0} percent="25%" activeImg={activeImg} onSelect={setActiveImg} />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-6 mb-6">
                <div
                  className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-400">
                  {formatCurrency(product.price)}
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <Rating value={product?.rating ?? 0} fractions={2} readOnly size="sm" />
                  <a
                    href="#reviews"
                    className="text-sm font-medium text-gray-500 hover:text-primary transition-colors border-b border-dashed border-gray-400"
                  >
                    {product.reviewsCount === 1 ? '1 Review' : `${product.reviewsCount} Reviews`}
                  </a>
                </div>
                <StockBadge stockQty={product.stockQty} />
              </div>

              {/* Eco Impact Premium Card */}
              <div
                className="relative overflow-hidden bg-linear-to-br from-green-50 to-emerald-50/30 rounded-3xl p-8 mb-8 border border-green-100/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-green-200 group">
                <div
                  className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-400/10 rounded-full blur-3xl group-hover:bg-green-400/20 transition-all duration-500" />
                <div
                  className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-emerald-300/10 rounded-full blur-2xl group-hover:bg-emerald-300/20 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <TreeIcon weight="fill" className="text-2xl text-green-500" />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-green-800">Environmental Impact</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col">
                      <div className="flex items-end gap-1 mb-1">
                        <span className="text-4xl font-black text-green-700">{product.carbonIndex}</span>
                        <span className="text-sm font-bold text-green-600 mb-1">kg CO₂e</span>
                      </div>
                      <span className="text-xs uppercase tracking-wider text-green-600/80 font-semibold">
                        Product Carbon Footprint
                      </span>
                    </div>

                    <div className="flex flex-col border-l border-green-200/50 pl-8">
                      <div className="flex items-end gap-1 mb-1">
                        <span className="text-4xl font-black text-gray-400">{product.baselineCarbonIndex}</span>
                        <span className="text-sm font-bold text-gray-400 mb-1">kg CO₂e</span>
                      </div>
                      <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        Standard Baseline
                      </span>
                    </div>
                  </div>

                  {product.baselineCarbonIndex > product.carbonIndex && (
                    <div
                      className="mt-6 inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-100 shadow-sm">
                      <ShieldCheckIcon weight="fill" className="text-green-500 text-lg" />
                      <span className="text-xs font-bold text-green-800">
                        {(
                          ((product.baselineCarbonIndex - product.carbonIndex) / product.baselineCarbonIndex) *
                          100
                        ).toFixed(0)}
                        % less emissions than conventional alternatives
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">About this product</h3>
                  {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
                  {/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
                  <span
                    onClick={() => setIsShowMore(!isShowMore)}
                    className="text-sm font-semibold text-primary cursor-pointer hover:text-green-600 transition-colors flex items-center gap-1"
                  >
                    Read {isShowMore ? 'less' : 'more'}
                  </span>
                </div>
                <div
                  className={`prose prose-sm md:prose-base prose-green max-w-none text-gray-600 leading-relaxed whitespace-pre-line ${isShowMore ? '' : 'line-clamp-3'}`}
                >
                  {formatParam(product.description, '\n\n')}
                </div>
              </div>

              {/* Actions Section */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8">
                <div className="flex items-end gap-6 mb-6">
                  <div className="flex-1 max-w-35">
                    {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">
                      Quantity
                    </label>
                    <NumberInput
                      min={1}
                      max={product.stockQty}
                      value={amountProduct}
                      size="md"
                      radius="xl"
                      disabled={outOfStock}
                      classNames={{
                        input: '!text-center !font-bold !text-lg !border-gray-200 focus:!border-primary',
                        control: '!border-none !bg-gray-50 hover:!bg-gray-100',
                      }}
                      onChange={(value) => {
                        const parsed = typeof value === 'number' ? value : parseInt(value.toString(), 10) || 1
                        setAmountProduct(Math.min(Math.max(1, parsed), product.stockQty))
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Price</div>
                    <PriceTag value={product.price * amountProduct} size="lg" colorClassName="text-gray-900" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product.id, amountProduct)}
                    disabled={outOfStock}
                    className="flex-1 cursor-pointer bg-linear-to-r from-green-600 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl tracking-wide flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <ShoppingCartIcon weight="bold" className="text-xl" />
                    <span>{outOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleWishlist}
                    className={`sm:flex-none cursor-pointer px-6 bg-white border-2 py-4 rounded-xl font-bold flex items-center justify-center transition-all duration-300 active:scale-[0.98] ${
                      isWishlisted
                        ? 'border-red-200 text-red-500 bg-red-50'
                        : 'border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-500 hover:bg-red-50'
                    }`}
                    title={isWishlisted ? 'Remove from Favorites' : 'Save to Favorites'}
                  >
                    <HeartIcon weight={isWishlisted ? 'fill' : 'bold'} className="text-xl" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCompare}
                    className={`sm:flex-none cursor-pointer px-6 bg-white border-2 py-4 rounded-xl font-bold flex items-center justify-center transition-all duration-300 active:scale-[0.98] ${
                      isComparing
                        ? 'border-green-200 text-primary bg-green-50'
                        : 'border-gray-200 text-gray-600 hover:border-green-200 hover:text-primary hover:bg-green-50'
                    }`}
                    title={isComparing ? 'Remove from Compare' : 'Add to Compare'}
                  >
                    <ScalesIcon weight={isComparing ? 'fill' : 'bold'} className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Materials */}
              {product.materials && product.materials.length > 0 && (
                <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">
                    Materials & Sourcing
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.materials.map((material) => (
                      <div
                        key={material.id}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium shadow-sm hover:border-green-300 hover:text-green-700 transition-colors cursor-default"
                      >
                        {material.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      {product && (
        <div id="reviews" className="container mx-auto px-4 max-w-7xl pb-8 scroll-mt-24">
          <ProductReviews productId={product.id} reviewsCount={product.reviewsCount} averageRating={product.rating} />
        </div>
      )}

      {/* Related Products */}
      {product && (
        <div className="container mx-auto px-4 max-w-7xl pb-16">
          <RelatedProducts productId={product.id} />
        </div>
      )}

      {/* Recently Viewed */}
      <div className="container mx-auto px-4 max-w-7xl">
        <RecentlyViewedProducts excludeProductId={product.id} />
      </div>

      {/* Sticky mobile add-to-cart bar */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-white border-t border-gray-100 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 truncate">{product.name}</p>
          <PriceTag value={product.price * amountProduct} />
        </div>
        <button
          type="button"
          onClick={() => handleAddToCart(product.id, amountProduct)}
          disabled={outOfStock}
          className="shrink-0 bg-linear-to-r from-green-600 to-emerald-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCartIcon weight="bold" />
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
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
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          aria-label="Close"
        >
          <XIcon size={18} />
        </button>
        <img
          src={activeImg}
          alt={product.name}
          className="max-w-[90vw] max-h-[85vh] object-contain mx-auto"
        />
        {resolvedImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => {
                const idx = resolvedImages.indexOf(activeImg)
                const prevIdx = (idx - 1 + resolvedImages.length) % resolvedImages.length
                setActiveImg(resolvedImages[prevIdx])
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
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
