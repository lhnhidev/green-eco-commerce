import ImageWithFallback from '@components/ui/ImageWithFallback'
import { Carousel } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'

type ImgSliderProps = {
  imgs: Array<string> | undefined
  isAuto: boolean
  delayTime?: number
  percent: string
  activeImg?: string
  onSelect?: (img: string) => void
  alt?: string
}

const ImgSlider = ({ imgs, isAuto, delayTime = 2500, percent, activeImg, onSelect, alt }: ImgSliderProps) => {
  const autoplay = useRef(Autoplay({ delay: delayTime }))

  if (imgs === undefined || imgs.length === 0) return null

  return (
    <Carousel
      type="container"
      slideSize={{ base: '100%', '300px': '50%', '500px': percent }}
      slideGap={{ base: 0, '300px': 'md', '500px': 'lg' }}
      emblaOptions={{ loop: true, align: 'start', dragFree: false }}
      controlsOffset="xs"
      // eslint-disable-next-line react-hooks/refs
      plugins={isAuto ? [autoplay.current] : []}
      onMouseEnter={() => isAuto && autoplay.current.stop()}
      onMouseLeave={() => isAuto && autoplay.current.play()}
    >
      {imgs.map((img, index) => (
        <Carousel.Slide key={`${index}-${img}`}>
          <button
            type="button"
            onClick={() => onSelect?.(img)}
            className={`block w-full hover:brightness-90 transition-all duration-150 rounded-lg overflow-hidden ${activeImg === img ? 'border-4 border-primary' : ''}`}
            aria-label={`View product image ${index + 1}`}
            aria-current={activeImg === img}
          >
            <ImageWithFallback
              src={img}
              alt={alt ? `${alt} thumbnail ${index + 1}` : `Product thumbnail ${index + 1}`}
              className="w-full aspect-4/3 object-cover"
            />
          </button>
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

export default ImgSlider
