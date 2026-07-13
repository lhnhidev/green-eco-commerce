import { useGetApiCategories } from '@api'
import { ActionIcon, Badge, Button, Table, TextInput } from '@mantine/core'
import { useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router'

const CategoryList = () => {
  const [search, setSearch] = useState('')
  const { data: categories, isLoading } = useGetApiCategories()

  const filteredCategories = useMemo(() => {
    if (!categories) return []
    return categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
  }, [categories, search])

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Category Management</h1>
          <p className="text-gray-500 mt-1">Organize and manage your eco-friendly product categories.</p>
        </div>
        <Button component={Link} to="/admin/category/create" color="primary" leftSection={<FiPlus />}>
          Add New Category
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-primary/10 mb-6">
        <TextInput
          placeholder="Search categories..."
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
              <Table.Th>Category Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <div className="text-center py-12 text-muted-foreground">Loading categories...</div>
                </Table.Td>
              </Table.Tr>
            ) : filteredCategories.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <div className="text-center py-12 text-muted-foreground">No categories found.</div>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredCategories.map((cat) => (
                <Table.Tr key={cat.id}>
                  <Table.Td className="font-medium text-gray-800">{cat.name}</Table.Td>
                  <Table.Td>{cat.description}</Table.Td>
                  <Table.Td>
                    <Badge color={cat.isActive ? 'green' : 'gray'} variant="light">
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Td>
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

export default CategoryList
