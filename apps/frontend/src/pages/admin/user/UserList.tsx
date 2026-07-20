import { useGetAllUsers } from '@api'
import { ActionIcon, Avatar, Badge, Pagination, Table, TextInput } from '@mantine/core'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { FiEdit2, FiSearch } from 'react-icons/fi'

const PAGE_SIZE = 20

const UserList = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useGetAllUsers({ PageNumber: page, PageSize: PAGE_SIZE, Search: search || undefined })

  const users = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  // Client-side name filter (Search param already handles server-side)
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
          onChange={(e) => {
            setSearch(e.currentTarget.value)
            setPage(1)
          }}
          w={240}
        />
        <span className="text-[11px] text-muted-foreground">{totalCount} users total</span>
      </div>

      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
        <Table
          verticalSpacing={6}
          horizontalSpacing={8}
          highlightOnHover
          classNames={{
            th: '!text-[11px] font-semibold! !uppercase !tracking-[0.04em] text-muted-foreground! !bg-[#fafafa]',
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
                  <Table.Td className="text-muted-foreground!">{u.email}</Table.Td>
                  <Table.Td className="text-muted-foreground!">{u.phone || '—'}</Table.Td>
                  <Table.Td className="text-muted-foreground!">{u.address || '—'}</Table.Td>
                  <Table.Td>
                    <Badge size="xs" variant="light" color={u.role === 'Admin' ? 'primary' : 'gray'} radius="xl">
                      {u.role}
                    </Badge>
                  </Table.Td>
                  <Table.Td className="text-muted-foreground!">
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

      {totalPages > 1 && (
        <div className="flex justify-end mt-3">
          <Pagination total={totalPages} value={page} onChange={setPage} size="xs" />
        </div>
      )}
    </div>
  )
}

export default UserList
