import { Badge, Button, Card, Table, TextInput } from '@mantine/core'
import { EyeIcon, MagnifyingGlassIcon, PencilSimpleIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { users } from '../data/adminData'
import { formatDate, getStatusBadgeColor } from '../utils/statusHelpers'

export function AdminUsers() {
  return (
    <Card shadow="sm" padding="lg" radius="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">User Management</h3>
        <Button color="green.9" leftSection={<PlusIcon className="h-4 w-4" />}>
          Add User
        </Button>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <TextInput
          placeholder="Search users..."
          leftSection={<MagnifyingGlassIcon className="h-4 w-4" />}
          className="flex-1 max-w-sm"
        />
      </div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Join Date</Table.Th>
            <Table.Th>Orders</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {users.map((user) => (
            <Table.Tr key={user.id}>
              <Table.Td className="font-medium">{user.name}</Table.Td>
              <Table.Td>{user.email}</Table.Td>
              <Table.Td>{user.role}</Table.Td>
              <Table.Td>{formatDate(user.joinDate)}</Table.Td>
              <Table.Td>{user.orders}</Table.Td>
              <Table.Td>
                <Badge color={getStatusBadgeColor(user.status)} variant="light">
                  {user.status}
                </Badge>
              </Table.Td>
              <Table.Td>
                <div className="flex items-center gap-1">
                  <Button variant="subtle" size="xs" color="gray">
                    <EyeIcon className="h-4 w-4" />
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
