import { Button } from '@mantine/core'
import { useLocation } from 'wouter'
import { ImageWithFallback } from '../components/ImageWithFallback'

const HeroSection = () => {
  const [, navigate] = useLocation()

  return (
    <section className="plant-gradient py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
              Bring Nature
              <br />
              <span className="text-green-600">Home</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-md">
              Discover our curated collection of healthy, beautiful plants that transform your space into a green
              paradise.
            </p>
            <div className="flex gap-4">
              <Button size="lg" radius="xl" color="green.9" onClick={() => navigate('/products')}>
                Shop Plants
              </Button>
              <Button variant="outline" size="lg" radius="xl" color="green.9" onClick={() => navigate('/remedies')}>
                Plant Remedies
              </Button>
            </div>
          </div>
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop"
              alt="Beautiful indoor plants collection"
              className="rounded-2xl w-full h-100 object-cover plant-shadow"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
