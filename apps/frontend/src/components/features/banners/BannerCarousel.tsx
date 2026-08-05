import { useGetActiveBanners } from '@api'
import type { BannerDto } from '@api/schemas'
import Container from '@components/ui/primitives/Container'
import { Carousel } from '@mantine/carousel'
import { Skeleton } from '@mantine/core'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import Autoplay from 'embla-carousel-autoplay'
import { useRef } from 'react'
import { Link } from 'react-router'

const BannerSlide = ({ banner }: { banner: BannerDto }) => (
  <Carousel.Slide>
    <Link
      to={banner.linkUrl ?? '/products'}
      className="block relative overflow-hidden h-[220px] sm:h-[300px] lg:h-[380px]"
    >
      <img src={resolveImageUrl(banner.imageUrl)} alt={banner.title} className="w-full h-full object-cover" />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/30 to-transparent" />
      {/* Text */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 max-w-md">
        <h2 className="text-white text-xl md:text-3xl font-semibold leading-tight drop-shadow-lg">{banner.title}</h2>
        {banner.subtitle && (
          <p className="text-white/85 mt-2 text-sm md:text-base leading-relaxed drop-shadow">{banner.subtitle}</p>
        )}
        <span className="mt-3 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full w-fit border border-white/30 transition-colors">
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
    return (
      <Container className="pt-4">
        <Skeleton height={300} radius="lg" />
      </Container>
    )
  }

  if (banners.length === 0) return null

  return (
    <Container className="pt-4">
      <div className="rounded-lg overflow-hidden">
        <Carousel
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={() => autoplay.current.play()}
          withIndicators
          emblaOptions={{
            loop: true,
          }}
          classNames={{
            indicators: 'bottom-3',
            indicator: 'w-1.5 h-1.5 bg-white/60 data-[active]:bg-white data-[active]:w-5 transition-all duration-300',
          }}
        >
          {banners.map((b) => (
            <BannerSlide key={b.id} banner={b} />
          ))}
        </Carousel>
      </div>
    </Container>
  )
}

export default BannerCarousel
