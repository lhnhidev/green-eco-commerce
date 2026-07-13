import { Badge, Button, Table, TextInput } from '@mantine/core'
import { useState } from 'react'
import { FiSearch, FiUserPlus } from 'react-icons/fi'

const UserList = () => {
  const [search, setSearch] = useState('')

  return (
    <div className="w-full h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
          <p className="text-gray-500 mt-1">
            Manage your customers and administrators.
          </p>
        </div>
        <Button color="primary" leftSection={<FiUserPlus />}>
          Add User
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-primary/10 mb-6">
        <TextInput
          placeholder="Search by name or email..."
          leftSection={<FiSearch className="text-muted-foreground" />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          radius="xl"
        />
      </div>

      {/* Table Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
        <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User Details</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Green Points</Table.Th>
              <Table.Th>Joined Date</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={6}>
                <div className="text-center py-12 text-muted-foreground">
                  No users found.
                </div>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </div>
    </div>
  )
}

export default UserList
