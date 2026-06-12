import { Carousel } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { changeImgSliderSliceActive } from './img-slider.slice'

type ImgSliderProps = {
  imgs: Array<string> | undefined
  isAuto: boolean
  delayTime?: number
  percent: string
}

const ImgSlider = ({ imgs, isAuto, delayTime = 2500, percent }: ImgSliderProps) => {
  const dispatch = useAppDispatch()

  const autoplay = useRef(Autoplay({ delay: delayTime }))

  if (imgs === undefined) return <div></div>

  dispatch(changeImgSliderSliceActive(imgs[0]))

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
      {imgs.map((img) => (
        <Carousel.Slide key={crypto.randomUUID()}>
          <div className="cursor-pointer hover:brightness-90 transition-all duration-75">
            {/** biome-ignore lint/a11y/noStaticElementInteractions: <> */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: <> */}
            <img
              onClick={() => {
                console.log(123)
                dispatch(changeImgSliderSliceActive(img))
              }}
              src={img}
              alt=""
            />
          </div>
        </Carousel.Slide>
      ))}
    </Carousel>
  )
}

export default ImgSlider
