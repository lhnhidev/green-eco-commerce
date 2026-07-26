import { getGetAllBannersQueryKey, useCreateBanner, useDeleteBanner, useGetAllBanners, useUpdateBanner } from '@api'
import type { BannerDto } from '@api/schemas'
import { ActionIcon, Badge, Button, NumberInput, Switch, Table, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { FiEdit2, FiExternalLink, FiPlus, FiTrash2 } from 'react-icons/fi'

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

  const form = useForm<BannerForm>({
    initialValues: defaultForm,
    validate: {
      title: (v) => (!v.trim() ? 'Title is required' : null),
      imageUrl: (v) => (!v.trim() ? 'Image URL is required' : null),
      sortOrder: (v) => (v < 1 ? 'Must be ≥ 1' : null),
    },
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetAllBannersQueryKey() })

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

  const { mutate: remove } = useDeleteBanner({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        notifications.show({ title: 'Banner deleted', message: '', color: 'orange' })
      },
    },
  })

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

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Banner Management</h1>
          <p className="text-[13px] text-muted-foreground mt-0.5">Manage homepage promotional banners</p>
        </div>
        <Button size="sm" color="primary" leftSection={<FiPlus size={14} />} onClick={openCreate}>
          Add Banner
        </Button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">{editing ? 'Edit Banner' : 'New Banner'}</h2>
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
            <TextInput label="Image URL" withAsterisk placeholder="https://..." {...form.getInputProps('imageUrl')} />
            {form.values.imageUrl && (
              <img
                src={form.values.imageUrl}
                alt="preview"
                className="h-32 w-full object-cover rounded-xl border border-green-200"
              />
            )}
            <div className="flex items-center gap-4">
              <NumberInput label="Sort Order" min={1} w={120} {...form.getInputProps('sortOrder')} />
              <div className="mt-6">
                <Switch
                  label="Active"
                  checked={form.values.isActive}
                  onChange={(e) => form.setFieldValue('isActive', e.currentTarget.checked)}
                  color="green"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-1">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setShowForm(false)
                  form.reset()
                }}
              >
                Cancel
              </Button>
              <Button type="submit" color="primary" loading={creating || updating}>
                {editing ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
        <Table highlightOnHover>
          <Table.Thead className="bg-gray-50 border-b border-[#ececee]">
            <Table.Tr>
              <Table.Th className="!text-[11px] !font-semibold !text-gray-500 !uppercase !tracking-wide">
                Preview
              </Table.Th>
              <Table.Th className="!text-[11px] !font-semibold !text-gray-500 !uppercase !tracking-wide">
                Title
              </Table.Th>
              <Table.Th className="!text-[11px] !font-semibold !text-gray-500 !uppercase !tracking-wide">Link</Table.Th>
              <Table.Th className="!text-[11px] !font-semibold !text-gray-500 !uppercase !tracking-wide">
                Order
              </Table.Th>
              <Table.Th className="!text-[11px] !font-semibold !text-gray-500 !uppercase !tracking-wide">
                Status
              </Table.Th>
              <Table.Th className="!text-[11px] !font-semibold !text-gray-500 !uppercase !tracking-wide">
                Created
              </Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={7} className="text-center py-8 text-gray-400">
                  Loading…
                </Table.Td>
              </Table.Tr>
            ) : banners.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7} className="text-center py-8 text-gray-400">
                  No banners yet. Click "Add Banner" to create one.
                </Table.Td>
              </Table.Tr>
            ) : (
              banners.map((b) => (
                <Table.Tr key={b.id}>
                  <Table.Td>
                    <img src={b.imageUrl} alt={b.title} className="w-20 h-12 object-cover rounded-md bg-gray-100" />
                  </Table.Td>
                  <Table.Td>
                    <div className="font-semibold text-sm text-gray-800">{b.title}</div>
                    {b.subtitle && <div className="text-xs text-gray-400 truncate max-w-48">{b.subtitle}</div>}
                  </Table.Td>
                  <Table.Td>
                    {b.linkUrl ? (
                      <a
                        href={b.linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <FiExternalLink size={12} /> {b.linkUrl}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </Table.Td>
                  <Table.Td className="!text-sm !font-semibold text-center">{b.sortOrder}</Table.Td>
                  <Table.Td>
                    <Badge size="xs" radius="sm" color={b.isActive ? 'green' : 'gray'} variant="light">
                      {b.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Table.Td>
                  <Table.Td className="!text-xs !text-muted-foreground">
                    {dayjs(b.createdAt).format('DD MMM YYYY')}
                  </Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-1">
                      <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => openEdit(b)}>
                        <FiEdit2 size={14} />
                      </ActionIcon>
                      <ActionIcon variant="subtle" color="red" size="sm" onClick={() => remove({ id: b.id })}>
                        <FiTrash2 size={14} />
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

export default BannerList
