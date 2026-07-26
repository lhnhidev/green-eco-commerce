import { useGetActiveBanners } from '@api'
import type { BannerDto } from '@api/schemas'
import { Carousel } from '@mantine/carousel'
import '@mantine/carousel/styles.css'
import { Skeleton } from '@mantine/core'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { Link } from 'react-router'

const BannerSlide = ({ banner }: { banner: BannerDto }) => (
  <Carousel.Slide>
    <Link to={banner.linkUrl ?? '/products'} className="block relative overflow-hidden" style={{ height: 420 }}>
      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/30 to-transparent" />
      {/* Text */}
      <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 max-w-2xl">
        <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight drop-shadow-lg">{banner.title}</h2>
        {banner.subtitle && (
          <p className="text-white/85 mt-3 text-base md:text-lg leading-relaxed drop-shadow">{banner.subtitle}</p>
        )}
        <span className="mt-5 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2.5 rounded-full w-fit border border-white/30 transition-all">
          Shop Now →
        </span>
      </div>
    </Link>
  </Carousel.Slide>
)

const BannerCarousel = () => {
  const autoplay = useRef(Autoplay({ delay: 4500 }))
  const { data: banners = [], isLoading } = useGetActiveBanners()

  if (isLoading) {
    return <Skeleton height={420} />
  }

  if (banners.length === 0) return null

  return (
    <Carousel
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={() => autoplay.current.play()}
      withIndicators
      emblaOptions={{
        loop: true,
      }}
      classNames={{
        indicators: 'bottom-4',
        indicator: 'w-2 h-2 bg-white/60 data-[active]:bg-white data-[active]:w-6 transition-all duration-300',
      }}
    >
      {banners.map((b) => (
        <BannerSlide key={b.id} banner={b} />
      ))}
    </Carousel>
  )
}

export default BannerCarousel
