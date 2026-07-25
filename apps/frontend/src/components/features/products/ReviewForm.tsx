// TODO: run `bun run orval` (backend must be running on http://localhost:5244) to generate
// `useCreateReview` + `getGetProductReviewsQueryKey` and the `CreateReviewPayloadDto` schema.
import { getGetProductReviewsQueryKey, useCreateReview } from '@api'
import type { CreateReviewPayloadDto, ProblemDetails } from '@api/schemas'
import { Button, Rating, Textarea } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { Controller, useForm } from 'react-hook-form'

const COMMENT_MAX_LENGTH = 500

type ReviewFormProps = {
  productId: string
  /** The parent decides this: only a customer with a delivered order may review. */
  canReview: boolean
}

const ReviewForm = ({ productId, canReview }: ReviewFormProps) => {
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateReviewPayloadDto>({
    defaultValues: {
      rating: 5,
      comment: '',
    },
  })

  const { mutate, isPending } = useCreateReview()

  const onSubmit = (formData: CreateReviewPayloadDto) => {
    const comment = formData.comment?.trim()

    mutate(
      { productId, data: { rating: formData.rating, comment: comment ? comment : null } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProductReviewsQueryKey(productId) })

          reset({ rating: 5, comment: '' })

          notifications.show({
            title: 'Review submitted!',
            message: 'Thank you for sharing your experience.',
            color: 'green',
          })
        },
        onError: (error) => {
          const axiosError = error as AxiosError<ProblemDetails>
          notifications.show({
            title: 'Review failed!',
            message: axiosError.response?.data.detail || 'We could not save your review. Please try again!',
            color: 'red',
          })
        },
      },
    )
  }

  if (!canReview) {
    return (
      <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 text-sm text-gray-500">
        Only customers who have received this product can leave a review.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Write a review</h3>

      <div className="mb-5">
        <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Your rating</span>
        <Controller
          name="rating"
          control={control}
          rules={{ min: { value: 1, message: 'Please select a rating between 1 and 5 stars.' } }}
          render={({ field }) => (
            <Rating value={field.value} onChange={field.onChange} count={5} size="lg" color="yellow.5" />
          )}
        />
        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>}
      </div>

      <div className="mb-5">
        <Controller
          name="comment"
          control={control}
          rules={{
            maxLength: {
              value: COMMENT_MAX_LENGTH,
              message: `Comment must not exceed ${COMMENT_MAX_LENGTH} characters.`,
            },
          }}
          render={({ field }) => (
            <Textarea
              label="Your comment"
              placeholder="Tell other shoppers what you think about this product…"
              autosize
              minRows={3}
              maxRows={8}
              maxLength={COMMENT_MAX_LENGTH}
              radius="lg"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={errors.comment?.message}
            />
          )}
        />
      </div>

      <Button type="submit" size="sm" radius="xl" color="green.9" loading={isPending}>
        Submit review
      </Button>
    </form>
  )
}

export default ReviewForm