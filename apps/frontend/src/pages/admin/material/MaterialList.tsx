import {
  invalidateGetAllMaterials,
  useCreateMaterial,
  useDeleteMaterial,
  useGetAllMaterials,
  useUpdateMaterial,
} from '@api'
import type { MaterialDto } from '@api/schemas'
import MaterialForm, { type MaterialFormValues } from '@components/features/material/MaterialForm'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import RowActions from '@components/ui/primitives/RowActions'
import StatCard from '@components/ui/primitives/StatCard'
import Toolbar from '@components/ui/primitives/Toolbar'
import { Badge, Button, Modal, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { LeafIcon, MagnifyingGlassIcon, PlusIcon, StackIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

const MaterialList = () => {
  const queryClient = useQueryClient()
  const { data: materials, isLoading } = useGetAllMaterials()

  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<MaterialDto | null>(null)
  const [editing, setEditing] = useState<MaterialDto | null>(null)
  const [formOpened, setFormOpened] = useState(false)

  const invalidate = () => invalidateGetAllMaterials(queryClient)

  const { mutate: createMaterial, isPending: isCreating } = useCreateMaterial({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        setFormOpened(false)
        notifications.show({ title: 'Created', message: 'Material created successfully.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not create material.', color: 'red' }),
    },
  })
  const { mutate: deleteMaterial, isPending: isDeleting } = useDeleteMaterial({
    mutation: {
      onSuccess: async () => {
        await invalidate()
      },
    },
  })
  const { mutate: updateMaterial, isPending: isUpdating } = useUpdateMaterial({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        setFormOpened(false)
        setEditing(null)
        notifications.show({ title: 'Updated', message: 'Material updated successfully.', color: 'green' })
      },
      onError: () =>
        notifications.show({ title: 'Update failed', message: 'Could not update this material.', color: 'red' }),
    },
  })

  const openCreate = () => {
    setEditing(null)
    setFormOpened(true)
  }

  const openEdit = (m: MaterialDto) => {
    setEditing(m)
    setFormOpened(true)
  }

  const closeForm = () => {
    setFormOpened(false)
    setEditing(null)
  }

  const handleFormSubmit = (values: MaterialFormValues) => {
    if (editing) {
      updateMaterial({ id: editing.id, data: values })
    } else {
      createMaterial({ data: values })
    }
  }

  const filtered = useMemo(() => {
    if (!materials) return []
    const keyword = search.trim().toLowerCase()
    if (!keyword) return materials
    return materials.filter((m) => m.name.toLowerCase().includes(keyword))
  }, [materials, search])

  const stats = useMemo(() => {
    const list = materials ?? []
    const total = list.length
    const avgEco = total === 0 ? 0 : Math.round(list.reduce((sum, m) => sum + Number(m.ecoRating), 0) / total)
    return { total, avgEco }
  }, [materials])

  const confirmDelete = () => {
    if (!deleting) return
    deleteMaterial(
      { id: deleting.id },
      {
        onSuccess: () => {
          notifications.show({ title: 'Deleted', message: 'Material deleted successfully.', color: 'green' })
          setDeleting(null)
        },
        onError: () => {
          notifications.show({ title: 'Delete failed', message: 'Could not delete this material.', color: 'red' })
        },
      },
    )
  }

  const columns: DataTableColumn<MaterialDto>[] = [
    { key: 'name', header: 'Material', render: (m) => <span className="font-medium">{m.name}</span> },
    {
      key: 'type',
      header: 'Type',
      width: 140,
      render: (m) => (
        <Badge size="xs" variant="light" color="primary">
          {m.type}
        </Badge>
      ),
    },
    {
      key: 'productCount',
      header: 'Products',
      width: 120,
      render: (m) => (
        <span className="text-sm">
          <span className="font-medium">{m.productCount}</span>{' '}
          <span className="text-2xs text-muted-foreground">product{m.productCount === 1 ? '' : 's'}</span>
        </span>
      ),
    },
    {
      key: 'ecoRating',
      header: 'Eco rating',
      width: 200,
      render: (m) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 max-w-30 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${Math.min(Number(m.ecoRating), 100)}%` }}
            />
          </div>
          <span className="text-2xs text-muted-foreground whitespace-nowrap">{Number(m.ecoRating)}/100</span>
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 70,
      align: 'right',
      render: (m) => <RowActions onEdit={() => openEdit(m)} onDelete={() => setDeleting(m)} />,
    },
  ]

  return (
    <AdminPageShell
      title="Materials"
      actions={
        <Button size="xs" leftSection={<PlusIcon size={13} />} onClick={openCreate}>
          Add new material
        </Button>
      }
    >
      <div className="flex gap-2.5 mb-2.5">
        <StatCard label="Total materials" value={stats.total} icon={StackIcon} />
        <StatCard label="Average eco rating" value={`${stats.avgEco}/100`} icon={LeafIcon} tone="primary" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(m) => m.id}
        isLoading={isLoading}
        emptyIcon={StackIcon}
        emptyTitle="No materials found"
        toolbar={
          <Toolbar
            left={
              <TextInput
                placeholder="Search materials..."
                size="xs"
                leftSection={<MagnifyingGlassIcon size={13} />}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                w={220}
              />
            }
            right={
              <span className="text-2xs text-muted-foreground">
                {filtered.length} of {materials?.length ?? 0} shown
              </span>
            }
          />
        }
      />

      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editing ? 'Edit material' : 'New material'}
        centered
        size="sm"
      >
        <MaterialForm
          editingMaterial={editing}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          isSubmitting={isCreating || isUpdating}
        />
      </Modal>

      <ConfirmModal
        opened={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete material"
        message={
          <>
            Are you sure you want to delete <span className="font-semibold text-gray-900">{deleting?.name}</span>? This
            action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        loading={isDeleting}
      />
    </AdminPageShell>
  )
}

export default MaterialList
