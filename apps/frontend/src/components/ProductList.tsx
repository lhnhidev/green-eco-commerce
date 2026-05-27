import { Badge, Button, Card } from '@mantine/core'
import { StarIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { ImageWithFallback } from './ImageWithFallback'

const ProductList = () => {
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

  return (
    <div>
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
        <Link to="/products">
          <Button size="lg" variant="outline" radius="xl" color="green.9">
            View All Products
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default ProductList
