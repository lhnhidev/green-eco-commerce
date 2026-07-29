import { useGetAllProducts } from '@api'
import { ProductSortBy } from '@api/schemas'
import BannerCarousel from '@components/features/banners/BannerCarousel'
import CategoryTiles from '@components/features/categories/CategoryTiles'
import FormSendEmail from '@components/features/FormSendEmail'
import { ProductSlider } from '@components/features/products/ProductSlider'
import RecentlyViewedProducts from '@components/features/products/RecentlyViewedProducts'
import FeatureSection from '@components/ui/landing/FeatureSection'
import HeroSection from '@components/ui/landing/HeroSection'
import TrustSection from '@components/ui/landing/TrustSection'
import Seo from '@components/ui/Seo'
import Loading from '@components/ui/status/Loading'
import { Button } from '@mantine/core'
import { Link } from 'react-router'

type ProductShowcaseSliderProps = {
  sortBy?: ProductSortBy
  sortDescending?: boolean
}

const ProductShowcaseSlider = ({ sortBy, sortDescending }: ProductShowcaseSliderProps) => {
  const percent = '25%'
  const productTotal = 8
  const delayTime = 2500

  const {
    data: products,
    isLoading,
    isError,
  } = useGetAllProducts({
    pageSize: productTotal,
    sortBy,
    sortDescending,
  })

  if (isLoading) {
    return <Loading text="Loading"></Loading>
  }

  if (isError || products === undefined || products.items.length === 0) {
    return <div>Can't load products now</div>
  }

  return (
    <div>
      <ProductSlider products={products.items} delayTime={delayTime} percent={percent} />
      <div className="text-center mt-12">
        <Link to="/products">
          <Button size="lg" variant="outline" radius="xl" color="primary.8" className="transition-all hover:scale-105">
            View All Products
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function HomePage() {
  return (
    <div className="min-h-screen bg-(--color-background)">
      <Seo
        title="Sustainable Eco-Friendly Shopping"
        description="Shop eco-friendly, sustainable products with a transparent carbon footprint on every item."
      />
      <BannerCarousel />
      <HeroSection />

      <div>
        <FeatureSection
          title="Shop by Category"
          description="Browse our range of sustainable products, organized to help you find what you need"
          contentComponent={<CategoryTiles />}
          backgroundColor={null}
        />
      </div>

      <div>
        <FeatureSection
          title="Featured Eco-Friendly Products"
          description="Hand-picked sustainable products perfect for a zero-waste lifestyle"
          contentComponent={<ProductShowcaseSlider />}
          backgroundColor={null}
        />
      </div>

      <div>
        <FeatureSection
          title="Best Selling"
          description="The products our community reaches for again and again"
          contentComponent={<ProductShowcaseSlider sortBy={ProductSortBy.BestSelling} sortDescending />}
          backgroundColor="plant-gradient"
        />
      </div>

      <div>
        <FeatureSection
          title="New Arrivals"
          description="Fresh additions to the catalog — the latest ways to shop more sustainably"
          contentComponent={<ProductShowcaseSlider sortBy={ProductSortBy.Newest} sortDescending />}
          backgroundColor={null}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <RecentlyViewedProducts />
      </div>

      <TrustSection />

      <FeatureSection
        title="Stay Updated"
        description="Get sustainable living tips, new arrivals, and exclusive offers delivered to your inbox"
        contentComponent={<FormSendEmail />}
        backgroundColor="plant-gradient"
      />
    </div>
  )
}
