// TODO: run `bun run orval` (backend must be running on http://localhost:5244) to generate
// `useGetProductReviews` and the `PagedResultOfReviewDto` schema.
import { useGetProductReviews } from '@api'
import { Pagination, Rating } from '@mantine/core'
import dayjs from 'dayjs'
import { useState } from 'react'

const PAGE_SIZE = 5

type ReviewListProps = {
  productId: string
}

const ReviewList = ({ productId }: ReviewListProps) => {
  const [page, setPage] = useState<number>(1)

  const { data, isLoading } = useGetProductReviews(productId, { PageNumber: page, PageSize: PAGE_SIZE })

  const reviews = data?.items ?? []
  const totalPages = data?.totalPages ?? 0

  if (isLoading) {
    return <div className="py-10 text-center text-sm text-gray-400">Loading reviews…</div>
  }

  if (reviews.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        No reviews yet. Be the first to share your experience!
      </div>
    )
  }

  return (
    <div>
      <ul className="flex flex-col gap-4">
        {reviews.map((review) => (
          <li key={review.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-2">
              <span className="font-semibold text-gray-900">{review.userFullName}</span>
              <span className="text-xs text-gray-400">{dayjs(review.createdAt).format('DD/MM/YYYY')}</span>
            </div>

            <Rating value={review.rating} count={5} size="sm" color="yellow.5" readOnly />

            {review.comment && <p className="mt-3 text-sm text-gray-600 leading-relaxed">{review.comment}</p>}
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="flex justify-end mt-6">
          <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
        </div>
      )}
    </div>
  )
}

export default ReviewList