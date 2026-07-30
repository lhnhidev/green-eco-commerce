import { useGetAllProducts } from '@api'
import { ProductSortBy } from '@api/schemas'
import BannerCarousel from '@components/features/banners/BannerCarousel'
import CategoryTiles from '@components/features/categories/CategoryTiles'
import FormSendEmail from '@components/features/FormSendEmail'
import ProductCard from '@components/features/products/ProductCard'
import { ProductSlider } from '@components/features/products/ProductSlider'
import RecentlyViewedProducts from '@components/features/products/RecentlyViewedProducts'
import Container from '@components/ui/primitives/Container'
import ProductGrid from '@components/ui/primitives/ProductGrid'
import Section from '@components/ui/primitives/Section'
import FeatureSection from '@components/ui/landing/FeatureSection'
import HeroSection from '@components/ui/landing/HeroSection'
import TrustSection from '@components/ui/landing/TrustSection'
import Seo from '@components/ui/Seo'
import Loading from '@components/ui/status/Loading'
import { Button } from '@mantine/core'
import { LeafIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

const SHOWCASE_SIZE = 8

const ProductShowcaseSlider = ({ sortBy, sortDescending }: { sortBy?: ProductSortBy; sortDescending?: boolean }) => {
  const { data: products, isLoading, isError } = useGetAllProducts({ pageSize: SHOWCASE_SIZE, sortBy, sortDescending })

  if (isLoading) return <Loading text="Loading" />
  if (isError || products === undefined || products.items.length === 0) {
    return <p className="text-sm text-muted-foreground">Can't load products right now.</p>
  }

  return <ProductSlider products={products.items} delayTime={2500} percent="25%" />
}

const BestSellingGrid = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useGetAllProducts({ pageSize: SHOWCASE_SIZE, sortBy: ProductSortBy.BestSelling, sortDescending: true })

  if (isLoading) return <Loading text="Loading" />
  if (isError || products === undefined || products.items.length === 0) {
    return <p className="text-sm text-muted-foreground">Can't load products right now.</p>
  }

  return (
    <ProductGrid variant="showcase">
      {products.items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ProductGrid>
  )
}

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Sustainable Eco-Friendly Shopping"
        description="Shop eco-friendly, sustainable products with a transparent carbon footprint on every item."
      />

      <HeroSection />
      <BannerCarousel />

      <FeatureSection
        title="Shop by Category"
        description="Browse our range of sustainable products, organized to help you find what you need"
        contentComponent={<CategoryTiles />}
      />

      <FeatureSection
        title="Best Selling"
        description="The products our community reaches for again and again"
        tone="subtle"
        action={
          <Link
            to="/products?sortBy=BestSelling&order=desc"
            className="text-sm font-medium text-primary hover:text-primary-hover"
          >
            View all →
          </Link>
        }
        contentComponent={<BestSellingGrid />}
      />

      {/* Sustainability promo — the one deliberately promotional split on this page */}
      <Section size="md">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="plant-gradient rounded-lg aspect-[4/3] flex items-center justify-center">
            <LeafIcon size={72} weight="fill" className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Committed to sustainability</h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Every product on GreenCart is measured for its carbon footprint against conventional alternatives, so you
              can shop with a clear conscience — not just good intentions.
            </p>
            <Link to="/about">
              <Button size="md" variant="light">
                Read our impact report
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      <FeatureSection
        title="New Arrivals"
        description="Fresh additions to the catalog — the latest ways to shop more sustainably"
        tone="subtle"
        action={
          <Link
            to="/products?sortBy=Newest&order=desc"
            className="text-sm font-medium text-primary hover:text-primary-hover"
          >
            View all →
          </Link>
        }
        contentComponent={<ProductShowcaseSlider sortBy={ProductSortBy.Newest} sortDescending />}
      />

      <Container className="py-6">
        <RecentlyViewedProducts />
      </Container>

      <TrustSection />

      <Section size="sm" tone="brand">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Stay updated</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Get sustainable living tips, new arrivals, and exclusive offers delivered to your inbox
          </p>
        </div>
        <FormSendEmail />
      </Section>
    </div>
  )
}
