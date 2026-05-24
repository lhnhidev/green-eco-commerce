import { Badge, Button, Card } from '@mantine/core'
import { HeadsetIcon, LeafIcon, ShieldCheckIcon, StarIcon, TruckIcon } from '@phosphor-icons/react'
import { useLocation } from 'wouter'
import { ImageWithFallback } from './ImageWithFallback'

export function HomePage() {
  const [, navigate] = useLocation()

  const featuredProducts = [
    {
      id: '1',
      name: 'Monstera Deliciosa',
      price: 45,
      originalPrice: 60,
      rating: 4.8,
      reviews: 124,
      badge: 'Best Seller',
    },
    {
      id: '2',
      name: 'Peace Lily',
      price: 28,
      rating: 4.6,
      reviews: 89,
      badge: 'Air Purifier',
    },
    {
      id: '3',
      name: 'Snake Plant',
      price: 35,
      rating: 4.9,
      reviews: 156,
      badge: 'Low Maintenance',
    },
    {
      id: '4',
      name: 'Fiddle Leaf Fig',
      price: 85,
      originalPrice: 100,
      rating: 4.5,
      reviews: 67,
      badge: 'Statement Plant',
    },
  ]

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Delivery',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Plant Guarantee',
      description: '30-day health guarantee on all plants',
    },
    {
      icon: HeadsetIcon,
      title: 'Plant Care Support',
      description: '24/7 expert plant care guidance',
    },
    {
      icon: LeafIcon,
      title: 'Eco-Friendly',
      description: 'Sustainable packaging & practices',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
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

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Featured Plants</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Hand-picked plants perfect for beginners and plant enthusiasts alike
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                shadow="sm"
                padding={0}
                radius="md"
                className="group hover:shadow-lg transition-shadow plant-shadow"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=300&h=300&fit=crop"
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge color="green.9" className="absolute top-2 left-2">
                    {product.badge}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <StarIcon className="h-4 w-4 text-yellow-400" weight="fill" />
                    <span className="text-sm font-medium">{product.rating}</span>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-primary">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <Button size="xs" radius="xl" color="green.9">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" radius="xl" color="green.9" onClick={() => navigate('/products')}>
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="plant-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Stay Updated</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Get plant care tips, new arrivals, and exclusive offers delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full border bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button radius="xl" color="green.9" className="px-8">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LeafIcon className="h-6 w-6" weight="fill" />
                <span className="text-xl font-semibold">GreenCart</span>
              </div>
              <p className="text-white/80 text-sm">
                Your trusted partner in bringing nature into your home with healthy, beautiful plants.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <button type="button" onClick={() => navigate('/products')}>
                    All Plants
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/products')}>
                    Indoor Plants
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/products')}>
                    Outdoor Plants
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/products')}>
                    Plant Care
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <button type="button" onClick={() => navigate('/remedies')}>
                    Plant Remedies
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => navigate('/feedback')}>
                    Feedback
                  </button>
                </li>
                <li>FAQ</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>support@greencart.com</li>
                <li>1-800-GREEN-CART</li>
                <li>Mon-Fri 9AM-6PM EST</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white/60">
            © 2025 GreenCart. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
