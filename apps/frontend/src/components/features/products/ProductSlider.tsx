import { Carousel } from '@mantine/carousel'
import { Center, Loader, Text } from '@mantine/core'
import { useGetApiProductsSome } from '../../../api'
import ProductCard from './ProductCard'
import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

export function ProductSlider() {
  const productsAmount = 8
  const delayTime = 2500

  const {
    data: products,
    isLoading,
    isError,
  } = useGetApiProductsSome({
    PageNumber: 1,
    PageSize: productsAmount,
  })

  const autoplay = useRef(Autoplay({ delay: delayTime }))

  if (isLoading) {
    return (
      <Center h={300}>
        <Loader color="green" size="lg" type="dots" />
      </Center>
    )
  }

  if (isError || !products || products.length === 0) {
    return (
      <Center h={200}>
        <Text c="dimmed">Can't load products list now.</Text>
      </Center>
    )
  }

  return (
    <Carousel
      type="container"
      slideSize={{ base: '100%', '300px': '50%', '500px': '25%' }}
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
