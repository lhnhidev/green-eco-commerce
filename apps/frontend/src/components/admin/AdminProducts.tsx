import { Badge, Button, Card, Table, TextInput } from '@mantine/core'
import { MagnifyingGlassIcon, PackageIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { products } from '../data/adminData'
import { formatCurrency, getStatusBadgeColor } from '../utils/statusHelpers'

export function AdminProducts() {
  return (
    <Card shadow="sm" padding="lg" radius="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Product Management</h3>
        <Button color="green.9" leftSection={<PlusIcon className="h-4 w-4" />}>
          Add Product
        </Button>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <TextInput
          placeholder="Search products..."
          leftSection={<MagnifyingGlassIcon className="h-4 w-4" />}
          className="flex-1 max-w-sm"
        />
      </div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Stock</Table.Th>
            <Table.Th>Sold</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.map((product) => (
            <Table.Tr key={product.id}>
              <Table.Td className="font-medium">{product.name}</Table.Td>
              <Table.Td>{product.category}</Table.Td>
              <Table.Td>{formatCurrency(product.price)}</Table.Td>
              <Table.Td>{product.stock}</Table.Td>
              <Table.Td>{product.sold}</Table.Td>
              <Table.Td>
                <Badge color={getStatusBadgeColor(product.status)} variant="light">
                  {product.status.replace('-', ' ')}
                </Badge>
              </Table.Td>
              <Table.Td>
                <div className="flex items-center gap-1">
                  <Button variant="subtle" size="xs" color="gray">
                    <PackageIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="subtle" size="xs" color="gray">
                    <PencilSimpleIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="subtle" size="xs" color="gray">
                    <TrashIcon className="h-4 w-4" />
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
