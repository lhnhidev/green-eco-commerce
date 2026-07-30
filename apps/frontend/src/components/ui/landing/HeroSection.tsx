import Section from '@components/ui/primitives/Section'
import { Button } from '@mantine/core'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'

const HeroSection = () => (
  <Section tone="brand" size="lg">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold text-primary leading-tight">
          Essentials that breathe <span className="text-green-600 italic">with the planet.</span>
        </h1>
        <p className="text-md text-gray-500 mt-2">
          Transparent sourcing, plastic-free shipping, and a commitment to longevity.
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 shrink-0">
        <Link to="/products">
          <Button size="md">Shop Sustainably</Button>
        </Link>
        <Link
          to="/about#impact"
          className="text-sm text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
        >
          Our impact report <ArrowRightIcon size={13} />
        </Link>
      </div>
    </div>
  </Section>
)

export default HeroSection
