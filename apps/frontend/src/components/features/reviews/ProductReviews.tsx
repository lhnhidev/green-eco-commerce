import {
  getGetProductReviewSummaryQueryKey,
  getGetProductReviewsQueryKey,
  useCreateReview,
  useGetProductReviews,
  useGetProductReviewSummary,
} from '@api'
import type { ProblemDetails } from '@api/schemas'
import { useAppSelector } from '@hooks/useAppSelector'
import { Avatar, Button, Pagination, Rating, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FiMessageSquare } from 'react-icons/fi'

const PAGE_SIZE = 5

interface ProductReviewsProps {
  productId: string
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const queryClient = useQueryClient()
  const user = useAppSelector((state) => state.auth.user)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetProductReviews(productId, { pageNumber: page, pageSize: PAGE_SIZE })
  const reviews = data?.items ?? []
  const totalPages = data?.totalPages ?? 0

  // The average has to come from the server: computing it from `reviews` would only
  // describe the page currently on screen.
  const { data: summary } = useGetProductReviewSummary(productId)
  const avgRating = summary?.averageRating ?? 0
  const totalCount = summary?.totalCount ?? 0

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
          queryClient.invalidateQueries({ queryKey: getGetProductReviewsQueryKey(productId) }),
          queryClient.invalidateQueries({ queryKey: getGetProductReviewSummaryQueryKey(productId) }),
        ])
        form.reset()
        setPage(1)
        notifications.show({ title: 'Review submitted', message: 'Thanks for sharing your experience.', color: 'green' })
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
    <div className="mt-10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <FiMessageSquare className="text-xl text-primary" />
        <h2 className="text-xl font-bold text-gray-800">Customer Reviews</h2>
        {totalCount > 0 && (
          <div className="flex items-center gap-1.5 ml-2">
            <Rating value={avgRating} fractions={2} readOnly size="sm" />
            <span className="text-sm text-gray-500">
              ({avgRating.toFixed(1)}) · {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
            </span>
          </div>
        )}
      </div>

      {/* Review list */}
      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
          <FiMessageSquare className="mx-auto text-3xl mb-2 text-gray-300" />
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <Avatar size={36} radius="xl" color="green">
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
        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-6 mt-4">
          <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
          <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
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
              <Button type="submit" color="primary" loading={isPending}>
                Submit Review
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-sm text-gray-500">
            Please{' '}
            <a href="/auth" className="text-primary font-medium hover:underline">
              log in
            </a>{' '}
            to write a review.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductReviews
