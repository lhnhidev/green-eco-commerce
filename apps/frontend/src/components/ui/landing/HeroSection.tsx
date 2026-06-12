import { Button } from '@mantine/core'
import { Link } from 'react-router'
import { ImageWithFallback } from '../status/ImageWithFallback'

const HeroSection = () => {
  return (
    <section className="plant-gradient py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-primary">
              Essentials that breathe
              <br />
              <span className="text-green-600 italic">with the planet.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-md">
              Curating high-quality, sustainable alternatives for your everyday life. Transparent sourcing, plastic-free
              shipping, and a commitment to longevity.
            </p>
            <div className="flex gap-4">
              <Link to="/products">
                <Button size="lg" radius="xl" color="green.9">
                  Shop Sustainably
                </Button>
              </Link>
              <Link to="/remedies">
                <Button variant="outline" size="lg" radius="xl" color="green.9">
                  Our Impact Report
                </Button>
              </Link>
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
