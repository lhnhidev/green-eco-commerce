import { ActionIcon, Badge, Button, Select, Table, TextInput } from '@mantine/core'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { FiDownload, FiEye, FiSearch } from 'react-icons/fi'
import { useGetApiOrdersAll } from '../../../api'

const OrderList = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const { data: orders, isLoading } = useGetApiOrdersAll()

  const filteredOrders = useMemo(() => {
    if (!orders) return []
    return orders.filter((o) => {
      const matchSearch =
        (o.id?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (o.userId?.toLowerCase() || '').includes(search.toLowerCase())
      const matchStatus = statusFilter ? o.status === statusFilter : true
      return matchSearch && matchStatus
    })
  }, [orders, search, statusFilter])

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Order Management</h1>
          <p className="text-gray-500 mt-1">Track and process customer orders.</p>
        </div>
        <Button color="primary" variant="outline" leftSection={<FiDownload />}>
          Export Orders
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-primary/10 mb-6 flex gap-4">
        <TextInput
          placeholder="Search order ID or customer..."
          leftSection={<FiSearch className="text-muted-foreground" />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          radius="xl"
          className="flex-1"
        />
        <Select
          placeholder="Filter by Status"
          data={['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']}
          value={statusFilter}
          onChange={setStatusFilter}
          clearable
          radius="xl"
          className="w-48"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
        <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order ID</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
                </Table.Td>
              </Table.Tr>
            ) : filteredOrders.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <div className="text-center py-12 text-muted-foreground">No orders found.</div>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredOrders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td className="font-medium text-gray-800">{order.id?.substring(0, 8)}...</Table.Td>
                  <Table.Td>{order.userId}</Table.Td>
                  <Table.Td>{order.createdAt ? dayjs(order.createdAt).format('DD/MM/YYYY') : 'N/A'}</Table.Td>
                  {/* <Table.Td>${order.totalAmount?.toFixed(2)}</Table.Td> */}
                  <Table.Td>32.65</Table.Td>
                  <Table.Td>
                    <Badge color="blue" variant="light">
                      {order.status || 'Pending'}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon variant="subtle" color="primary">
                      <FiEye />
                    </ActionIcon>
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
