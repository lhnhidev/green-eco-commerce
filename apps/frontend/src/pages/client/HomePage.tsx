import { Button } from '@mantine/core'
import { Link } from 'react-router'
import FormSendEmail from '../../components/features/FormSendEmail'
import { ProductSlider } from '../../components/features/products/ProductSlider'
import FeatureSection from '../../components/ui/landing/FeatureSection'
import HeroSection from '../../components/ui/landing/HeroSection'
import TrustSection from '../../components/ui/landing/TrustSection'

const GroupProductSliderWithButtonShowMore = () => {
  return (
    <div>
      <ProductSlider />
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
