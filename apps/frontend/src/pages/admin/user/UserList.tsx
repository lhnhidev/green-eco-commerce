import { useGetApiUsers } from '@api'
import { ActionIcon, Avatar, Badge, Table, TextInput } from '@mantine/core'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { FiEdit2, FiSearch } from 'react-icons/fi'

const UserList = () => {
  const [search, setSearch] = useState('')
  const { data: users, isLoading } = useGetApiUsers()

  const filtered = useMemo(() => {
    if (!users) return []
    const keyword = search.trim().toLowerCase()
    if (!keyword) return users
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(keyword) ||
        (u.email?.toLowerCase() || '').includes(keyword),
    )
  }, [users, search])

  return (
    <div className="w-full h-full">
      <div className="flex items-center gap-2.5 mb-2.5">
        <TextInput
          placeholder="Search by name or email..."
          size="xs"
          leftSection={<FiSearch size={13} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={240}
        />
        <span className="text-[11px] text-[#71717a]">
          {filtered.length} of {users?.length ?? 0} shown
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
              <Table.Th w={200}>Name</Table.Th>
              <Table.Th w={220}>Email</Table.Th>
              <Table.Th w={120}>Phone</Table.Th>
              <Table.Th>Address</Table.Th>
              <Table.Th w={90}>Role</Table.Th>
              <Table.Th w={100}>Joined</Table.Th>
              <Table.Th w={60} ta="right">
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">Loading users…</div>
                </Table.Td>
              </Table.Tr>
            ) : filtered.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <div className="text-center py-8 text-[12px] text-[#a1a1aa]">No users found.</div>
                </Table.Td>
              </Table.Tr>
            ) : (
              filtered.map((u) => (
                <Table.Tr key={u.id}>
                  <Table.Td>
                    <div className="flex items-center gap-2">
                      <Avatar src={u.avatar || null} size={22} radius="xl">
                        {u.firstName?.[0]}
                        {u.lastName?.[0]}
                      </Avatar>
                      <span className="font-medium">
                        {u.firstName} {u.lastName}
                      </span>
                    </div>
                  </Table.Td>
                  <Table.Td className="!text-[#71717a]">{u.email}</Table.Td>
                  <Table.Td className="!text-[#71717a]">{u.phone || '—'}</Table.Td>
                  <Table.Td className="!text-[#71717a]">{u.address || '—'}</Table.Td>
                  <Table.Td>
                    <Badge size="xs" variant="light" color={u.role === 'Admin' ? 'primary' : 'gray'} radius="xl">
                      {u.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td className="!text-[#71717a]">
                    {u.createdAt ? dayjs(u.createdAt).format('DD/MM/YYYY') : '—'}
                  </Table.Td>
                  <Table.Td>
                    <div className="flex justify-end">
                      <ActionIcon variant="subtle" color="gray" size="sm" aria-label="Edit">
                        <FiEdit2 size={13} />
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

export default UserList
