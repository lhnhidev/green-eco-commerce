import {
  invalidateGetAllCategories,
  useCreateCategory,
  useDeleteCategory,
  useGetAllCategories,
  useUpdateCategory,
} from '@api'
import type { CategoryDto } from '@api/schemas'
import CategoryForm, { type CategoryFormValues } from '@components/features/categories/CategoryForm'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import RowActions from '@components/ui/primitives/RowActions'
import Toolbar from '@components/ui/primitives/Toolbar'
import { Button, Modal, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { MagnifyingGlassIcon, PlusIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

const CategoryList = () => {
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  const { data: categories, isLoading } = useGetAllCategories()

  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<{ id: string; name: string } | null>(null)

  const invalidate = () => invalidateGetAllCategories(queryClient)

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeForm()
        notifications.show({ title: 'Created', message: 'Category has been created.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not create category.', color: 'red' }),
    },
  })
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeForm()
        setEditingCategory(null)
        notifications.show({ title: 'Updated', message: 'Category has been updated.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not update category.', color: 'red' }),
    },
  })
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeDelete()
        notifications.show({ title: 'Deleted', message: 'Category removed.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not delete category.', color: 'red' }),
    },
  })

  const openCreate = () => {
    setEditingCategory(null)
    openForm()
  }

  const handleEditClick = (cat: CategoryDto) => {
    setEditingCategory(cat)
    openForm()
  }

  const handleFormSubmit = (values: CategoryFormValues) => {
    const data = { name: values.name, description: values.description || null, parentId: values.parentId || null }
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, data })
    } else {
      createCategory({ data })
    }
  }

  const handleDeleteClick = (id: string, name: string) => {
    setDeletingCategory({ id, name })
    openDelete()
  }

  // Map id -> name for parent category display
  const nameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const c of categories ?? []) map.set(c.id, c.name)
    return map
  }, [categories])

  // Sort: parents first, children immediately after their parent
  const sortedCategories = useMemo(() => {
    if (!categories) return []
    const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    if (search) return filtered

    const roots = categories.filter((c) => !c.parentId)
    const result: typeof categories = []
    for (const root of roots) {
      result.push(root)
      result.push(...categories.filter((c) => c.parentId === root.id))
    }
    for (const c of categories) {
      if (!result.includes(c)) result.push(c)
    }
    return result
  }, [categories, search])

  const columns: DataTableColumn<CategoryDto>[] = [
    {
      key: 'name',
      header: 'Category name',
      width: 220,
      render: (cat) => (
        <span className="font-medium">
          {cat.parentId && <span className="text-border-strong mr-2">└</span>}
          {cat.name}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (cat) => <span className="text-muted-foreground">{cat.description || '—'}</span>,
    },
    {
      key: 'parent',
      header: 'Parent',
      width: 160,
      render: (cat) => (
        <span className="text-muted-foreground">
          {cat.parentId ? (nameById.get(cat.parentId) ?? '—') : <span className="text-border-strong">—</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 70,
      align: 'right',
      render: (cat) => (
        <RowActions onEdit={() => handleEditClick(cat)} onDelete={() => handleDeleteClick(cat.id, cat.name)} />
      ),
    },
  ]

  return (
    <AdminPageShell
      title="Categories"
      actions={
        <Button size="xs" leftSection={<PlusIcon size={13} />} onClick={openCreate}>
          Add new category
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={sortedCategories}
        getRowKey={(c) => c.id}
        isLoading={isLoading}
        emptyIcon={SquaresFourIcon}
        emptyTitle="No categories found"
        toolbar={
          <Toolbar
            left={
              <TextInput
                placeholder="Search categories..."
                size="xs"
                leftSection={<MagnifyingGlassIcon size={13} />}
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
                w={220}
              />
            }
            right={
              <span className="text-2xs text-muted-foreground">
                {sortedCategories.length} of {categories?.length ?? 0} shown
              </span>
            }
          />
        }
      />

      <Modal
        opened={formOpened}
        onClose={closeForm}
        title={editingCategory ? 'Edit Category' : 'New Category'}
        centered
      >
        <CategoryForm
          editingCategory={editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
          isSubmitting={isCreating || isUpdating}
        />
      </Modal>

      <ConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={() => deletingCategory && deleteCategory({ id: deletingCategory.id })}
        title="Delete Category"
        message={
          <>
            Are you sure you want to delete <strong className="text-gray-700">{deletingCategory?.name}</strong>? This
            cannot be undone.
          </>
        }
        confirmLabel="Delete"
        loading={isDeleting}
      />
    </AdminPageShell>
  )
}

export default CategoryList
