import Section from '@components/ui/primitives/Section'
import { HeadsetIcon, LeafIcon, ShieldCheckIcon, TruckIcon } from '@phosphor-icons/react'

const TrustSection = () => {
  const features = [
    {
      id: '1',
      icon: TruckIcon,
      title: 'Free Delivery',
      description: 'Free shipping on every order',
    },
    {
      id: '2',
      icon: ShieldCheckIcon,
      title: 'Quality Guarantee',
      description: '30-day guarantee on all sustainable goods',
    },
    {
      id: '3',
      icon: HeadsetIcon,
      title: 'Expert Support',
      description: 'Real humans, Mon–Fri 9AM–6PM EST',
    },
    {
      id: '4',
      icon: LeafIcon,
      title: 'Eco-Friendly',
      description: 'Sustainable packaging & practices',
    },
  ]

  return (
    <Section tone="subtle" size="sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature) => (
          <div key={feature.id} className="text-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 mb-2">
              <feature.icon size={20} className="text-primary" />
            </div>
            <h3 className="font-medium text-sm mb-0.5">{feature.title}</h3>
            <p className="text-xs text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default TrustSection
