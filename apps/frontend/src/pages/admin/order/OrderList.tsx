import { useGetApiOrdersAll } from '@api'
import { OrderStatusEnum } from '@api/schemas'
import { ActionIcon, Badge, Select, Table, TextInput } from '@mantine/core'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { FiEye, FiSearch } from 'react-icons/fi'

const statusColor: Record<string, string> = {
  Pending: 'gray',
  Packing: 'blue',
  Delivering: 'yellow',
  Delivered: 'primary',
  Cancelled: 'red',
}

const OrderList = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const { data: orders, isLoading } = useGetApiOrdersAll()

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    const keyword = search.trim().toLowerCase()
    return orders
      .filter((o) => {
        const matchSearch =
          !keyword ||
          (o.id?.toLowerCase() || '').includes(keyword) ||
          (o.deliveryAddress?.toLowerCase() || '').includes(keyword)
        const matchStatus = statusFilter ? o.status === statusFilter : true
        return matchSearch && matchStatus
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [orders, search, statusFilter])

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2.5 mb-2.5">
        <TextInput
          placeholder="Search order ID or address..."
          size="xs"
          leftSection={<FiSearch size={13} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={240}
        />
        <Select
          placeholder="All statuses"
          size="xs"
          data={Object.values(OrderStatusEnum)}
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
          w={140}
        />
        <span className="text-[11px] text-[#71717a]">
          {filteredOrders.length} of {orders?.length ?? 0} shown
        </span>
      </div>

      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
        <Table
          verticalSpacing={6}
          horizontalSpacing={8}
          highlightOnHover
          classNames={{
            th: '!text-[11px] !font-semibold !uppercase !tracking-[0.04em] !text-[#71717a] !bg-[#fafafa]',
            td: '!text-[12px]',
          }}
        >
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={110}>Order ID</Table.Th>
              <Table.Th>Delivery address</Table.Th>
              <Table.Th w={110}>Created</Table.Th>
              <Table.Th w={110}>Status</Table.Th>
              <Table.Th w={90} ta="right">
                Points
              </Table.Th>
              <Table.Th w={90} ta="right">
                Discount
              </Table.Th>
              <Table.Th w={60} ta="right">
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">Loading orders…</div>
                </Table.Td>
              </Table.Tr>
            ) : filteredOrders.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">No orders found.</div>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredOrders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td className="!font-medium">#{order.id?.substring(0, 8)}</Table.Td>
                  <Table.Td className="!text-[#71717a]">{order.deliveryAddress || '—'}</Table.Td>
                  <Table.Td className="!text-[#71717a]">
                    {order.createdAt ? dayjs(order.createdAt).format('DD/MM/YYYY') : '—'}
                  </Table.Td>
                  <Table.Td>
                    <Badge size="xs" variant="light" color={statusColor[order.status] ?? 'gray'} radius="xl">
                      {order.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td ta="right">{order.earnedPoints}</Table.Td>
                  <Table.Td ta="right" className="!text-[#71717a]">
                    ${Number(order.discountAmount).toFixed(2)}
                  </Table.Td>
                  <Table.Td>
                    <div className="flex justify-end">
                      <ActionIcon variant="subtle" color="gray" size="sm" aria-label="View">
                        <FiEye size={13} />
                      </ActionIcon>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}

export default OrderList
