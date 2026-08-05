import { useGetMyOrders } from '@api'
import { OrderSortBy, OrderStatusEnum } from '@api/schemas'
import Container from '@components/ui/primitives/Container'
import EmptyState from '@components/ui/primitives/EmptyState'
import PageHeader from '@components/ui/primitives/PageHeader'
import Panel from '@components/ui/primitives/Panel'
import { Badge, Button, Pagination, Select, Skeleton, Table, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { EyeIcon, MagnifyingGlassIcon, ReceiptIcon } from '@phosphor-icons/react'
import { formatCurrency } from '@utils/formatCurrency'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link } from 'react-router'

const statusColor: Record<string, string> = {
  Pending: 'gray',
  Packing: 'blue',
  Delivering: 'yellow',
  Delivered: 'green',
  Cancelled: 'red',
}

const PAGE_SIZE = 10

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'My Orders', href: '/my-orders' },
]

const MyOrdersPage = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const [debouncedSearch] = useDebouncedValue(search, 300)
  const { data, isLoading } = useGetMyOrders({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    sortBy: OrderSortBy.CreatedAt,
    sortDescending: true,
  })

  const orders = data?.items ?? []
  const totalPages = data?.totalPages ?? 1

  // Search is server-side (see useGetMyOrders above); status is still filtered
  // client-side within the current page.
  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders

  return (
    <Container className="py-6">
      <PageHeader breadcrumbItems={breadcrumbItems} icon={ReceiptIcon} title="My Orders" />

      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <TextInput
          placeholder="Search by order ID or address..."
          size="sm"
          leftSection={<MagnifyingGlassIcon size={14} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
            setPage(1)
          }}
          w={260}
        />
        <Select
          placeholder="Filter status (this page)"
          size="sm"
          data={Object.values(OrderStatusEnum)}
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
          w={190}
        />
      </div>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Order ID</Table.Th>
                <Table.Th>Delivery Address</Table.Th>
                <Table.Th w={110}>Date</Table.Th>
                <Table.Th w={90}>Total</Table.Th>
                <Table.Th w={110}>CO₂ Saved</Table.Th>
                <Table.Th w={110}>Points Earned</Table.Th>
                <Table.Th w={120}>Status</Table.Th>
                <Table.Th w={80}>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
                  <Table.Tr key={i}>
                    <Table.Td colSpan={8}>
                      <Skeleton height={20} radius="xl" />
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : filtered.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <EmptyState
                      icon={ReceiptIcon}
                      color="gray"
                      description={
                        statusFilter && orders.length > 0
                          ? 'No orders on this page match that status. Try clearing the filter or checking another page.'
                          : 'No orders found.'
                      }
                      className="py-4"
                    />
                  </Table.Td>
                </Table.Tr>
              ) : (
                filtered.map((order) => (
                  <Table.Tr key={order.id} className="hover:bg-green-50/30 transition-colors">
                    <Table.Td>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                        #{order.id?.slice(-8).toUpperCase()}
                      </span>
                    </Table.Td>
                    <Table.Td className="max-w-52 truncate">{order.deliveryAddress || '—'}</Table.Td>
                    <Table.Td className="text-gray-400">
                      {order.createdAt ? dayjs(order.createdAt).format('DD/MM/YYYY') : '—'}
                    </Table.Td>
                    <Table.Td className="font-semibold text-primary">{formatCurrency(order.finalAmount)}</Table.Td>
                    <Table.Td className="text-green-600">{Number(order.totalCo2Saved ?? 0).toFixed(2)} kg</Table.Td>
                    <Table.Td>
                      <span className="text-amber-500 font-medium">+{order.earnedPoints} pts</span>
                    </Table.Td>
                    <Table.Td>
                      <Badge size="sm" variant="light" color={statusColor[order.status] ?? 'gray'}>
                        {order.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Button
                        component={Link}
                        to={`/my-orders/${order.id}`}
                        size="compact-xs"
                        variant="subtle"
                        color="green"
                        leftSection={<EyeIcon size={12} />}
                      >
                        View
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>
      </Panel>

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination total={totalPages} value={page} onChange={setPage} />
        </div>
      )}
    </Container>
  )
}

export default MyOrdersPage
