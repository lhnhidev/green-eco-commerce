import { Button } from '@mantine/core'
import { Link } from 'react-router'
import { useGetApiProductsSome } from '../../api'
import FormSendEmail from '../../components/features/FormSendEmail'
import { ProductSlider } from '../../components/features/products/ProductSlider'
import FeatureSection from '../../components/ui/landing/FeatureSection'
import HeroSection from '../../components/ui/landing/HeroSection'
import TrustSection from '../../components/ui/landing/TrustSection'
import Loading from '../../components/ui/status/Loading'

const GroupProductSliderWithButtonShowMore = () => {
  const percent = '25%'
  const productTotal = 8
  const delayTime = 2500

  const {
    data: products,
    isLoading,
    isError,
  } = useGetApiProductsSome({
    PageNumber: 1,
    PageSize: productTotal,
  })

  if (isError || products === undefined || products.length === 0) {
    return <div>Can't load products now</div>
  }

  return (
    <div>
      {isLoading && <Loading text="Products is loading"></Loading>}
      <ProductSlider products={products} delayTime={delayTime} percent={percent} />
      <div className="text-center mt-12">
        <Link to="/products">
          <Button size="lg" variant="outline" radius="xl" color="green.9">
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
          title="Featured Plants"
          description="Hand-picked plants perfect for beginners and plant enthusiasts alike"
          contentComponent={<GroupProductSliderWithButtonShowMore />}
          backgroundColor={null}
        />
      </div>

      <FeatureSection
        title="Stay Updated"
        description="Get plant care tips, new arrivals, and exclusive offers delivered to your inbox"
        contentComponent={<FormSendEmail />}
        backgroundColor="plant-gradient"
      />
    </div>
  )
}
