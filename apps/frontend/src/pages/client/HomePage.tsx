import FormSendEmail from '../../components/features/FormSendEmail'
import ProductList from '../../components/features/ProductList'
import FeatureSection from '../../components/ui/landing/FeatureSection'
import HeroSection from '../../components/ui/landing/HeroSection'
import TrustSection from '../../components/ui/landing/TrustSection'
export function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustSection />

      <FeatureSection
        title="Featured Plants"
        description="Hand-picked plants perfect for beginners and plant enthusiasts alike"
        contentComponent={<ProductList />}
        backgroundColor={null}
      />

      <FeatureSection
        title="Stay Updated"
        description="Get plant care tips, new arrivals, and exclusive offers delivered to your inbox"
        contentComponent={<FormSendEmail />}
        backgroundColor="plant-gradient"
      />
    </div>
  )
}
