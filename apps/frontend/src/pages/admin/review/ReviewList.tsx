import { getGetAllReviewsQueryKey, useApproveReview, useDeleteReview, useGetAllReviews, useHideReview } from '@api'
import type { ReviewDto } from '@api/schemas'
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Pagination,
  Select,
  Table,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { FiCheck, FiEyeOff, FiSearch, FiStar, FiTrash2 } from 'react-icons/fi'

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
      <FiStar
        key={s}
        size={11}
        className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
      />
    ))}
    <span className="ml-1 text-[11px] text-muted-foreground">{rating}/5</span>
  </div>
)

const ReviewList = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<ReviewDto | null>(null)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)

  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetAllReviewsQueryKey() })

  const queryParams = useMemo(() => {
    if (statusFilter === 'pending') return { isApproved: false, isHidden: false }
    if (statusFilter === 'approved') return { isApproved: true, isHidden: false }
    if (statusFilter === 'hidden') return { isHidden: true }
    return {}
  }, [statusFilter])

  const { data: reviews = [], isLoading } = useGetAllReviews(queryParams)

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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleDelete = () => {
    if (deleteTarget) deleteReview({ id: deleteTarget.id })
  }

  return (
    <div className="w-full h-full">
      {/* Delete Modal */}
      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Review?" centered size="sm">
        <Text size="sm" c="dimmed" mb="md">
          This will permanently remove "{deleteTarget?.comment?.substring(0, 60)}…"
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete} loading={deleting}>
            Delete
          </Button>
        </Group>
      </Modal>

      <div className="flex items-center gap-2.5 mb-2.5">
        <TextInput
          placeholder="Search by reviewer or comment..."
          size="xs"
          leftSection={<FiSearch size={13} />}
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
        <span className="text-[11px] text-muted-foreground">{filtered.length} reviews</span>
      </div>

      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
        <Table
          verticalSpacing={6}
          horizontalSpacing={8}
          highlightOnHover
          classNames={{
            th: '!text-[11px] !font-semibold !uppercase !tracking-[0.04em] !text-muted-foreground !bg-[#fafafa]',
            td: '!text-[12px]',
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={140}>Reviewer</Table.Th>
              <Table.Th w={90}>Rating</Table.Th>
              <Table.Th>Comment</Table.Th>
              <Table.Th w={90}>Status</Table.Th>
              <Table.Th w={100}>Date</Table.Th>
              <Table.Th w={90} ta="right">
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">Loading reviews…</div>
                </Table.Td>
              </Table.Tr>
            ) : paged.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">No reviews found.</div>
                </Table.Td>
              </Table.Tr>
            ) : (
              paged.map((r) => {
                const isActing = approvingVar?.id === r.id || hidingVar?.id === r.id
                return (
                  <Table.Tr key={r.id}>
                    <Table.Td className="!font-medium">{r.userName}</Table.Td>
                    <Table.Td>
                      <StarRating rating={r.rating} />
                    </Table.Td>
                    <Table.Td className="!text-muted-foreground max-w-xs truncate">{r.comment}</Table.Td>
                    <Table.Td>
                      {r.isHidden ? (
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
                      )}
                    </Table.Td>
                    <Table.Td className="!text-muted-foreground">{dayjs(r.createdAt).format('DD/MM/YYYY')}</Table.Td>
                    <Table.Td>
                      <div className="flex items-center justify-end gap-1">
                        {!r.isApproved && (
                          <Tooltip label="Approve" withArrow>
                            <ActionIcon
                              variant="subtle"
                              color="green"
                              size="sm"
                              loading={isActing}
                              onClick={() => approve({ id: r.id })}
                            >
                              <FiCheck size={13} />
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
                              <FiEyeOff size={13} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                        <Tooltip label="Delete" withArrow>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={() => {
                              setDeleteTarget(r)
                              openDelete()
                            }}
                          >
                            <FiTrash2 size={13} />
                          </ActionIcon>
                        </Tooltip>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                )
              })
            )}
          </Table.Tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-3">
          <Pagination total={totalPages} value={page} onChange={setPage} size="xs" />
        </div>
      )}
    </div>
  )
}

export default ReviewList
