import { getGetAllProductsQueryKey, useDeleteProduct, useGetAllProducts } from '@api'
import type { ProductDto } from '@api/schemas'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import RowActions from '@components/ui/primitives/RowActions'
import Toolbar from '@components/ui/primitives/Toolbar'
import { Badge, Button, TextInput } from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { MagnifyingGlassIcon, PackageIcon, PlusIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '@utils/formatCurrency'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

const PAGE_SIZE = 20

const ProductList = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<ProductDto | null>(null)
  const [opened, { open, close }] = useDisclosure(false)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetAllProductsQueryKey() })
      },
    },
  })

  const { data, isLoading } = useGetAllProducts({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
  })

  const products = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  const handleDeleteClick = (product: ProductDto) => {
    setDeleteTarget(product)
    open()
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    deleteProduct(
      { id: deleteTarget.id },
      {
        onSuccess: () => {
          notifications.show({ title: 'Deleted', message: 'Product has been removed.', color: 'green' })
          close()
          setDeleteTarget(null)
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Could not delete product.', color: 'red' })
        },
      },
    )
  }

  const columns: DataTableColumn<ProductDto>[] = [
    { key: 'name', header: 'Product name', render: (p) => <span className="font-medium">{p.name}</span> },
    { key: 'price', header: 'Price', width: 90, render: (p) => formatCurrency(p.price) },
    {
      key: 'stock',
      header: 'Stock',
      width: 70,
      render: (p) => <span className={p.stockQty < 20 ? 'text-red-500 font-semibold' : ''}>{p.stockQty}</span>,
    },
    {
      key: 'materials',
      header: 'Materials',
      width: 150,
      render: (p) => (
        <div className="flex gap-1 flex-nowrap items-center overflow-hidden">
          {p.materials?.slice(0, 1).map((m) => (
            <Badge key={m.id} size="xs" variant="light" color="primary">
              {m.name}
            </Badge>
          ))}
          {(p.materials?.length ?? 0) > 1 && (
            <span className="text-2xs text-fg-subtle shrink-0">+{p.materials.length - 1}</span>
          )}
        </div>
      ),
    },
    {
      key: 'carbon',
      header: 'Carbon index',
      width: 95,
      render: (p) => (
        <span className="text-muted-foreground">
          {p.carbonIndex} <span className="text-fg-subtle">/ {p.baselineCarbonIndex}</span>
        </span>
      ),
    },
    {
      key: 'recycle',
      header: 'Recycle',
      width: 90,
      render: (p) => <span className="text-muted-foreground">{p.recyclePercent}%</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 80,
      render: (p) => (
        <Badge size="xs" variant="light" color={p.isActive ? 'primary' : 'gray'}>
          {p.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 70,
      align: 'right',
      render: (p) => (
        <RowActions onEdit={() => navigate(`/admin/product/${p.id}/edit`)} onDelete={() => handleDeleteClick(p)} />
      ),
    },
  ]

  return (
    <AdminPageShell
      title="Products"
      actions={
        <Button component={Link} to="/admin/product/create" size="xs" leftSection={<PlusIcon size={13} />}>
          Add new product
        </Button>
      }
    >
      <Toolbar
        left={
          <TextInput
            placeholder="Search products..."
            size="xs"
            leftSection={<MagnifyingGlassIcon size={13} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value)
              setPage(1)
            }}
            w={220}
          />
        }
        right={<span className="text-2xs text-muted-foreground">{totalCount} products total</span>}
      />

      <DataTable
        columns={columns}
        rows={products}
        getRowKey={(p) => p.id}
        isLoading={isLoading}
        emptyIcon={PackageIcon}
        emptyTitle="No products found"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmModal
        opened={opened}
        onClose={close}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={
          <>
            Are you sure you want to delete <strong className="text-gray-700">{deleteTarget?.name}</strong>? This action
            cannot be undone.
          </>
        }
        confirmLabel="Delete"
        loading={isDeleting}
      />
    </AdminPageShell>
  )
}

export default ProductList
