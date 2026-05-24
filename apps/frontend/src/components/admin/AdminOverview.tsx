import { Badge, Card, Table } from '@mantine/core'
import { recentOrders } from '../data/adminData'
import { formatCurrency, formatDate, getStatusBadgeColor } from '../utils/statusHelpers'

export function AdminOverview() {
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order ID</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Items</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Date</Table.Th>
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
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card shadow="sm" padding="lg" radius="md">
          <h3 className="text-lg font-bold mb-4">Sales Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>This Month</span>
              <span className="font-semibold">{formatCurrency(12350)}</span>
            </div>
            <div className="flex justify-between">
              <span>Last Month</span>
              <span className="font-semibold">{formatCurrency(11200)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Growth</span>
              <span className="font-semibold">+10.3%</span>
            </div>
          </div>
        </Card>

        <Card shadow="sm" padding="lg" radius="md">
          <h3 className="text-lg font-bold mb-4">Top Categories</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Indoor Plants</span>
              <span className="font-semibold">45%</span>
            </div>
            <div className="flex justify-between">
              <span>Outdoor Plants</span>
              <span className="font-semibold">28%</span>
            </div>
            <div className="flex justify-between">
              <span>Succulents</span>
              <span className="font-semibold">18%</span>
            </div>
            <div className="flex justify-between">
              <span>Herbs</span>
              <span className="font-semibold">9%</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}
