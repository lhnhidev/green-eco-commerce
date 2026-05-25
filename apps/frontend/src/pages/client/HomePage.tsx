import Footer from '../../components/Footer'
import FormSendEmail from '../../components/FormSendEmail'
import ProductList from '../../components/ProductList'
import FeatureSection from '../../sections/FeatureSection'
import HeroSection from '../../sections/HeroSection'
import TrustSection from '../../sections/TrustSection'

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

      <Footer />
    </div>
  )
}
