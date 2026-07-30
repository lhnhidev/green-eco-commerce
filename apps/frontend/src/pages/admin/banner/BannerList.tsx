import { invalidateGetAllBanners, useCreateBanner, useDeleteBanner, useGetAllBanners, useUpdateBanner } from '@api'
import type { BannerDto } from '@api/schemas'
import { ImageDropzone } from '@components/features/upload/ImageDropzone'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import Panel from '@components/ui/primitives/Panel'
import RowActions from '@components/ui/primitives/RowActions'
import { Badge, Button, NumberInput, Switch, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { ImageIcon, LinkIcon, PlusIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import dayjs from 'dayjs'
import { useState } from 'react'

interface BannerForm {
  title: string
  subtitle: string
  imageUrl: string
  linkUrl: string
  sortOrder: number
  isActive: boolean
}

const defaultForm: BannerForm = {
  title: '',
  subtitle: '',
  imageUrl: '',
  linkUrl: '',
  sortOrder: 1,
  isActive: true,
}

const BannerList = () => {
  const queryClient = useQueryClient()
  const { data: banners = [], isLoading } = useGetAllBanners()
  const [editing, setEditing] = useState<BannerDto | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BannerDto | null>(null)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)

  const form = useForm<BannerForm>({
    initialValues: defaultForm,
    validate: {
      title: (v) => (!v.trim() ? 'Title is required' : null),
      imageUrl: (v) => (!v.trim() ? 'Image URL is required' : null),
      sortOrder: (v) => (v < 1 ? 'Must be ≥ 1' : null),
    },
  })

  const invalidate = () => invalidateGetAllBanners(queryClient)

  const { mutate: create, isPending: creating } = useCreateBanner({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        setShowForm(false)
        form.reset()
        notifications.show({ title: 'Banner created', message: '', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to create banner.', color: 'red' }),
    },
  })

  const { mutate: update, isPending: updating } = useUpdateBanner({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        setEditing(null)
        setShowForm(false)
        form.reset()
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
    form.setValues(defaultForm)
    setShowForm(true)
  }

  const openEdit = (banner: BannerDto) => {
    setEditing(banner)
    form.setValues({
      title: banner.title,
      subtitle: banner.subtitle ?? '',
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl ?? '',
      sortOrder: banner.sortOrder,
      isActive: banner.isActive,
    })
    setShowForm(true)
  }

  const handleSubmit = (values: BannerForm) => {
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
      {showForm && (
        <Panel variant="admin" padding="md" className="mb-3">
          <h2 className="font-semibold text-sm text-gray-800 mb-3">{editing ? 'Edit Banner' : 'New Banner'}</h2>
          <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextInput
                label="Title"
                withAsterisk
                placeholder="e.g. Live Greener Every Day"
                {...form.getInputProps('title')}
              />
              <TextInput label="Link URL" placeholder="/products (optional)" {...form.getInputProps('linkUrl')} />
            </div>
            <Textarea
              label="Subtitle"
              placeholder="Short description shown under the title..."
              minRows={2}
              {...form.getInputProps('subtitle')}
            />
            <ImageDropzone
              label="Banner Image"
              value={form.values.imageUrl}
              onChange={(url) => form.setFieldValue('imageUrl', url)}
            />
            {form.errors.imageUrl && <p className="text-xs text-red-500">{form.errors.imageUrl}</p>}
            <div className="flex items-center gap-4">
              <NumberInput label="Sort Order" min={1} w={120} {...form.getInputProps('sortOrder')} />
              <Switch
                label="Active"
                className="mt-6"
                checked={form.values.isActive}
                onChange={(e) => form.setFieldValue('isActive', e.currentTarget.checked)}
              />
            </div>
            <div className="flex gap-2 justify-end mt-1">
              <Button
                variant="subtle"
                color="gray"
                size="xs"
                onClick={() => {
                  setShowForm(false)
                  form.reset()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" size="xs" loading={creating || updating}>
                {editing ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </form>
        </Panel>
      )}

      <DataTable
        columns={columns}
        rows={banners}
        getRowKey={(b) => b.id}
        isLoading={isLoading}
        emptyIcon={ImageIcon}
        emptyTitle="No banners yet"
        emptyDescription='Click "Add Banner" to create one.'
      />

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
