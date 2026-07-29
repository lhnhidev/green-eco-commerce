import { useGetMyOrders } from '@api'
import { OrderSortBy, OrderStatusEnum } from '@api/schemas'
import { Anchor, Badge, Breadcrumbs, Button, Pagination, Select, Table, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { EyeIcon, MagnifyingGlassIcon, ReceiptIcon } from '@phosphor-icons/react'
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
].map((item) => (
  <Anchor href={item.href} key={item.href} size="sm">
    {item.title}
  </Anchor>
))

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
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs mb="lg">{breadcrumbItems}</Breadcrumbs>

      <div className="flex items-center gap-3 mb-6">
        <ReceiptIcon className="text-2xl text-primary" />
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

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
          placeholder="All statuses"
          size="sm"
          data={Object.values(OrderStatusEnum)}
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
          w={160}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table
          verticalSpacing={10}
          horizontalSpacing={14}
          highlightOnHover
          classNames={{
            th: '!text-xs font-semibold! !uppercase !tracking-wide !text-gray-400 !bg-gray-50',
            td: '!text-sm !text-gray-700',
          }}
        >
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
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <div className="text-center py-12 text-gray-400">Loading your orders…</div>
                </Table.Td>
              </Table.Tr>
            ) : filtered.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <div className="flex flex-col items-center py-16 gap-3 text-gray-400">
                    <ReceiptIcon size={40} />
                    <p className="text-sm">No orders found.</p>
                  </div>
                </Table.Td>
              </Table.Tr>
            ) : (
              filtered.map((order) => (
                <Table.Tr key={order.id} className="hover:bg-green-50/30 transition-colors">
                  <Table.Td>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                      #{order.id?.substring(0, 8).toUpperCase()}
                    </span>
                  </Table.Td>
                  <Table.Td className="max-w-52! truncate!">{order.deliveryAddress || '—'}</Table.Td>
                  <Table.Td className="text-gray-400!">
                    {order.createdAt ? dayjs(order.createdAt).format('DD/MM/YYYY') : '—'}
                  </Table.Td>
                  <Table.Td className="font-semibold! text-primary!">
                    ${Number(order.finalAmount ?? 0).toFixed(2)}
                  </Table.Td>
                  <Table.Td className="text-green-600!">{Number(order.totalCo2Saved ?? 0).toFixed(2)} kg</Table.Td>
                  <Table.Td>
                    <span className="text-amber-500 font-medium">+{order.earnedPoints} pts</span>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="sm" variant="light" color={statusColor[order.status] ?? 'gray'} radius="xl">
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

      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage
