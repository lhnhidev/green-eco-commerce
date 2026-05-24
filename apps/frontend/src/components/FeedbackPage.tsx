import { Badge, Button, Card, Select, Textarea, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { ArrowLeftIcon, ChatCircleDotsIcon, PaperPlaneRightIcon, StarIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLocation } from 'wouter'

export function FeedbackPage() {
  const [, navigate] = useLocation()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [module, setModule] = useState<string | null>(null)
  const [comments, setComments] = useState('')

  const handleSubmitFeedback = () => {
    if (!module || !comments || rating === 0) {
      notifications.show({
        title: 'Missing fields',
        message: 'Please fill in all required fields',
        color: 'red',
      })
      return
    }

    notifications.show({
      title: 'Thank you!',
      message: 'Thank you for your feedback! We appreciate your input.',
      color: 'green',
    })

    setRating(0)
    setHoveredRating(0)
    setModule(null)
    setComments('')
  }

  const modules = [
    'Homepage',
    'Product Catalog',
    'Product Details',
    'Shopping Cart',
    'Authentication',
    'Plant Remedies',
    'Admin Dashboard',
    'Seller Dashboard',
    'Overall Experience',
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="subtle"
        color="gray"
        className="mb-6 px-0"
        onClick={() => navigate('/')}
        leftSection={<ArrowLeftIcon className="h-4 w-4" />}
      >
        Back to Home
      </Button>

      <div className="max-w-2xl mx-auto">
        <Card shadow="sm" padding="xl" radius="md">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <ChatCircleDotsIcon className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">Share Your Feedback</h2>
            </div>
            <p className="text-gray-500">Help us improve GreenCart by sharing your thoughts and suggestions</p>
          </div>

          <div className="space-y-6">
            <Select
              label="Module/Feature *"
              placeholder="Select the module you're providing feedback on"
              data={modules}
              value={module}
              onChange={setModule}
            />

            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Overall Rating *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="transition-colors"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <StarIcon
                      className={`h-8 w-8 ${star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      weight={star <= (hoveredRating || rating) ? 'fill' : 'regular'}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-500">
                  {rating > 0 && (
                    <>
                      {rating} star{rating !== 1 ? 's' : ''}
                      {rating === 1 && ' - Poor'}
                      {rating === 2 && ' - Fair'}
                      {rating === 3 && ' - Good'}
                      {rating === 4 && ' - Very Good'}
                      {rating === 5 && ' - Excellent'}
                    </>
                  )}
                </span>
              </div>
            </div>

            <Textarea
              label="Comments & Suggestions *"
              placeholder="Please share your detailed feedback, suggestions for improvement, or any issues you encountered..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              minRows={4}
            />

            {/* Optional Contact Info */}
            <div className="space-y-4">
              <h3 className="font-medium">Contact Information (Optional)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <TextInput label="Name" placeholder="Your name" />
                <TextInput label="Email" type="email" placeholder="your.email@example.com" />
              </div>
            </div>

            {/* Feedback Categories */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['Bug Report', 'Feature Request', 'UI/UX Feedback', 'Performance'].map((type) => (
                  <Button key={type} variant="outline" size="xs" color="green.9">
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmitFeedback}
              fullWidth
              radius="xl"
              size="lg"
              color="green.9"
              leftSection={<PaperPlaneRightIcon className="h-4 w-4" />}
            >
              Submit Feedback
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Your feedback helps us make GreenCart better for everyone.
            </p>
          </div>
        </Card>

        {/* Recent Feedback */}
        <Card shadow="sm" padding="xl" radius="md" className="mt-8">
          <h3 className="text-lg font-bold mb-2">Recent Community Feedback</h3>
          <p className="text-gray-500 text-sm mb-4">See what other users are saying about GreenCart</p>
          <div className="space-y-4">
            {[
              {
                module: 'Product Catalog',
                rating: 5,
                comment: 'Love the new filtering options! Makes finding the right plants so much easier.',
                user: 'Plant Lover',
              },
              {
                module: 'Plant Remedies',
                rating: 4,
                comment: 'The remedy suggestions are very helpful. Would love to see more detailed instructions.',
                user: 'Garden Enthusiast',
              },
              {
                module: 'Overall Experience',
                rating: 5,
                comment: 'Beautiful design and very intuitive. Best plant shopping experience online!',
                user: 'Green Thumb',
              },
            ].map((feedback, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="light" color="green">
                    {feedback.module}
                  </Badge>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        weight={i < feedback.rating ? 'fill' : 'regular'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-2">"{feedback.comment}"</p>
                <p className="text-xs text-gray-500">- {feedback.user}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
