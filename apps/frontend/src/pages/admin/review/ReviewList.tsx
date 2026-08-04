import { invalidateGetAllReviews, useApproveReview, useDeleteReview, useGetAllReviews, useHideReview } from '@api'
import type { ReviewDto } from '@api/schemas'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import RowActions from '@components/ui/primitives/RowActions'
import Toolbar from '@components/ui/primitives/Toolbar'
import { ActionIcon, Badge, Select, TextInput, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { ChatCircleTextIcon, CheckIcon, EyeSlashIcon, MagnifyingGlassIcon, StarIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

const PAGE_SIZE = 20

type StatusFilter = 'all' | 'pending' | 'approved' | 'hidden'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All reviews' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'hidden', label: 'Hidden' },
]

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <StarIcon
        key={s}
        size={11}
        className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
      />
    ))}
    <span className="ml-1 text-2xs text-muted-foreground">{rating}/5</span>
  </div>
)

const ReviewList = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<ReviewDto | null>(null)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)

  const queryClient = useQueryClient()
  const invalidate = () => invalidateGetAllReviews(queryClient)

  const queryParams = useMemo(() => {
    if (statusFilter === 'pending') return { isApproved: false, isHidden: false }
    if (statusFilter === 'approved') return { isApproved: true, isHidden: false }
    if (statusFilter === 'hidden') return { isHidden: true }
    return {}
  }, [statusFilter])

  // Server-side paginated: pageNumber/pageSize are sent to the backend. Search has no backend
  // param for reviews, so it stays a client-side refinement over the currently-loaded page only.
  const { data, isLoading } = useGetAllReviews({ ...queryParams, pageNumber: page, pageSize: PAGE_SIZE })
  const reviews = data?.items ?? []

  const { mutate: approve, variables: approvingVar } = useApproveReview({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        notifications.show({ title: 'Approved', message: 'Review is now visible.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to approve.', color: 'red' }),
    },
  })

  const { mutate: hide, variables: hidingVar } = useHideReview({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        notifications.show({ title: 'Hidden', message: 'Review is hidden from public.', color: 'yellow' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to hide.', color: 'red' }),
    },
  })

  const { mutate: deleteReview, isPending: deleting } = useDeleteReview({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeDelete()
        notifications.show({ title: 'Deleted', message: 'Review removed.', color: 'red' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to delete.', color: 'red' }),
    },
  })

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase()
    return reviews.filter((r) => !kw || r.userName.toLowerCase().includes(kw) || r.comment.toLowerCase().includes(kw))
  }, [reviews, search])

  const totalPages = Math.max(1, Math.ceil((data?.totalCount ?? 0) / PAGE_SIZE))

  const handleDelete = () => {
    if (deleteTarget) deleteReview({ id: deleteTarget.id })
  }

  const columns: DataTableColumn<ReviewDto>[] = [
    {
      key: 'reviewer',
      header: 'Reviewer',
      width: 140,
      render: (r) => <span className="font-medium">{r.userName}</span>,
    },
    { key: 'rating', header: 'Rating', width: 90, render: (r) => <StarRating rating={r.rating} /> },
    {
      key: 'comment',
      header: 'Comment',
      render: (r) => <span className="text-muted-foreground line-clamp-1">{r.comment}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 90,
      render: (r) =>
        r.isHidden ? (
          <Badge size="xs" color="red" variant="light">
            Hidden
          </Badge>
        ) : r.isApproved ? (
          <Badge size="xs" color="green" variant="light">
            Approved
          </Badge>
        ) : (
          <Badge size="xs" color="gray" variant="light">
            Pending
          </Badge>
        ),
    },
    {
      key: 'date',
      header: 'Date',
      width: 100,
      render: (r) => <span className="text-muted-foreground">{dayjs(r.createdAt).format('DD/MM/YYYY')}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 90,
      align: 'right',
      render: (r) => {
        const isActing = approvingVar?.id === r.id || hidingVar?.id === r.id
        return (
          <RowActions
            onDelete={() => {
              setDeleteTarget(r)
              openDelete()
            }}
            extra={
              <>
                {!r.isApproved && (
                  <Tooltip label="Approve" withArrow>
                    <ActionIcon
                      variant="subtle"
                      color="green"
                      size="sm"
                      loading={isActing}
                      onClick={() => approve({ id: r.id })}
                    >
                      <CheckIcon size={13} />
                    </ActionIcon>
                  </Tooltip>
                )}
                {!r.isHidden && (
                  <Tooltip label="Hide" withArrow>
                    <ActionIcon
                      variant="subtle"
                      color="yellow"
                      size="sm"
                      loading={isActing}
                      onClick={() => hide({ id: r.id })}
                    >
                      <EyeSlashIcon size={13} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </>
            }
          />
        )
      },
    },
  ]

  return (
    <AdminPageShell title="Reviews">
      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(r) => r.id}
        isLoading={isLoading}
        emptyIcon={ChatCircleTextIcon}
        emptyTitle="No reviews found"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        toolbar={
          <Toolbar
            left={
              <>
                <TextInput
                  placeholder="Search by reviewer or comment..."
                  size="xs"
                  leftSection={<MagnifyingGlassIcon size={13} />}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.currentTarget.value)
                    setPage(1)
                  }}
                  w={260}
                />
                <Select
                  size="xs"
                  data={STATUS_OPTIONS}
                  value={statusFilter}
                  onChange={(v) => {
                    setStatusFilter((v as StatusFilter) ?? 'all')
                    setPage(1)
                  }}
                  w={140}
                />
              </>
            }
            right={<span className="text-2xs text-muted-foreground">{data?.totalCount ?? 0} reviews</span>}
          />
        }
      />

      <ConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={handleDelete}
        title="Delete Review?"
        message={`This will permanently remove "${deleteTarget?.comment?.substring(0, 60)}…"`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminPageShell>
  )
}

export default ReviewList
