import { Badge, Button, Card, Checkbox, Group, Select, Slider } from '@mantine/core'
import { FunnelIcon, ListBulletsIcon, SquaresFourIcon, StarIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLocation } from 'wouter'
import { useCart } from '../context/CartContext'
import { ImageWithFallback } from './ImageWithFallback'

export function ProductsPage() {
  const [, navigate] = useLocation()
  const { addToCart } = useCart()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState(200)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const categories = [
    { id: 'indoor', label: 'Indoor Plants', count: 45 },
    { id: 'outdoor', label: 'Outdoor Plants', count: 38 },
    { id: 'succulents', label: 'Succulents', count: 22 },
    { id: 'flowering', label: 'Flowering Plants', count: 31 },
    { id: 'foliage', label: 'Foliage Plants', count: 29 },
    { id: 'herbs', label: 'Herbs & Edibles', count: 18 },
  ]

  const products = [
    {
      id: '1',
      name: 'Monstera Deliciosa',
      price: 45,
      originalPrice: 60,
      rating: 4.8,
      reviews: 124,
      category: 'indoor',
      badge: 'Best Seller',
      inStock: true,
      description: 'Popular indoor plant with stunning split leaves',
    },
    {
      id: '2',
      name: 'Peace Lily',
      price: 28,
      rating: 4.6,
      reviews: 89,
      category: 'indoor',
      badge: 'Air Purifier',
      inStock: true,
      description: 'Beautiful white flowers and air-purifying qualities',
    },
    {
      id: '3',
      name: 'Snake Plant',
      price: 35,
      rating: 4.9,
      reviews: 156,
      category: 'indoor',
      badge: 'Low Maintenance',
      inStock: true,
      description: 'Perfect for beginners, thrives in low light',
    },
    {
      id: '4',
      name: 'Fiddle Leaf Fig',
      price: 85,
      originalPrice: 100,
      rating: 4.5,
      reviews: 67,
      category: 'indoor',
      badge: 'Statement Plant',
      inStock: true,
      description: 'Large dramatic leaves make a bold statement',
    },
    {
      id: '5',
      name: 'Jade Plant',
      price: 22,
      rating: 4.7,
      reviews: 93,
      category: 'succulents',
      badge: 'Lucky Plant',
      inStock: true,
      description: 'Succulent known for bringing good luck',
    },
    {
      id: '6',
      name: 'Rubber Tree',
      price: 55,
      rating: 4.4,
      reviews: 78,
      category: 'indoor',
      inStock: false,
      description: 'Glossy leaves and easy care requirements',
    },
    {
      id: '7',
      name: 'Aloe Vera',
      price: 18,
      rating: 4.8,
      reviews: 145,
      category: 'succulents',
      badge: 'Medicinal',
      inStock: true,
      description: 'Healing properties and beautiful form',
    },
    {
      id: '8',
      name: 'Bird of Paradise',
      price: 120,
      originalPrice: 150,
      rating: 4.3,
      reviews: 42,
      category: 'indoor',
      badge: 'Exotic',
      inStock: true,
      description: 'Tropical beauty with large paddle-shaped leaves',
    },
  ]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">All Plants</h1>
          <p className="text-gray-500">Discover our complete collection of beautiful plants</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
            color="green.9"
            leftSection={<FunnelIcon className="h-4 w-4" />}
          >
            Filters
          </Button>
          <Group gap="xs">
            <Button
              variant={viewMode === 'grid' ? 'filled' : 'subtle'}
              size="sm"
              color="green.9"
              onClick={() => setViewMode('grid')}
            >
              <SquaresFourIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'filled' : 'subtle'}
              size="sm"
              color="green.9"
              onClick={() => setViewMode('list')}
            >
              <ListBulletsIcon className="h-4 w-4" />
            </Button>
          </Group>
          <Select
            defaultValue="featured"
            data={[
              { value: 'featured', label: 'Featured' },
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Highest Rated' },
              { value: 'newest', label: 'Newest' },
            ]}
            className="w-48"
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 space-y-6`}>
          <Card shadow="sm" padding="lg" radius="md">
            <h3 className="font-semibold mb-4">Categories</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between">
                  <Checkbox
                    label={category.label}
                    color="green.9"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(event) => handleCategoryChange(category.id, event.currentTarget.checked)}
                  />
                  <span className="text-xs text-gray-500">({category.count})</span>
                </div>
              ))}
            </div>
          </Card>

          <Card shadow="sm" padding="lg" radius="md">
            <h3 className="font-semibold mb-4">Price Range</h3>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                onChange={setPriceRange}
                max={200}
                step={5}
                color="green.9"
                marks={[
                  { value: 0, label: '$0' },
                  { value: 200, label: '$200' },
                ]}
              />
            </div>
          </Card>

          <Card shadow="sm" padding="lg" radius="md">
            <h3 className="font-semibold mb-4">Features</h3>
            <div className="space-y-3">
              {['Air Purifier', 'Low Light', 'Pet Safe', 'Easy Care', 'Fast Growing'].map((feature) => (
                <Checkbox key={feature} label={feature} color="green.9" />
              ))}
            </div>
          </Card>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Showing {products.length} products</p>
          </div>

          <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {products.map((product) => (
              <Card
                key={product.id}
                shadow="sm"
                padding={0}
                radius="md"
                className={`group hover:shadow-lg transition-shadow plant-shadow cursor-pointer ${viewMode === 'list' ? 'flex' : ''}`}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className={`${viewMode === 'list' ? 'flex w-full' : ''}`}>
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48' : 'rounded-t-lg'}`}>
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=300&h=300&fit=crop"
                      alt={product.name}
                      className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                        viewMode === 'list' ? 'w-48 h-32' : 'w-full h-48'
                      }`}
                    />
                    {product.badge && (
                      <Badge color="green.9" className="absolute top-2 left-2">
                        {product.badge}
                      </Badge>
                    )}
                    {!product.inStock && (
                      <Badge color="red" className="absolute top-2 right-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                    <div>
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      {viewMode === 'list' && <p className="text-sm text-gray-500 mb-2">{product.description}</p>}
                      <div className="flex items-center gap-1 mb-2">
                        <StarIcon className="h-4 w-4 text-yellow-400" weight="fill" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-primary">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                      <Button
                        size="xs"
                        radius="xl"
                        color="green.9"
                        disabled={!product.inStock}
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product.id)
                        }}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <Group gap="xs">
              <Button variant="outline" size="sm" disabled color="green.9">
                Previous
              </Button>
              <Button size="sm" color="green.9">
                1
              </Button>
              <Button variant="outline" size="sm" color="green.9">
                2
              </Button>
              <Button variant="outline" size="sm" color="green.9">
                3
              </Button>
              <Button variant="outline" size="sm" color="green.9">
                Next
              </Button>
            </Group>
          </div>
        </main>
      </div>
    </div>
  )
}
