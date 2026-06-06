import { HeadsetIcon, LeafIcon, ShieldCheckIcon, TruckIcon } from '@phosphor-icons/react'

const TrustSection = () => {
  const features = [
    {
      id: '1',
      icon: TruckIcon,
      title: 'Free Delivery',
      description: 'Free shipping on orders over $50',
    },
    {
      id: '2',
      icon: ShieldCheckIcon,
      title: 'Plant Guarantee',
      description: '30-day health guarantee on all plants',
    },
    {
      id: '3',
      icon: HeadsetIcon,

      title: 'Plant Care Support',
      description: '24/7 expert plant care guidance',
    },
    {
      id: '4',
      icon: LeafIcon,
      title: 'Eco-Friendly',
      description: 'Sustainable packaging & practices',
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustSection
