import {
  getGetAllUsersQueryKey,
  useActivateUser,
  useCreateUser,
  useDeactivateUser,
  useDeleteUser,
  useGetAllUsers,
  useUpdateUser,
} from '@api'
import type { ProblemDetails, UserDto } from '@api/schemas'
import UserForm, { type UserFormValues } from '@components/features/user/UserForm'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import RowActions from '@components/ui/primitives/RowActions'
import Toolbar from '@components/ui/primitives/Toolbar'
import { ActionIcon, Avatar, Badge, Button, Modal, TextInput, Tooltip } from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  DownloadSimpleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UserCheckIcon,
  UserMinusIcon,
  UsersIcon,
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { downloadFile } from '@utils/downloadFile'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import type { AxiosError } from 'axios'
import dayjs from 'dayjs'
import { useState } from 'react'

const PAGE_SIZE = 20

const getErrorMessage = (error: unknown, fallback: string) =>
  (error as AxiosError<ProblemDetails>).response?.data.detail || fallback

const UserList = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const [editingUser, setEditingUser] = useState<UserDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserDto | null>(null)

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
  const { data, isLoading } = useGetAllUsers({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
  })
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

  const invalidateUsers = () => queryClient.invalidateQueries({ queryKey: getGetAllUsersQueryKey() })

  const { mutate: createUser, isPending: creating } = useCreateUser({
    mutation: {
      onSuccess: async () => {
        await invalidateUsers()
        closeModal()
        notifications.show({ title: 'Created', message: 'User account created.', color: 'green' })
      },
      onError: (error) =>
        notifications.show({
          title: 'Error',
          message: getErrorMessage(error, 'Could not create user.'),
          color: 'red',
        }),
    },
  })

  const { mutate: updateUser, isPending: updating } = useUpdateUser({
    mutation: {
      onSuccess: async () => {
        await invalidateUsers()
        closeModal()
        setEditingUser(null)
        notifications.show({ title: 'Updated', message: 'User account updated.', color: 'green' })
      },
      onError: (error) =>
        notifications.show({
          title: 'Error',
          message: getErrorMessage(error, 'Could not update user.'),
          color: 'red',
        }),
    },
  })

  const { mutate: deleteUser, isPending: deleting } = useDeleteUser({
    mutation: {
      onSuccess: async () => {
        await invalidateUsers()
        closeDelete()
        setDeleteTarget(null)
        notifications.show({ title: 'Deleted', message: 'User account removed.', color: 'red' })
      },
      onError: (error) =>
        notifications.show({
          title: 'Error',
          message: getErrorMessage(error, 'Could not delete user.'),
          color: 'red',
        }),
    },
  })

  const openCreate = () => {
    setEditingUser(null)
    openModal()
  }

  const openEdit = (user: UserDto) => {
    setEditingUser(user)
    openModal()
  }

  const handleFormSubmit = (values: UserFormValues) => {
    if (editingUser) {
      updateUser({ id: editingUser.id, data: values })
    } else {
      createUser({ data: values })
    }
  }

  const handleDeleteClick = (user: UserDto) => {
    setDeleteTarget(user)
    openDelete()
  }

  const users = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  const columns: DataTableColumn<UserDto>[] = [
    {
      key: 'name',
      header: 'Name',
      width: 200,
      render: (u) => (
        <div className="flex items-center gap-2">
          <Avatar src={resolveImageUrl(u.avatar) ?? null} size={22} radius="xl">
            {u.firstName?.[0]}
            {u.lastName?.[0]}
          </Avatar>
          <span className="font-medium">
            {u.firstName} {u.lastName}
          </span>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      width: 220,
      render: (u) => <span className="text-muted-foreground">{u.email}</span>,
    },
    {
      key: 'phone',
      header: 'Phone',
      width: 120,
      render: (u) => <span className="text-muted-foreground">{u.phone || '—'}</span>,
    },
    {
      key: 'address',
      header: 'Address',
      render: (u) => <span className="text-muted-foreground">{u.address || '—'}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      width: 70,
      render: (u) => (
        <Badge size="xs" variant="light" color={u.role === 'Admin' ? 'primary' : 'gray'}>
          {u.role}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 80,
      render: (u) => (
        <Badge size="xs" variant="dot" color={u.isActive ? 'green' : 'red'}>
          {u.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'joined',
      header: 'Joined',
      width: 100,
      render: (u) => (
        <span className="text-muted-foreground">{u.createdAt ? dayjs(u.createdAt).format('DD/MM/YYYY') : '—'}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 100,
      align: 'right',
      render: (u) => {
        const isTogglingThis = activatingVar?.id === u.id || deactivatingVar?.id === u.id
        return (
          <RowActions
            onEdit={() => openEdit(u)}
            onDelete={() => handleDeleteClick(u)}
            extra={
              u.isActive ? (
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
              )
            }
          />
        )
      },
    },
  ]

  return (
    <AdminPageShell
      title="Users"
      actions={
        <Button size="xs" leftSection={<PlusIcon size={13} />} onClick={openCreate}>
          Add user
        </Button>
      }
    >
      <Toolbar
        left={
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
        }
        right={
          <>
            <span className="text-2xs text-muted-foreground">{totalCount} users total</span>
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
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={users}
        getRowKey={(u) => u.id}
        isLoading={isLoading}
        emptyIcon={UsersIcon}
        emptyTitle="No users found"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <Modal opened={modalOpened} onClose={closeModal} title={editingUser ? 'Edit User' : 'New User'} size="md">
        <UserForm
          editingUser={editingUser}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          isSubmitting={creating || updating}
        />
      </Modal>

      <ConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={() => deleteTarget && deleteUser({ id: deleteTarget.id })}
        title="Delete User"
        message={
          <>
            Delete{' '}
            <strong className="text-gray-700">
              {deleteTarget?.firstName} {deleteTarget?.lastName}
            </strong>
            ? This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminPageShell>
  )
}

export default UserList
