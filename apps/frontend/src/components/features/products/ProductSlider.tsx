import { Carousel } from '@mantine/carousel'
import ProductCard from './ProductCardv1'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import type { ProductDto } from '../../../api/schemas'

type ProductSliderProps = {
  products: Array<ProductDto>
  delayTime: number
  percent: string
}

export function ProductSlider({ products, delayTime, percent }: ProductSliderProps) {
  const autoplay = useRef(Autoplay({ delay: delayTime }))

  return (
    <Carousel
      type="container"
      slideSize={{ base: '100%', '300px': '50%', '500px': percent }}
      slideGap={{ base: 0, '300px': 'md', '500px': 'lg' }}
      emblaOptions={{ loop: true, align: 'start', dragFree: false }}
      controlsOffset="xs"
      // eslint-disable-next-line react-hooks/refs
      plugins={[autoplay.current]}
      onMouseEnter={() => autoplay.current.stop()}
      onMouseLeave={() => autoplay.current.play()}
    >
      {products.map((product) => (
        <Carousel.Slide key={product.id}>
          <ProductCard product={product} />
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}
