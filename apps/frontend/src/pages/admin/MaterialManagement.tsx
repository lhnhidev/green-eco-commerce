import { ActionIcon, Badge, Button, Modal, Table, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import {
  getGetApiMaterialsQueryKey,
  useDeleteApiMaterialsId,
  useGetApiMaterials,
} from '../../api'
import type { MaterialItem } from '../../api/schemas'
import MaterialFormModal from '../../components/features/material/MaterialFormModal'
import Loading from '../../components/ui/status/Loading'

// Định dạng số tiền VND
const formatVnd = (value: number | string) =>
  new Intl.NumberFormat('vi-VN').format(Number(value))

const MaterialManagement = () => {
  const queryClient = useQueryClient()
  const { data: materials, isLoading } = useGetApiMaterials()

  const [search, setSearch] = useState('')
  const [formOpened, setFormOpened] = useState(false)
  const [editing, setEditing] = useState<MaterialItem | null>(null)
  const [deleting, setDeleting] = useState<MaterialItem | null>(null)

  const { mutate: deleteMaterial, isPending: isDeleting } = useDeleteApiMaterialsId()

  // Lọc theo tên hoặc SKU
  const filtered = useMemo(() => {
    if (!materials) return []
    const keyword = search.trim().toLowerCase()
    if (!keyword) return materials
    return materials.filter(
      (m) =>
        m.name.toLowerCase().includes(keyword) ||
        (m.sku ?? '').toLowerCase().includes(keyword),
    )
  }, [materials, search])

  // Vài chỉ số tổng hợp tính ở client (không cần API riêng)
  const stats = useMemo(() => {
    const list = materials ?? []
    const total = list.length
    const avgEco =
      total === 0
        ? 0
        : Math.round(list.reduce((sum, m) => sum + Number(m.ecoRating), 0) / total)
    const lowStock = list.filter((m) => Number(m.stockQty) < 300).length
    return { total, avgEco, lowStock }
  }, [materials])

  const openCreate = () => {
    setEditing(null)
    setFormOpened(true)
  }

  const openEdit = (material: MaterialItem) => {
    setEditing(material)
    setFormOpened(true)
  }

  const confirmDelete = () => {
    if (!deleting) return
    deleteMaterial(
      { id: deleting.id },
      {
        onSuccess: () => {
          notifications.show({
            title: 'Deleted',
            message: 'Material deleted successfully.',
            color: 'green',
          })
          queryClient.invalidateQueries({ queryKey: getGetApiMaterialsQueryKey() })
          setDeleting(null)
        },
        onError: () => {
          notifications.show({
            title: 'Delete failed',
            message: 'Could not delete this material.',
            color: 'red',
          })
        },
      },
    )
  }

  if (isLoading) return <Loading text="Loading materials..." />

  return (
    <div className="px-8 py-5 bg-[#f9f9f9] min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Material management</h1>
          <p className="text-gray-500 mt-1">
            Track and manage your sustainable material sources.
          </p>
        </div>
        <Button color="green" leftSection={<FiPlus />} onClick={openCreate}>
          Add new material
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Total materials</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Average eco rating</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.avgEco}/100</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <p className="text-gray-500 text-sm">Low stock (&lt; 300)</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.lowStock}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 mb-4">
        <TextInput
          placeholder="Search by material name or SKU..."
          leftSection={<FiSearch />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Table verticalSpacing="md" horizontalSpacing="lg" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Material</Table.Th>
              <Table.Th>Origin</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Eco rating</Table.Th>
              <Table.Th>Stock</Table.Th>
              <Table.Th>Unit price (VND)</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filtered.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <p className="text-center text-gray-400 py-6">No materials found.</p>
                </Table.Td>
              </Table.Tr>
            ) : (
              filtered.map((m) => (
                <Table.Tr key={m.id}>
                  <Table.Td>
                    <div className="font-medium text-gray-800">{m.name}</div>
                    <div className="text-xs text-gray-400">SKU: {m.sku ?? '—'}</div>
                  </Table.Td>
                  <Table.Td>{m.origin ?? '—'}</Table.Td>
                  <Table.Td>
                    <Badge color="green" variant="light">
                      {m.type}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{Number(m.ecoRating)}/100</Table.Td>
                  <Table.Td>
                    {formatVnd(m.stockQty)} {m.unit ?? ''}
                  </Table.Td>
                  <Table.Td>{formatVnd(m.unitPrice)}</Table.Td>
                  <Table.Td>
                    <div className="flex gap-2">
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => openEdit(m)}
                        aria-label="Edit"
                      >
                        <FiEdit2 />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => setDeleting(m)}
                        aria-label="Delete"
                      >
                        <FiTrash2 />
                      </ActionIcon>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>

      {/* Create / Edit modal */}
      <MaterialFormModal
        opened={formOpened}
        onClose={() => setFormOpened(false)}
        material={editing}
      />

      {/* Delete confirmation modal */}
      <Modal
        opened={deleting !== null}
        onClose={() => setDeleting(null)}
        title="Delete material"
        centered
        size="sm"
      >
        <p className="text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold">{deleting?.name}</span>? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3 mt-5">
          <Button variant="default" onClick={() => setDeleting(null)}>
            Cancel
          </Button>
          <Button color="red" loading={isDeleting} onClick={confirmDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default MaterialManagement
