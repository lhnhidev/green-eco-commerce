import { Badge, Button, Card, Select, Table, TextInput } from '@mantine/core'
import { EyeIcon, MagnifyingGlassIcon, PackageIcon } from '@phosphor-icons/react'
import { recentOrders } from '../data/adminData'
import { formatCurrency, formatDate, getStatusBadgeColor } from '../utils/statusHelpers'

export function SellerOrders() {
  return (
    <Card shadow="sm" padding="lg" radius="md">
      <h3 className="text-lg font-bold mb-4">My Orders</h3>
      <div className="flex items-center gap-4 mb-4">
        <TextInput
          placeholder="Search orders..."
          leftSection={<MagnifyingGlassIcon className="h-4 w-4" />}
          className="flex-1 max-w-sm"
        />
        <Select
          defaultValue="all"
          data={[
            { value: 'all', label: 'All Status' },
            { value: 'pending', label: 'Pending' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'completed', label: 'Completed' },
          ]}
          className="w-40"
        />
      </div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order ID</Table.Th>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Items</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {recentOrders.map((order) => (
            <Table.Tr key={order.id}>
              <Table.Td className="font-medium">{order.id}</Table.Td>
              <Table.Td>{order.customer}</Table.Td>
              <Table.Td>{order.items}</Table.Td>
              <Table.Td>{formatCurrency(order.total)}</Table.Td>
              <Table.Td>
                <Badge color={getStatusBadgeColor(order.status)} variant="light">
                  {order.status}
                </Badge>
              </Table.Td>
              <Table.Td>{formatDate(order.date)}</Table.Td>
              <Table.Td>
                <div className="flex items-center gap-1">
                  <Button variant="subtle" size="xs" color="gray">
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="subtle" size="xs" color="gray">
                    <PackageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  )
}
