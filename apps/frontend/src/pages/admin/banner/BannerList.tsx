import { invalidateGetAllBanners, useCreateBanner, useDeleteBanner, useGetAllBanners, useUpdateBanner } from '@api'
import type { BannerDto } from '@api/schemas'
import BannerForm, { type BannerFormValues } from '@components/features/banners/BannerForm'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import RowActions from '@components/ui/primitives/RowActions'
import Toolbar from '@components/ui/primitives/Toolbar'
import { Badge, Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { ImageIcon, LinkIcon, PlusIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import dayjs from 'dayjs'
import { useState } from 'react'

const BannerList = () => {
  const queryClient = useQueryClient()
  const { data: banners = [], isLoading } = useGetAllBanners()
  const [editing, setEditing] = useState<BannerDto | null>(null)
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
  const [deleteTarget, setDeleteTarget] = useState<BannerDto | null>(null)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)

  const invalidate = () => invalidateGetAllBanners(queryClient)

  const { mutate: create, isPending: creating } = useCreateBanner({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeModal()
        notifications.show({ title: 'Banner created', message: '', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to create banner.', color: 'red' }),
    },
  })

  const { mutate: update, isPending: updating } = useUpdateBanner({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeModal()
        setEditing(null)
        notifications.show({ title: 'Banner updated', message: '', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to update banner.', color: 'red' }),
    },
  })

  const { mutate: remove, isPending: deleting } = useDeleteBanner({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeDelete()
        setDeleteTarget(null)
        notifications.show({ title: 'Banner deleted', message: '', color: 'orange' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to delete banner.', color: 'red' }),
    },
  })

  const handleDeleteClick = (banner: BannerDto) => {
    setDeleteTarget(banner)
    openDelete()
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    remove({ id: deleteTarget.id })
  }

  const openCreate = () => {
    setEditing(null)
    openModal()
  }

  const openEdit = (banner: BannerDto) => {
    setEditing(banner)
    openModal()
  }

  const handleSubmit = (values: BannerFormValues) => {
    const payload = {
      title: values.title,
      subtitle: values.subtitle || null,
      imageUrl: values.imageUrl,
      linkUrl: values.linkUrl || null,
      sortOrder: values.sortOrder,
      isActive: values.isActive,
    }
    if (editing) {
      update({ id: editing.id, data: payload })
    } else {
      create({ data: payload })
    }
  }

  const columns: DataTableColumn<BannerDto>[] = [
    {
      key: 'preview',
      header: 'Preview',
      width: 90,
      render: (b) => (
        <img
          src={resolveImageUrl(b.imageUrl)}
          alt={b.title}
          className="w-20 h-12 object-cover rounded-md bg-gray-100"
        />
      ),
    },
    {
      key: 'title',
      header: 'Title',
      render: (b) => (
        <>
          <div className="font-medium">{b.title}</div>
          {b.subtitle && <div className="text-xs text-muted-foreground truncate max-w-48">{b.subtitle}</div>}
        </>
      ),
    },
    {
      key: 'link',
      header: 'Link',
      render: (b) =>
        b.linkUrl ? (
          <a
            href={b.linkUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <LinkIcon size={12} /> {b.linkUrl}
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: 'order',
      header: 'Order',
      width: 70,
      align: 'center',
      render: (b) => <span className="font-semibold">{b.sortOrder}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 90,
      render: (b) => (
        <Badge size="xs" color={b.isActive ? 'green' : 'gray'} variant="light">
          {b.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'created',
      header: 'Created',
      width: 110,
      render: (b) => <span className="text-muted-foreground">{dayjs(b.createdAt).format('DD MMM YYYY')}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 70,
      align: 'right',
      render: (b) => <RowActions onEdit={() => openEdit(b)} onDelete={() => handleDeleteClick(b)} />,
    },
  ]

  return (
    <AdminPageShell
      title="Banners"
      description="Manage homepage promotional banners"
      actions={
        <Button size="xs" leftSection={<PlusIcon size={13} />} onClick={openCreate}>
          Add Banner
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={banners}
        getRowKey={(b) => b.id}
        isLoading={isLoading}
        emptyIcon={ImageIcon}
        emptyTitle="No banners yet"
        emptyDescription='Click "Add Banner" to create one.'
        toolbar={<Toolbar right={<span className="text-2xs text-muted-foreground">{banners.length} banners total</span>} />}
      />

      <Modal opened={modalOpened} onClose={closeModal} title={editing ? 'Edit Banner' : 'New Banner'} centered>
        <BannerForm
          editingBanner={editing}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={creating || updating}
        />
      </Modal>

      <ConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Banner"
        message={
          <>
            Are you sure you want to delete <strong className="text-gray-700">{deleteTarget?.title}</strong>? This
            action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminPageShell>
  )
}

export default BannerList
