import { Anchor, Breadcrumbs, NumberInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { GrFavorite } from 'react-icons/gr'
import { IoBagHandleOutline } from 'react-icons/io5'
import { useParams } from 'react-router'
import { getGetApiCartQueryKey, useGetApiProductsId, usePostApiCartItems } from '../../../api'
import ImgSlider from '../../../components/ui/img-slider/ImgSlider'
import Loading from '../../../components/ui/status/Loading'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { formatParam } from '../../../utils/formatParam'

const ProductDetailPage = () => {
  const { id } = useParams()

  const [isShowMore, setIsShowMore] = useState<boolean>(false)
  const [amountProduct, setAmountProduct] = useState<number>(1)

  const {
    data: product,
    isLoading,
    isError,
    // biome-ignore lint/style/noNonNullAssertion: <>
  } = useGetApiProductsId(id!, {
    query: {
      enabled: !!id, // Chỉ fetch khi id tồn tại
    },
  })

  const imgUrlActive = useAppSelector((state) => state.imgSlider.imgUrlActive)
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center' })

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

  if (isLoading) {
    return (
      <div className="min-h-200">
        <Loading text="Product detail is loading"></Loading>
      </div>
    )
  }

  if (isError || product === undefined) {
    return <div>Can't load this product.</div>
  }

  const items = [
    { id: 1, title: 'Home', href: '/' },
    { id: 2, title: 'Products', href: '/products' },
    { id: 2, title: product.name, href: `/products/${product.id}` },
  ].map((item) => (
    <Anchor href={item.href} key={item.id}>
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
    <div className="container mx-auto px-45 pt-10 pb-10">
      <Breadcrumbs>{items}</Breadcrumbs>

      <div className="mt-12 grid grid-cols-12 gap-15">
        <div className="col-span-6">
          <div className="lg:col-span-7 flex flex-col gap-4 transition-all duration-700 ease-out opacity-100 translate-y-0">
            {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
            <div
              className="overflow-hidden rounded-lg group cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                className="w-145 h-145 object-cover transition-transform duration-100 ease-out group-hover:scale-150"
                style={zoomStyle} // Truyền tọa độ dynamic vào đây
                alt={product.name}
                src={imgUrlActive}
              />
            </div>
            <ImgSlider imgs={product.imageUrl} isAuto={false} delayTime={0} percent="25%" />
          </div>
        </div>

        <div className="col-span-6">
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-(--color-secondary) text-white uppercase">
                Sustainably Sourced
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold text-primary mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-2xl font-semibold text-primary">${product.price}</p>
              <div className="flex items-center gap-1 text-yellow-500">
                <span className="text-sm ml-1">(48 Reviews)</span>
              </div>
            </div>
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-6 mb-8 shadow-sm hover:bg-primary/10 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4 text-primary">
                <span>eco</span>
                <h3 className="text-xs font-bold uppercase tracking-widest">Eco-Impact</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl text-primary">{product.carbonIndex}</span>
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">Carbon Index</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl text-primary">{product.baselineCarbonIndex}</span>
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
                    Base Line Carbon Index
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="mb-3 w-50">
                <NumberInput
                  min={1}
                  defaultValue={amountProduct}
                  size="md"
                  placeholder="Amount of Product"
                  classNames={{ input: '!text-center !border-none' }}
                  onChange={(value) => setAmountProduct(parseInt(value.toString(), 10))}
                />
              </div>

              <div className="flex items-center gap-4">
                <p className="font-semibold text-primary mb-2 text-2xl uppercase">Descriptions:</p>
                {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
                {/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
                <span
                  onClick={() => setIsShowMore(!isShowMore)}
                  className="cursor-pointer hover:text-(--color-primary) transition-all"
                >
                  Show {isShowMore ? 'less' : 'more'}
                </span>
              </div>
              <p
                className={`text-lg text-justify mb-8 leading-relaxed whitespace-pre-line ${isShowMore ? '' : 'line-clamp-3'}`}
              >
                {formatParam(product.description, '\n\n')}
              </p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              {/** biome-ignore lint/a11y/useButtonType: <> */}
              <button
                onClick={() => handleAddToCart(product.id, amountProduct)}
                className="w-full cursor-pointer bg-primary text-on-primary text-white font-bold py-4 rounded-lg tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-300"
              >
                <IoBagHandleOutline className="text-2xl" />
                <span className="font-bold">ADD TO CART</span>
              </button>
              {/** biome-ignore lint/a11y/useButtonType: <> */}
              <button className="w-full bg-transparent border border-primary text-primary py-4 rounded-lg font-bold tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-(--color-muted) cursor-pointer hover:text-on-primary active:scale-[0.98] transition-all duration-300">
                <GrFavorite className="text-2xl" />
                <span className="font-bold">SAVE TO FAVORITE</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-b border-outline-variant pb-4">
                {/** biome-ignore lint/a11y/useButtonType: <> */}
                <button className="flex justify-between items-center w-full text-left font-bold text-lg tracking-widest text-primary uppercase group">
                  <span className="text-lg uppercase font-bold">Materials & Sourcing</span>
                </button>
                <div className="pt-4 text-sm flex gap-3">
                  {product.materials?.map((material) => {
                    return (
                      <span key={material.id} className="px-3 py-2 bg-(--color-secondary) text-white rounded-lg">
                        {material.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
