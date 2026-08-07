import {
  invalidateGetCart,
  invalidateGetWishlist,
  invalidateIsInWishlist,
  useAddCartItem,
  useAddToWishlist,
  useGetCategoryById,
  useGetProductById,
  useIsInWishlist,
  useRemoveFromWishlist,
} from '@api'
import { MAX_COMPARE_ITEMS, toggleCompare } from '@components/features/compare/compare.slice'
import RecentlyViewedProducts from '@components/features/products/RecentlyViewedProducts'
import RelatedProducts from '@components/features/products/RelatedProducts'
import { recordProductView } from '@components/features/products/recentlyViewed.slice'
import ProductReviews from '@components/features/reviews/ProductReviews'
import ImageWithFallback from '@components/ui/ImageWithFallback'
import ImgSlider from '@components/ui/img-slider/ImgSlider'
import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Container from '@components/ui/primitives/Container'
import PriceTag from '@components/ui/primitives/PriceTag'
import Prose from '@components/ui/primitives/Prose'
import Stat from '@components/ui/primitives/Stat'
import Seo from '@components/ui/Seo'
import StockBadge from '@components/ui/StockBadge'
import Loading from '@components/ui/status/Loading'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { useAuth } from '@hooks/useAuth'
import { ActionIcon, Badge, Button, Modal, NumberInput, Progress, Rating, Tabs, Tooltip, Paper, Text, Group } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  ArrowsClockwiseIcon,
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
        await invalidateGetCart(queryClient)
      },
    },
  })

  const { data: isWishlisted } = useIsInWishlist(id ?? '', {
    query: {
      enabled: !!user && !!id,
      staleTime: 1000 * 60 * 5,
    },
  })

  const { data: category } = useGetCategoryById(product?.categoryId ?? '', {
    query: {
      enabled: !!product?.categoryId,
      staleTime: 1000 * 60 * 5,
    },
  })
  const invalidateWishlist = async () => {
    await invalidateGetWishlist(queryClient)
    if (id) await invalidateIsInWishlist(queryClient, id)
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
    ...(category ? [{ title: category.name, href: `/products?categoryId=${category.id}` }] : []),
    { title: product.name, href: `/products/${product.id}` },
  ]

  const outOfStock = product.stockQty <= 0
  const unavailable = !product.isActive

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
    <div className="min-h-screen bg-slate-50/30 pb-20 lg:pb-0 relative font-sans selection:bg-primary/20 selection:text-primary">
      {/* Soft background gradient blob */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-linear-to-b from-green-50/80 to-transparent -z-10" />

      <Seo
        title={product.name}
        description={product.description ?? undefined}
        image={resolveImageUrl(product.imageUrl[0]) ?? undefined}
      />

      <Container className="py-8 relative z-10">
        <PageBreadcrumbs items={breadcrumbItems} className="mb-6 opacity-80 hover:opacity-100 transition-opacity" separator="/" />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            {/** biome-ignore lint/a11y/noStaticElementInteractions: mouse-driven zoom, not a control */}
            <div
              className="relative w-full aspect-4/3 overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <ImageWithFallback
                className="w-full h-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-110"
                style={zoomStyle}
                alt={product.name}
                src={activeImg}
              />
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-white/20">
                  <LeafIcon weight="fill" size={14} className="text-primary" />
                  <span className="text-xs font-semibold text-gray-800 tracking-wide uppercase">Eco-Certified</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxOpen(true)
                }}
                className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-gray-700 hover:text-primary hover:scale-110 transition-all duration-300"
                aria-label="View full size image"
              >
                <ArrowsOutIcon size={18} />
              </button>
            </div>

            <ImgSlider
              imgs={resolvedImages}
              isAuto={false}
              delayTime={0}
              percent="25%"
              activeImg={activeImg}
              onSelect={setActiveImg}
              alt={product.name}
            />
          </div>

          {/* Buy box */}
          <div className="lg:sticky lg:top-[100px] lg:self-start flex flex-col gap-6">
            {product.materials && product.materials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {/* {product.materials.map((material) => (
                  <Badge key={material.id} size="sm" variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }} className="shadow-sm">
                    {material.name}
                  </Badge>
                ))} */}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight tracking-tight">{product.name}</h1>

              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100">
                  <Rating value={product?.rating ?? 0} fractions={2} readOnly size="sm" color="orange" />
                  <span className="text-sm font-bold text-orange-700 ml-2">{product?.rating?.toFixed(1) ?? '0.0'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reviews')
                    document.getElementById('product-tabs')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-sm text-gray-500 hover:text-primary underline underline-offset-4 transition-colors font-medium"
                >
                  {product.reviewsCount === 1 ? '1 review' : `${product.reviewsCount} reviews`}
                </button>
              </div>
            </div>

            <div className="h-px w-full bg-linear-to-r from-gray-200 to-transparent" />

            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-4">
                <PriceTag value={product.price} size="xl" />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {unavailable ? (
                  <Badge size="md" color="gray" variant="filled" radius="sm">
                    Unavailable
                  </Badge>
                ) : (
                  <StockBadge stockQty={product.stockQty} />
                )}

                {carbonSaved && (
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold border border-green-100 shadow-sm">
                    <ShieldCheckIcon weight="fill" size={16} />
                    {carbonSaved}% less CO₂
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] mt-2">
              <div className="flex items-end gap-5 mb-6">
                <NumberInput
                  label={<span className="text-sm font-semibold text-gray-700 mb-1.5 block">Quantity</span>}
                  description={<span className="text-xs font-medium text-gray-500 mt-1 block">{product.stockQty} available</span>}
                  min={1}
                  max={product.stockQty}
                  value={amountProduct}
                  disabled={outOfStock || unavailable}
                  w={110}
                  size="md"
                  radius="md"
                  onChange={(value) => {
                    const parsed = typeof value === 'number' ? value : parseInt(value.toString(), 10) || 1
                    setAmountProduct(Math.min(Math.max(1, parsed), product.stockQty))
                  }}
                  classNames={{ input: 'font-semibold text-center' }}
                />
                <div className="flex flex-col pb-1">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Subtotal</span>
                  <PriceTag value={product.price * amountProduct} size="lg" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  radius="md"
                  className="flex-1 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
                  color="primary"
                  disabled={outOfStock || unavailable}
                  onClick={() => handleAddToCart(product.id, amountProduct)}
                  leftSection={<ShoppingCartIcon weight="bold" size={20} />}
                >
                  {unavailable ? 'Unavailable' : outOfStock ? 'Out of stock' : 'Add to cart'}
                </Button>

                <Tooltip label={isWishlisted ? 'Remove from favorites' : 'Save to favorites'} withArrow position="top">
                  <ActionIcon
                    variant={isWishlisted ? 'light' : 'default'}
                    size="xl"
                    radius="md"
                    color={isWishlisted ? 'red' : 'gray'}
                    onClick={handleWishlist}
                    className={`shadow-sm transition-all duration-300 ${isWishlisted ? 'bg-red-50 text-red-500 border-red-100' : 'hover:bg-gray-50'}`}
                  >
                    <HeartIcon weight={isWishlisted ? 'fill' : 'bold'} size={22} className={isWishlisted ? 'scale-110 transition-transform' : ''} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label={isComparing ? 'Remove from compare' : 'Add to compare'} withArrow position="top">
                  <ActionIcon
                    variant={isComparing ? 'light' : 'default'}
                    size="xl"
                    radius="md"
                    color={isComparing ? 'primary' : 'gray'}
                    onClick={handleCompare}
                    className={`shadow-sm transition-all duration-300 ${isComparing ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-gray-50'}`}
                  >
                    <ScalesIcon weight={isComparing ? 'fill' : 'bold'} size={22} />
                  </ActionIcon>
                </Tooltip>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/60 border border-gray-100 shadow-sm">
                 <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-primary">
                   <TreeIcon weight="fill" size={20} />
                 </div>
                 <span className="text-sm font-semibold text-gray-700 leading-tight">Eco-friendly<br/>packaging</span>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/60 border border-gray-100 shadow-sm">
                 <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                   <ShieldCheckIcon weight="fill" size={20} />
                 </div>
                 <span className="text-sm font-semibold text-gray-700 leading-tight">Authentic<br/>quality</span>
              </div>
            </div>
          </div>
        </div>

        <Tabs
          id="product-tabs"
          value={activeTab}
          onChange={setActiveTab}
          className="mt-20 lg:mt-32"
          classNames={{
            list: 'border-b border-gray-200 mb-8 gap-4',
            tabLabel: 'text-base',
            tab: 'text-base font-semibold text-gray-500 hover:text-gray-900 data-[active]:text-primary data-[active]:border-primary pb-4 transition-colors px-1',
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="description">Description</Tabs.Tab>
            <Tabs.Tab value="sustainability">Sustainability</Tabs.Tab>
            <Tabs.Tab value="reviews">Reviews ({product.reviewsCount})</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="description" pt="md">
            <Prose className="text-gray-700 leading-relaxed text-lg!">{formatParam(product.description, '\n\n')}</Prose>
          </Tabs.Panel>

          <Tabs.Panel value="sustainability" pt="md">
            <div className="flex flex-col gap-12 max-w-5xl">
              {/* Carbon Footprint Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <TreeIcon weight="fill" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Environmental Impact</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <Paper shadow="sm" radius="xl" p="xl" className="border border-green-100 bg-gradient-to-br from-green-50/80 to-white relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-green-100/50 group-hover:scale-110 transition-transform duration-500">
                      <LeafIcon weight="fill" size={120} />
                    </div>
                    <Text size="sm" tt="uppercase" fw={700} c="green.8" mb={8} className="tracking-wider">Carbon Footprint</Text>
                    <div className="flex items-baseline gap-2">
                      <Text size="3xl" fw={800} c="gray.9">{product.carbonIndex}</Text>
                      <Text size="md" fw={600} c="dimmed">kg CO₂e</Text>
                    </div>
                  </Paper>

                  <Paper shadow="sm" radius="xl" p="xl" className="border border-gray-100 bg-white">
                    <Text size="sm" tt="uppercase" fw={700} c="gray.5" mb={8} className="tracking-wider">Standard Baseline</Text>
                    <div className="flex items-baseline gap-2">
                      <Text size="3xl" fw={800} c="gray.9">{product.baselineCarbonIndex}</Text>
                      <Text size="md" fw={600} c="dimmed">kg CO₂e</Text>
                    </div>
                  </Paper>

                  {carbonSaved && (
                    <Paper shadow="sm" radius="xl" p="xl" className="border border-primary/20 bg-primary/5">
                      <Text size="sm" tt="uppercase" fw={700} c="primary" mb={8} className="tracking-wider">CO₂e Saved</Text>
                      <div className="flex items-baseline gap-2 text-primary">
                        <Text size="3xl" fw={800}>{carbonSaved}%</Text>
                        <Text size="md" fw={600}>less emissions</Text>
                      </div>
                    </Paper>
                  )}
                </div>
              </section>

              {/* End of Life Section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                    <ArrowsClockwiseIcon weight="fill" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">End of Life</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                  <Paper shadow="sm" radius="xl" p="xl" className="border border-gray-100 bg-white">
                    <Group justify="space-between" mb="md">
                      <Text size="lg" fw={700} c="gray.8">Decomposable</Text>
                      <Badge size="lg" color="primary" variant="light" radius="md" className="font-bold">{product.decomposePercent}%</Badge>
                    </Group>
                    <Progress value={product.decomposePercent} color="primary" size="xl" radius="xl" striped animated />
                  </Paper>

                  <Paper shadow="sm" radius="xl" p="xl" className="border border-gray-100 bg-white">
                    <Group justify="space-between" mb="md">
                      <Text size="lg" fw={700} c="gray.8">Recyclable</Text>
                      <Badge size="lg" color="teal" variant="light" radius="md" className="font-bold">{product.recyclePercent}%</Badge>
                    </Group>
                    <Progress value={product.recyclePercent} color="teal" size="xl" radius="xl" striped animated />
                  </Paper>
                </div>
              </section>

              {/* Materials Section */}
              {product.materials.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-amber-50 rounded-lg text-amber-500">
                      <LeafIcon weight="fill" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Materials Composition</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl">
                    {product.materials.map((material) => (
                      <Paper key={material.id} shadow="xs" radius="lg" p="md" className="border border-gray-100 hover:border-primary/40 transition-colors bg-white">
                        <Group justify="space-between">
                          <div>
                            <Text size="md" fw={700} c="gray.9">{material.name}</Text>
                            <Text size="sm" c="dimmed" fw={500} mt={2}>{material.type}</Text>
                          </div>
                          <div className="flex flex-col items-end gap-1 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                            <Text size="xs" fw={700} c="gray.5" tt="uppercase" className="tracking-wider">Eco Rating</Text>
                            <Rating value={material.ecoRating} fractions={2} readOnly size="sm" />
                          </div>
                        </Group>
                      </Paper>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="reviews" pt="md">
            <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100">
               <ProductReviews productId={product.id} reviewsCount={product.reviewsCount} averageRating={product.rating} />
            </div>
          </Tabs.Panel>
        </Tabs>

        <div className="mt-20 flex flex-col gap-16">
          <RelatedProducts productId={product.id} />
          <RecentlyViewedProducts excludeProductId={product.id} />
        </div>
      </Container>

      {/* Sticky mobile add-to-cart bar */}
      <div className="lg:hidden fixed bottom-[72px] left-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-4 py-3 flex items-center gap-4 shadow-[0_-4px_20px_rgb(0,0,0,0.05)]">
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-xs font-semibold text-gray-500 truncate">
            {product.name} <span className="font-normal text-gray-400">({product.stockQty} available)</span>
          </p>
          <PriceTag value={product.price * amountProduct} size="md" />
        </div>
        <Button
          size="md"
          radius="md"
          className="shadow-md"
          disabled={outOfStock}
          onClick={() => handleAddToCart(product.id, amountProduct)}
          leftSection={<ShoppingCartIcon weight="bold" size={16} />}
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
        classNames={{ body: 'relative bg-black/95 backdrop-blur-xl', content: 'bg-transparent shadow-none' }}
        transitionProps={{ transition: 'fade', duration: 300 }}
      >
        <button
          type="button"
          onClick={() => setLightboxOpen(false)}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-md"
          aria-label="Close"
        >
          <XIcon size={20} />
        </button>
        <ImageWithFallback
          src={activeImg}
          alt={product.name}
          className="max-w-[95vw] max-h-[90vh] object-contain mx-auto"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-md"
              aria-label="Previous image"
            >
              <CaretLeftIcon size={24} />
            </button>
            <button
              type="button"
              onClick={() => {
                const idx = resolvedImages.indexOf(activeImg)
                const nextIdx = (idx + 1) % resolvedImages.length
                setActiveImg(resolvedImages[nextIdx])
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-md"
              aria-label="Next image"
            >
              <CaretRightIcon size={24} />
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}

export default ProductDetailPage
