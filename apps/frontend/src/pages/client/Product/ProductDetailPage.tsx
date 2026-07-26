import { getGetCartQueryKey, useAddCartItem, useGetProductById } from '@api'
import ProductReviews from '@components/features/reviews/ProductReviews'
import ImgSlider from '@components/ui/img-slider/ImgSlider'
import Loading from '@components/ui/status/Loading'
import { useAppSelector } from '@hooks/useAppSelector'
import { Anchor, Breadcrumbs, NumberInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { HeartIcon, LeafIcon, ShieldCheckIcon, ShoppingCartIcon, StarIcon, TreeIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { formatParam } from '@utils/formatParam'
import type * as React from 'react'
import { useState } from 'react'
import { useParams } from 'react-router'

const ProductDetailPage = () => {
  const { id } = useParams()

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

  const imgUrlActive = useAppSelector((state) => state.imgSlider.imgUrlActive)
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center' })

  const queryClient = useQueryClient()

  const { mutate } = useAddCartItem({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
      },
    },
  })

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

  const items = [
    { id: 1, title: 'Home', href: '/' },
    { id: 2, title: 'Products', href: '/products' },
    { id: 3, title: product.name, href: `/products/${product.id}` },
  ].map((item) => (
    <Anchor href={item.href} key={item.id} className="text-sm text-gray-500 hover:text-primary transition-colors">
      {item.title}
    </Anchor>
  ))

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
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <Breadcrumbs separator="/" className="mb-8">
          {items}
        </Breadcrumbs>

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
                src={imgUrlActive}
              />
              <div className="absolute top-4 left-4">
                <div className="backdrop-blur-md bg-white/70 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
                  <LeafIcon weight="fill" className="text-green-600 text-sm" />
                  <span className="text-[11px] font-bold tracking-widest text-green-800 uppercase">Eco-Certified</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <ImgSlider imgs={product.imageUrl} isAuto={false} delayTime={0} percent="25%" />
            </div>
          </div>

          {/* Product Details Section */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-6 mb-6">
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-400">
                  ${product.price.toFixed(2)}
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400 text-lg">
                    <StarIcon weight="fill" />
                    <StarIcon weight="fill" />
                    <StarIcon weight="fill" />
                    <StarIcon weight="fill" />
                    <StarIcon weight="thin" />
                  </div>
                  <span className="text-sm font-medium text-gray-500 hover:text-primary cursor-pointer transition-colors border-b border-dashed border-gray-400">
                    48 Reviews
                  </span>
                </div>
              </div>

              {/* Eco Impact Premium Card */}
              <div className="relative overflow-hidden bg-linear-to-br from-green-50 to-emerald-50/30 rounded-3xl p-8 mb-8 border border-green-100/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-green-200 group">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-green-400/10 rounded-full blur-3xl group-hover:bg-green-400/20 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-emerald-300/10 rounded-full blur-2xl group-hover:bg-emerald-300/20 transition-all duration-500" />

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
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-green-100 shadow-sm">
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
                      value={amountProduct}
                      size="md"
                      radius="xl"
                      classNames={{
                        input: '!text-center !font-bold !text-lg !border-gray-200 focus:!border-primary',
                        control: '!border-none !bg-gray-50 hover:!bg-gray-100',
                      }}
                      onChange={(value) =>
                        setAmountProduct(typeof value === 'number' ? value : parseInt(value.toString(), 10) || 1)
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Total Price</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${(product.price * amountProduct).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/** biome-ignore lint/a11y/useButtonType: <> */}
                  <button
                    onClick={() => handleAddToCart(product.id, amountProduct)}
                    className="flex-1 cursor-pointer bg-linear-to-r from-green-600 to-emerald-500 text-white font-bold py-4 px-6 rounded-xl tracking-wide flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                  >
                    <ShoppingCartIcon weight="bold" className="text-xl" />
                    <span>Add to Cart</span>
                  </button>
                  {/** biome-ignore lint/a11y/useButtonType: <> */}
                  <button
                    className="sm:flex-none cursor-pointer px-6 bg-white border-2 border-gray-200 text-gray-600 py-4 rounded-xl font-bold flex items-center justify-center hover:border-red-200 hover:text-red-500 hover:bg-red-50 active:scale-[0.98] transition-all duration-300"
                    title="Save to Favorites"
                  >
                    <HeartIcon weight="bold" className="text-xl" />
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
    </div>
  )
}

export default ProductDetailPage
