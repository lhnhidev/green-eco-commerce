import { useGetAllProducts } from '@api'
import FormSendEmail from '@components/features/FormSendEmail'
import { ProductSlider } from '@components/features/products/ProductSlider'
import FeatureSection from '@components/ui/landing/FeatureSection'
import HeroSection from '@components/ui/landing/HeroSection'
import TrustSection from '@components/ui/landing/TrustSection'
import Loading from '@components/ui/status/Loading'
import { Button } from '@mantine/core'
import { Link } from 'react-router'

const GroupProductSliderWithButtonShowMore = () => {
  const percent = '25%'
  const productTotal = 8
  const delayTime = 2500

  const {
    data: products,
    isLoading,
    isError,
  } = useGetAllProducts({
    PageSize: productTotal,
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
      <HeroSection />
      <TrustSection />

      <div>
        <FeatureSection
          title="Featured Eco-Friendly Products"
          description="Hand-picked sustainable products perfect for a zero-waste lifestyle"
          contentComponent={<GroupProductSliderWithButtonShowMore />}
          backgroundColor={null}
        />
      </div>

      <FeatureSection
        title="Stay Updated"
        description="Get sustainable living tips, new arrivals, and exclusive offers delivered to your inbox"
        contentComponent={<FormSendEmail />}
        backgroundColor="plant-gradient"
      />
    </div>
  )
}
