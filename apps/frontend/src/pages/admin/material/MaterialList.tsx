import { getGetAllMaterialsQueryKey, useDeleteMaterial, useGetAllMaterials, useUpdateMaterial } from '@api'
import { type MaterialDto, MaterialTypeEnum } from '@api/schemas'
import Loading from '@components/ui/status/Loading'
import { ActionIcon, Badge, Button, Modal, NumberInput, Select, Table, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router'

const typeOptions = Object.values(MaterialTypeEnum).map((t) => ({ value: t, label: t }))

const MaterialList = () => {
  const queryClient = useQueryClient()
  const { data: materials, isLoading } = useGetAllMaterials()

  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<MaterialDto | null>(null)
  const [editing, setEditing] = useState<MaterialDto | null>(null)

  const { mutate: deleteMaterial, isPending: isDeleting } = useDeleteMaterial()
  const { mutate: updateMaterial, isPending: isUpdating } = useUpdateMaterial()

  const form = useForm({
    initialValues: {
      name: '',
      type: MaterialTypeEnum.Recycled as MaterialTypeEnum,
      ecoRating: 50,
    },
    validate: {
      name: (val) => (val.trim().length === 0 ? 'Name is required' : null),
    },
  })

  const openEdit = (m: MaterialDto) => {
    form.setValues({ name: m.name, type: m.type, ecoRating: Number(m.ecoRating) })
    form.resetDirty()
    setEditing(m)
  }

  const closeEdit = () => {
    setEditing(null)
    form.reset()
  }

  const handleUpdate = (values: typeof form.values) => {
    if (!editing) return
    updateMaterial(
      { id: editing.id, data: values },
      {
        onSuccess: () => {
          notifications.show({ title: 'Updated', message: 'Material updated successfully.', color: 'green' })
          queryClient.invalidateQueries({ queryKey: getGetAllMaterialsQueryKey() })
          closeEdit()
        },
        onError: () => {
          notifications.show({ title: 'Update failed', message: 'Could not update this material.', color: 'red' })
        },
      },
    )
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
          queryClient.invalidateQueries({ queryKey: getGetAllMaterialsQueryKey() })
          setDeleting(null)
        },
        onError: () => {
          notifications.show({ title: 'Delete failed', message: 'Could not delete this material.', color: 'red' })
        },
      },
    )
  }

  if (isLoading) return <Loading text="Loading materials..." />

  return (
    <div className="w-full h-full">
      <div className="flex gap-2.5 mb-2.5">
        <div className="w-52 bg-white border border-[#ececee] rounded-xl shadow-[0_1px_2px_rgba(24,24,27,0.04)] px-3.5 py-2.5">
          <p className="text-[11px] text-muted-foreground">Total materials</p>
          <p className="text-[20px] font-bold text-[#18181b] leading-tight mt-0.5">{stats.total}</p>
        </div>
        <div className="w-52 bg-white border border-[#ececee] rounded-xl shadow-[0_1px_2px_rgba(24,24,27,0.04)] px-3.5 py-2.5">
          <p className="text-[11px] text-muted-foreground">Average eco rating</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[20px] font-bold text-[#18181b] leading-tight">
              {stats.avgEco}
              <span className="text-[12px] font-medium text-muted-foreground">/100</span>
            </p>
            <div className="flex-1 h-[5px] rounded-full bg-[#f4f4f5] overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${stats.avgEco}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-2.5">
        <TextInput
          placeholder="Search materials..."
          size="xs"
          leftSection={<FiSearch size={13} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          w={220}
        />
        <span className="text-[11px] text-muted-foreground">
          {filtered.length} of {materials?.length ?? 0} shown
        </span>
        <div className="flex-1" />
        <Button
          component={Link}
          to="/admin/material/create"
          color="primary"
          size="xs"
          leftSection={<FiPlus size={13} />}
        >
          Add new material
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
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
              <Table.Th>Material</Table.Th>
              <Table.Th w={140}>Type</Table.Th>
              <Table.Th w={200}>Eco rating</Table.Th>
              <Table.Th w={70} ta="right">
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4}>
                  <p className="text-center text-[12px] text-[#a1a1aa] py-8">No materials found.</p>
                </Table.Td>
              </Table.Tr>
            ) : (
              filtered.map((m) => (
                <Table.Tr key={m.id}>
                  <Table.Td className="!font-medium">{m.name}</Table.Td>
                  <Table.Td>
                    <Badge size="xs" variant="light" color="primary" radius="xl">
                      {m.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[120px] h-[5px] rounded-full bg-[#f4f4f5] overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min(Number(m.ecoRating), 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {Number(m.ecoRating)}/100
                      </span>
                    </div>
                  </Table.Td>
                  <Table.Td>
                    <div className="flex gap-0.5 justify-end">
                      <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => openEdit(m)} aria-label="Edit">
                        <FiEdit2 size={13} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        size="sm"
                        onClick={() => setDeleting(m)}
                        aria-label="Delete"
                      >
                        <FiTrash2 size={13} />
                      </ActionIcon>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>

      <Modal opened={editing !== null} onClose={closeEdit} title="Edit material" centered size="sm">
        <form onSubmit={form.onSubmit(handleUpdate)} className="flex flex-col gap-3">
          <TextInput label="Name" size="xs" withAsterisk {...form.getInputProps('name')} />
          <Select label="Type" size="xs" data={typeOptions} allowDeselect={false} {...form.getInputProps('type')} />
          <NumberInput label="Eco rating" size="xs" min={0} max={100} {...form.getInputProps('ecoRating')} />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="default" size="xs" onClick={closeEdit}>
              Cancel
            </Button>
            <Button type="submit" color="primary" size="xs" loading={isUpdating}>
              Save changes
            </Button>
          </div>
        </form>
      </Modal>

      <Modal opened={deleting !== null} onClose={() => setDeleting(null)} title="Delete material" centered size="sm">
        <p className="text-[13px] text-muted-foreground">
          Are you sure you want to delete <span className="font-semibold text-[#18181b]">{deleting?.name}</span>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="default" size="xs" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button color="red" size="xs" loading={isDeleting} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default MaterialList
