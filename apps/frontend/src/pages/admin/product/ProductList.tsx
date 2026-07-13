import { useGetApiProductsAll } from '@api'
import { ActionIcon, Badge, Button, Table, TextInput } from '@mantine/core'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router'

const ProductList = () => {
  const [search, setSearch] = useState('')
  const { data: products, isLoading } = useGetApiProductsAll()

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return products.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
  }, [products, search])

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Product Management</h1>
          <p className="text-gray-500 mt-1">Manage your eco-friendly inventory.</p>
        </div>
        <Button component={Link} to="/admin/product/create" color="primary" leftSection={<FiPlus />}>
          Add New Product
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-primary/10 mb-6">
        <TextInput
          placeholder="Search products..."
          leftSection={<FiSearch className="text-muted-foreground" />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          radius="xl"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
        <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Product Name</Table.Th>
              <Table.Th>Price</Table.Th>
              <Table.Th>Eco Score</Table.Th>
              <Table.Th>Added</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <div className="text-center py-12 text-muted-foreground">Loading products...</div>
                </Table.Td>
              </Table.Tr>
            ) : filteredProducts.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <div className="text-center py-12 text-muted-foreground">No products found.</div>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredProducts.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td className="font-medium text-gray-800">{p.name}</Table.Td>
                  <Table.Td>${p.price?.toFixed(2)}</Table.Td>
                  <Table.Td>
                    <Badge color="green" variant="light">
                      {p.ecoScore || 0}/100
                    </Badge>
                  </Table.Td>
                  <Table.Td>{p.createdAt ? dayjs(p.createdAt).format('DD/MM/YYYY') : 'N/A'}</Table.Td>
                  <Table.Td>
                    <div className="flex gap-2">
                      <ActionIcon variant="subtle" color="gray">
                        <FiEdit2 />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red">
                        <FiTrash2 />
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

export default ProductList
