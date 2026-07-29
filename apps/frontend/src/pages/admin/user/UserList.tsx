import { getGetAllUsersQueryKey, useActivateUser, useDeactivateUser, useGetAllUsers } from '@api'
import { ActionIcon, Avatar, Badge, Button, Pagination, Table, TextInput, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { DownloadSimpleIcon, MagnifyingGlassIcon, UserCheckIcon, UserMinusIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { downloadFile } from '@utils/downloadFile'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

const PAGE_SIZE = 20

const UserList = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      await downloadFile('/api/users/export.xlsx', `users_${new Date().toISOString().slice(0, 10)}.xlsx`)
    } catch {
      notifications.show({ title: 'Export failed', message: 'Could not download Excel file.', color: 'red' })
    } finally {
      setExporting(false)
    }
  }

  const queryClient = useQueryClient()
  const { data, isLoading } = useGetAllUsers({ pageNumber: page, pageSize: PAGE_SIZE, search: search || undefined })
  const { mutate: activateUser, variables: activatingVar } = useActivateUser({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() })
        notifications.show({ title: 'Activated', message: 'User account has been activated.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not activate user.', color: 'red' }),
    },
  })
  const { mutate: deactivateUser, variables: deactivatingVar } = useDeactivateUser({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() })
        notifications.show({ title: 'Deactivated', message: 'User account has been deactivated.', color: 'yellow' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not deactivate user.', color: 'red' }),
    },
  })

  const users = useMemo(() => data?.items ?? [], [data])
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

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
          leftSection={<MagnifyingGlassIcon size={13} />}
          value={search}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
            setPage(1)
          }}
          w={240}
        />
        <span className="text-[11px] text-muted-foreground flex-1">{totalCount} users total</span>
        <Button
          size="xs"
          variant="light"
          color="gray"
          leftSection={<DownloadSimpleIcon size={13} />}
          loading={exporting}
          onClick={handleExportExcel}
        >
          Export Excel
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            verticalSpacing={6}
            horizontalSpacing={8}
            highlightOnHover
            classNames={{
              th: '!text-[11px] !font-semibold !uppercase !tracking-[0.04em] !text-muted-foreground !bg-[#fafafa]',
              td: '!text-[12px]',
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={200}>Name</Table.Th>
                <Table.Th w={220}>Email</Table.Th>
                <Table.Th w={120}>Phone</Table.Th>
                <Table.Th>Address</Table.Th>
                <Table.Th w={70}>Role</Table.Th>
                <Table.Th w={80}>Status</Table.Th>
                <Table.Th w={100}>Joined</Table.Th>
                <Table.Th w={70} ta="right">
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <div className="text-center py-8 text-[12px] text-[#a1a1aa]">Loading users…</div>
                  </Table.Td>
                </Table.Tr>
              ) : filtered.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <div className="text-center py-8 text-[12px] text-[#a1a1aa]">No users found.</div>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filtered.map((u) => {
                  const isTogglingThis = activatingVar?.id === u.id || deactivatingVar?.id === u.id

                  return (
                    <Table.Tr key={u.id}>
                      <Table.Td>
                        <div className="flex items-center gap-2">
                          <Avatar src={resolveImageUrl(u.avatar) ?? null} size={22} radius="xl">
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
                      <Table.Td>
                        <Badge size="xs" variant="dot" color={u.isActive ? 'green' : 'red'} radius="xl">
                          {u.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Table.Td>
                      <Table.Td className="text-muted-foreground!">
                        {u.createdAt ? dayjs(u.createdAt).format('DD/MM/YYYY') : '—'}
                      </Table.Td>
                      <Table.Td>
                        <div className="flex gap-0.5 justify-end">
                          {u.isActive ? (
                            <Tooltip label="Deactivate account" withArrow position="left">
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                size="sm"
                                loading={isTogglingThis}
                                aria-label="Deactivate"
                                onClick={() => deactivateUser({ id: u.id })}
                              >
                                <UserMinusIcon size={13} />
                              </ActionIcon>
                            </Tooltip>
                          ) : (
                            <Tooltip label="Activate account" withArrow position="left">
                              <ActionIcon
                                variant="subtle"
                                color="green"
                                size="sm"
                                loading={isTogglingThis}
                                aria-label="Activate"
                                onClick={() => activateUser({ id: u.id })}
                              >
                                <UserCheckIcon size={13} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  )
                })
              )}
            </Table.Tbody>
          </Table>
        </div>
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
