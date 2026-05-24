import { Badge, Button, Card, Tabs } from '@mantine/core'
import {
  ArrowLeftIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  ShareNetworkIcon,
  ShieldCheckIcon,
  StarIcon,
  TruckIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { useLocation, useParams } from 'wouter'
import { useCart } from '../context/CartContext'
import { ImageWithFallback } from './ImageWithFallback'

export function ProductDetailPage() {
  const [, navigate] = useLocation()
  const { id: productId } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const product = {
    id: productId || '1',
    name: 'Monstera Deliciosa',
    price: 45,
    originalPrice: 60,
    rating: 4.8,
    reviews: 124,
    badge: 'Best Seller',
    inStock: true,
    stockCount: 15,
    description:
      'The Monstera Deliciosa, also known as the Swiss Cheese Plant, is a stunning indoor plant famous for its large, glossy leaves with natural splits and holes. This tropical beauty brings a touch of the jungle to your home and is perfect for plant enthusiasts of all levels.',
    features: [
      'Large, glossy split leaves',
      'Air purifying qualities',
      'Low to medium light requirements',
      'Pet-friendly (with supervision)',
      'Moderate watering needs',
    ],
    careInstructions: {
      light: 'Bright, indirect light',
      water: 'Water when top inch of soil is dry',
      humidity: '50-60% humidity preferred',
      temperature: '65-85°F (18-29°C)',
      soil: 'Well-draining potting mix',
    },
    images: [
      'https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545239088-d30982e62de7?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&h=600&fit=crop',
    ],
  }

  const relatedProducts = [
    { id: '2', name: 'Peace Lily', price: 28, rating: 4.6, reviews: 89, badge: 'Air Purifier' },
    { id: '3', name: 'Snake Plant', price: 35, rating: 4.9, reviews: 156, badge: 'Low Maintenance' },
    {
      id: '4',
      name: 'Fiddle Leaf Fig',
      price: 85,
      originalPrice: 100,
      rating: 4.5,
      reviews: 67,
      badge: 'Statement Plant',
    },
    { id: '5', name: 'Rubber Tree', price: 55, rating: 4.4, reviews: 78 },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button
        variant="subtle"
        color="gray"
        className="mb-6 px-0"
        onClick={() => navigate('/products')}
        leftSection={<ArrowLeftIcon className="h-4 w-4" />}
      >
        Back to Products
      </Button>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl plant-shadow">
            <ImageWithFallback
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover"
            />
            {product.badge && (
              <Badge color="green.9" size="lg" className="absolute top-4 left-4">
                {product.badge}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative overflow-hidden rounded-lg ${selectedImage === index ? 'ring-2 ring-primary' : ''}`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <StarIcon className="h-5 w-5 text-yellow-400" weight="fill" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="subtle" size="sm" color="gray">
                  <HeartIcon className="h-4 w-4" />
                </Button>
                <Button variant="subtle" size="sm" color="gray">
                  <ShareNetworkIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-primary">${product.price}</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>

          <p className="text-gray-500 leading-relaxed">{product.description}</p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  color="green.9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="sm" color="green.9" onClick={() => setQuantity(quantity + 1)}>
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm">
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock ? `In stock (${product.stockCount} available)` : 'Out of stock'}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              radius="xl"
              color="green.9"
              className="flex-1"
              disabled={!product.inStock}
              onClick={() => addToCart(product.id, quantity)}
            >
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" radius="xl" color="green.9">
              Buy Now
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t">
            <div className="flex items-center gap-3">
              <TruckIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Free Delivery</p>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Plant Guarantee</p>
                <p className="text-xs text-gray-500">30-day health guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-16">
        <Tabs defaultValue="features" color="green.9">
          <Tabs.List grow>
            <Tabs.Tab value="features">Features</Tabs.Tab>
            <Tabs.Tab value="care">Care Guide</Tabs.Tab>
            <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="features" className="space-y-4 pt-6">
            <h3 className="font-semibold">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </Tabs.Panel>

          <Tabs.Panel value="care" className="space-y-4 pt-6">
            <h3 className="font-semibold">Care Instructions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(product.careInstructions).map(([key, value]) => (
                <div key={key} className="flex flex-col gap-1">
                  <span className="font-medium capitalize">{key}:</span>
                  <span className="text-gray-500">{value}</span>
                </div>
              ))}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value="reviews" className="space-y-4 pt-6">
            <h3 className="font-semibold">Customer Reviews</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} className="h-4 w-4 text-yellow-400" weight="fill" />
                    ))}
                  </div>
                  <span className="font-medium">Sarah M.</span>
                  <span className="text-sm text-gray-500">Verified Purchase</span>
                </div>
                <p className="text-sm">
                  Absolutely love this plant! It arrived in perfect condition and has been thriving in my living room.
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <StarIcon key={star} className="h-4 w-4 text-yellow-400" weight="fill" />
                    ))}
                    <StarIcon className="h-4 w-4 text-gray-300" />
                  </div>
                  <span className="font-medium">Mike J.</span>
                  <span className="text-sm text-gray-500">Verified Purchase</span>
                </div>
                <p className="text-sm">
                  Great plant, though it took a few weeks to adjust. Now it's growing beautifully!
                </p>
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>
      </Card>

      {/* Related Products */}
      <section>
        <h2 className="text-2xl font-bold text-primary mb-6">You Might Also Like</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((related) => (
            <Card
              key={related.id}
              shadow="sm"
              padding={0}
              radius="md"
              className="group hover:shadow-lg transition-shadow plant-shadow cursor-pointer"
              onClick={() => navigate(`/products/${related.id}`)}
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=300&h=300&fit=crop"
                  alt={related.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {related.badge && (
                  <Badge color="green.9" className="absolute top-2 left-2">
                    {related.badge}
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{related.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <StarIcon className="h-4 w-4 text-yellow-400" weight="fill" />
                  <span className="text-sm font-medium">{related.rating}</span>
                  <span className="text-sm text-gray-500">({related.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-primary">${related.price}</span>
                    {related.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${related.originalPrice}</span>
                    )}
                  </div>
                  <Button
                    size="xs"
                    radius="xl"
                    color="green.9"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(related.id, 1)
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
