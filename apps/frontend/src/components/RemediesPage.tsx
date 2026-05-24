import { Badge, Button, Card, TextInput } from '@mantine/core'
import { BookOpenIcon, ClockIcon, LeafIcon, MagnifyingGlassIcon, StarIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLocation } from 'wouter'
import { ImageWithFallback } from './ImageWithFallback'

export function RemediesPage() {
  const [, navigate] = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', label: 'All Remedies', count: 45 },
    { id: 'respiratory', label: 'Respiratory', count: 12 },
    { id: 'digestive', label: 'Digestive', count: 8 },
    { id: 'skin', label: 'Skin Care', count: 15 },
    { id: 'stress', label: 'Stress & Anxiety', count: 6 },
    { id: 'pain', label: 'Pain Relief', count: 4 },
  ]

  const remedies = [
    {
      id: 1,
      illness: 'Common Cold',
      plants: ['Eucalyptus', 'Peppermint', 'Ginger'],
      description: 'Natural remedies to help alleviate cold symptoms and boost immune system',
      difficulty: 'Easy',
      prepTime: '10 mins',
      rating: 4.8,
      reviews: 124,
      category: 'respiratory',
      remedySteps: [
        'Boil 2 cups of water with fresh eucalyptus leaves',
        'Add a few drops of peppermint oil',
        'Inhale the steam for 5-10 minutes',
        'Drink ginger tea throughout the day',
      ],
    },
    {
      id: 2,
      illness: 'Digestive Issues',
      plants: ['Aloe Vera', 'Chamomile', 'Fennel'],
      description: 'Soothing natural remedies for stomach upset and digestive discomfort',
      difficulty: 'Easy',
      prepTime: '5 mins',
      rating: 4.6,
      reviews: 89,
      category: 'digestive',
      remedySteps: [
        'Extract fresh aloe vera gel from the leaf',
        'Mix 1 tablespoon with water or juice',
        'Drink before meals',
        'Brew chamomile tea as needed',
      ],
    },
    {
      id: 3,
      illness: 'Skin Irritation',
      plants: ['Lavender', 'Calendula', 'Aloe Vera'],
      description: 'Gentle plant-based solutions for various skin conditions and irritations',
      difficulty: 'Medium',
      prepTime: '15 mins',
      rating: 4.9,
      reviews: 156,
      category: 'skin',
      remedySteps: [
        'Create a lavender oil infusion',
        'Mix with aloe vera gel',
        'Add calendula extract',
        'Apply gently to affected area',
      ],
    },
    {
      id: 4,
      illness: 'Stress & Anxiety',
      plants: ['Lavender', 'Chamomile', 'Passionflower'],
      description: 'Calming herbs to help reduce stress and promote relaxation',
      difficulty: 'Easy',
      prepTime: '20 mins',
      rating: 4.7,
      reviews: 93,
      category: 'stress',
      remedySteps: [
        'Brew a blend of chamomile and passionflower',
        'Add lavender essential oil to a diffuser',
        'Drink the herbal tea before bedtime',
        'Practice deep breathing with lavender aromatherapy',
      ],
    },
    {
      id: 5,
      illness: 'Headaches',
      plants: ['Peppermint', 'Willow Bark', 'Feverfew'],
      description: 'Natural pain relief remedies for tension headaches and migraines',
      difficulty: 'Medium',
      prepTime: '10 mins',
      rating: 4.4,
      reviews: 67,
      category: 'pain',
      remedySteps: [
        'Apply diluted peppermint oil to temples',
        'Brew feverfew tea and drink slowly',
        'Use willow bark extract as directed',
        'Rest in a cool, dark room',
      ],
    },
    {
      id: 6,
      illness: 'Insomnia',
      plants: ['Valerian Root', 'Lavender', 'Chamomile'],
      description: 'Natural sleep aids to help improve sleep quality and duration',
      difficulty: 'Easy',
      prepTime: '25 mins',
      rating: 4.5,
      reviews: 78,
      category: 'stress',
      remedySteps: [
        'Prepare valerian root tea 1 hour before bed',
        'Use lavender pillow spray or sachets',
        'Drink chamomile tea before bedtime',
        'Create a relaxing bedtime routine',
      ],
    },
  ]

  const filteredRemedies = remedies.filter((remedy) => {
    const matchesSearch =
      remedy.illness.toLowerCase().includes(searchQuery.toLowerCase()) ||
      remedy.plants.some((plant) => plant.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || remedy.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPlants = [
    { name: 'Aloe Vera', uses: 'Skin care, Digestive health', difficulty: 'Easy' },
    { name: 'Lavender', uses: 'Stress relief, Sleep aid', difficulty: 'Easy' },
    { name: 'Peppermint', uses: 'Digestive, Respiratory', difficulty: 'Medium' },
    { name: 'Chamomile', uses: 'Relaxation, Sleep', difficulty: 'Easy' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Plant Remedies</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Discover natural, plant-based remedies for common health concerns. Learn how to use the healing power of
          plants to support your wellness journey.
        </p>
      </div>

      {/* Search */}
      <Card shadow="sm" padding="lg" radius="md" className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <TextInput
            placeholder="Search by illness or plant name (e.g., 'cold', 'lavender', 'headache')"
            leftSection={<MagnifyingGlassIcon className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button radius="xl" color="green.9" leftSection={<MagnifyingGlassIcon className="h-4 w-4" />}>
            Search Remedies
          </Button>
        </div>
      </Card>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <aside className="lg:col-span-1">
          <Card shadow="sm" padding="lg" radius="md">
            <h3 className="text-lg font-bold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'filled' : 'subtle'}
                  color="green.9"
                  fullWidth
                  justify="space-between"
                  onClick={() => setSelectedCategory(category.id)}
                  rightSection={
                    <Badge variant="light" color={selectedCategory === category.id ? 'white' : 'gray'}>
                      {category.count}
                    </Badge>
                  }
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </Card>

          {/* Featured Medicinal Plants */}
          <Card shadow="sm" padding="lg" radius="md" className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <LeafIcon className="h-5 w-5 text-primary" weight="fill" />
              <h3 className="text-lg font-bold">Featured Plants</h3>
            </div>
            <div className="space-y-4">
              {featuredPlants.map((plant, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h4 className="font-semibold text-primary">{plant.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{plant.uses}</p>
                  <Badge variant="outline" color="green.9" size="sm">
                    {plant.difficulty}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" fullWidth color="green.9" onClick={() => navigate('/products')}>
                Shop Medicinal Plants
              </Button>
            </div>
          </Card>
        </aside>

        {/* Remedies Grid */}
        <main className="lg:col-span-3">
          <div className="mb-6">
            <p className="text-sm text-gray-500">
              Showing {filteredRemedies.length} remedies{searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredRemedies.map((remedy) => (
              <Card
                key={remedy.id}
                shadow="sm"
                padding={0}
                radius="md"
                className="group hover:shadow-lg transition-shadow plant-shadow"
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=400&h=200&fit=crop"
                    alt={remedy.illness}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge color="green.9" className="absolute top-2 left-2">
                    {remedy.category.charAt(0).toUpperCase() + remedy.category.slice(1)}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-primary mb-2">{remedy.illness}</h3>
                  <p className="text-gray-500 mb-4">{remedy.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {remedy.plants.map((plant, index) => (
                      <Badge key={index} variant="light" color="green">
                        {plant}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {remedy.prepTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpenIcon className="h-4 w-4" />
                      {remedy.difficulty}
                    </div>
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-4 w-4 text-yellow-400" weight="fill" />
                      {remedy.rating} ({remedy.reviews})
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium">Remedy Steps:</h4>
                    <ol className="text-sm text-gray-500 space-y-1">
                      {remedy.remedySteps.slice(0, 2).map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="bg-primary text-white rounded-full w-4 h-4 text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                      {remedy.remedySteps.length > 2 && (
                        <li className="text-primary text-sm">+ {remedy.remedySteps.length - 2} more steps</li>
                      )}
                    </ol>
                  </div>

                  <Button fullWidth radius="xl" color="green.9">
                    View Full Remedy
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredRemedies.length === 0 && (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold mb-2">No remedies found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or browse different categories.</p>
              <Button onClick={() => setSearchQuery('')} color="green.9">
                Clear Search
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Disclaimer */}
      <Card shadow="sm" padding="lg" radius="md" className="mt-12 border-yellow-200 bg-yellow-50">
        <div className="flex items-start gap-3">
          <div className="h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-xs font-bold text-yellow-800">!</span>
          </div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Important Disclaimer</h4>
            <p className="text-sm text-yellow-700">
              The information provided here is for educational purposes only and is not intended to replace professional
              medical advice. Always consult with a healthcare provider before using plants for medicinal purposes,
              especially if you have existing health conditions, are pregnant, or are taking medications.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
