import { Button } from '@mantine/core'
import { Link } from 'react-router'

const HeroSection = () => (
  <section className="plant-gradient py-6">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-primary leading-tight">
          Essentials that breathe <span className="text-green-600 italic">with the planet.</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Transparent sourcing, plastic-free shipping, and a commitment to longevity.
        </p>
      </div>
      <div className="flex gap-3 shrink-0">
        <Link to="/products">
          <Button size="sm" radius="xl" color="primary" className="transition-all hover:scale-105">
            Shop Sustainably
          </Button>
        </Link>
        <Link to="/about#impact">
          <Button variant="outline" size="sm" radius="xl" color="primary" className="transition-all hover:scale-105">
            Our Impact Report
          </Button>
        </Link>
      </div>
    </div>
  </section>
)

export default HeroSection
