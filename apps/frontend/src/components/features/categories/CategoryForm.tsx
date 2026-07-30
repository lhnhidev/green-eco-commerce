import { useGetAllCategories } from '@api'
import type { CategoryDto } from '@api/schemas'
import { Button, Select, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

export type CategoryFormValues = {
  name: string
  description: string
  parentId: string | null
}

const emptyValues: CategoryFormValues = {
  name: '',
  description: '',
  parentId: null,
}

const toFormValues = (category: CategoryDto): CategoryFormValues => ({
  name: category.name,
  description: category.description ?? '',
  parentId: category.parentId ?? null,
})

type CategoryFormProps = {
  editingCategory: CategoryDto | null
  onSubmit: (values: CategoryFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const CategoryForm = ({ editingCategory, onSubmit, onCancel, isSubmitting }: CategoryFormProps) => {
  const isEditing = !!editingCategory
  const { data: categories } = useGetAllCategories()

  // Only root categories can be a parent, and a category can't be its own parent.
  const parentOptions = (categories ?? [])
    .filter((c) => !c.parentId && c.id !== editingCategory?.id)
    .map((c) => ({ value: c.id, label: c.name }))

  const form = useForm<CategoryFormValues>({
    initialValues: editingCategory ? toFormValues(editingCategory) : emptyValues,
    validate: {
      name: (value) => (value.trim().length < 2 ? 'Name must have at least 2 letters' : null),
    },
  })

  useEffect(() => {
    form.setValues(editingCategory ? toFormValues(editingCategory) : emptyValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingCategory])

  return (
    <form onSubmit={form.onSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextInput label="Category Name" placeholder="e.g. Zero Waste" withAsterisk {...form.getInputProps('name')} />
      <Textarea
        label="Description"
        placeholder="Description of the category"
        autosize
        minRows={2}
        {...form.getInputProps('description')}
      />
      <Select
        label="Parent Category"
        placeholder="None (top-level)"
        data={parentOptions}
        clearable
        {...form.getInputProps('parentId')}
      />
      <div className="flex justify-end gap-2 mt-1">
        <Button variant="default" size="xs" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="xs" type="submit" loading={isSubmitting}>
          {isEditing ? 'Save Changes' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}

export default CategoryForm
