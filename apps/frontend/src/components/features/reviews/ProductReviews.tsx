import { invalidateGetProductById, invalidateGetProductReviews, useCreateReview, useGetProductReviews } from '@api'
import type { ProblemDetails } from '@api/schemas'
import { useAuth } from '@hooks/useAuth'
import { Avatar, Button, Pagination, Progress, Rating, Select, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { ChatIcon, StarIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'

const PAGE_SIZE = 5

interface ProductReviewsProps {
  productId: string
  averageRating: number
  reviewsCount: number
}

const ProductReviews = ({ productId, reviewsCount, averageRating }: ProductReviewsProps) => {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const location = useLocation()
  const [page, setPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'newest' | 'highest' | 'lowest'>('newest')

  const { data, isLoading } = useGetProductReviews(productId, { pageNumber: page, pageSize: PAGE_SIZE })
  const reviews = data?.items ?? []
  const totalPages = data?.totalPages ?? 0

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews]
    if (sortOrder === 'newest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortOrder === 'highest') {
      sorted.sort((a, b) => b.rating - a.rating)
    } else {
      sorted.sort((a, b) => a.rating - b.rating)
    }
    return sorted
  }, [reviews, sortOrder])

  // Rating distribution — computed over the current page of reviews, not the full history,
  // since there's no endpoint that returns the full distribution.
  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0] // index 0 = 1 star ... index 4 = 5 star
    reviews.forEach((r) => {
      const bucket = Math.min(5, Math.max(1, Math.round(r.rating))) - 1
      counts[bucket]++
    })
    return counts
  }, [reviews])

  const form = useForm({
    initialValues: { rating: 5, comment: '' },
    validate: {
      rating: (v) => (v < 1 || v > 5 ? 'Please select a rating' : null),
      comment: (v) => (!v.trim() ? 'Comment is required' : null),
    },
  })

  const { mutate: createReview, isPending } = useCreateReview({
    mutation: {
      onSuccess: async () => {
        await Promise.all([
          invalidateGetProductReviews(queryClient, productId),
          invalidateGetProductById(queryClient, productId),
        ])
        form.reset()
        setPage(1)
        notifications.show({
          title: 'Review submitted',
          message: 'Thanks for sharing your experience.',
          color: 'green',
        })
      },
      onError: (error) => {
        // The server explains why it refused (403 when the product was never delivered to this
        // user, 404 when it no longer exists); a generic message would hide that from the user.
        const detail = (error as AxiosError<ProblemDetails>).response?.data?.detail
        notifications.show({
          title: 'Error',
          message: detail || 'Failed to submit review.',
          color: 'red',
        })
      },
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    createReview({
      productId,
      data: { rating: values.rating, comment: values.comment },
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <ChatIcon className="text-lg text-primary" />
        <h2 className="text-lg font-semibold text-gray-800">Customer Reviews</h2>
        {reviewsCount > 0 && (
          <div className="flex items-center gap-1.5 ml-2">
            <Rating value={averageRating} fractions={2} readOnly size="sm" />
            <span className="text-sm text-gray-500">
              ({averageRating.toFixed(1)}) · {reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        )}
      </div>

      {/* Rating distribution */}
      {!isLoading && reviews.length > 0 && (
        <div className="bg-white rounded-lg border border-border p-4 mb-4">
          <p className="text-2xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Rating breakdown{totalPages > 1 ? ' (this page)' : ''}
          </p>
          <div className="flex flex-col gap-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star - 1]
              const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-600 w-8 flex items-center gap-0.5">
                    {star} <StarIcon weight="fill" size={11} className="text-amber-400" />
                  </span>
                  <Progress value={percent} color="primary" size="sm" className="flex-1" />
                  <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Sort control */}
      {!isLoading && reviews.length > 0 && (
        <div className="flex justify-end mb-3">
          <Select
            size="xs"
            w={160}
            value={sortOrder}
            onChange={(v) => setSortOrder((v as 'newest' | 'highest' | 'lowest') || 'newest')}
            data={[
              { value: 'newest', label: 'Newest first' },
              { value: 'highest', label: 'Highest rated' },
              { value: 'lowest', label: 'Lowest rated' },
            ]}
          />
        </div>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-border">
          <ChatIcon className="mx-auto text-2xl mb-2 text-gray-300" />
          <p className="text-sm">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          {sortedReviews.map((r) => (
            <div key={r.id} className="bg-white rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <Avatar size={32} radius="xl" color="green">
                  {r.userName?.[0]?.toUpperCase()}
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800 text-sm">{r.userName}</span>
                    <span className="text-xs text-gray-400">{dayjs(r.createdAt).format('DD MMM YYYY')}</span>
                  </div>
                  <Rating value={r.rating} readOnly size="xs" className="mb-2" />
                  <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-center mt-2">
              <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
            </div>
          )}
        </div>
      )}

      {/* Submit form */}
      {user ? (
        <div className="bg-green-50 rounded-lg border border-green-100 p-4">
          <h3 className="font-semibold text-sm text-gray-800 mb-3">Write a Review</h3>
          <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block" htmlFor="rating">
                Your Rating
              </label>
              <Rating size="lg" value={form.values.rating} onChange={(v) => form.setFieldValue('rating', v)} />
              {form.errors.rating && <p className="text-xs text-red-500 mt-1">{form.errors.rating}</p>}
            </div>
            <Textarea
              label="Your Comment"
              placeholder="Share your experience with this product…"
              minRows={3}
              withAsterisk
              {...form.getInputProps('comment')}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={isPending}>
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-5 bg-gray-50 rounded-lg border border-border">
          <p className="text-sm text-gray-500">
            Please{' '}
            <Link
              to={`/auth?returnTo=${encodeURIComponent(location.pathname + location.search)}`}
              className="text-primary font-medium hover:underline"
            >
              log in
            </Link>{' '}
            to write a review.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
