import { getGetAllCategoriesQueryKey, useCreateCategory, useGetAllCategories } from '@api'
import { ActionIcon, Button, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router'

const CategoryCreate = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createCategory, isPending } = useCreateCategory({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: getGetAllCategoriesQueryKey() })
      },
    },
  })
  const { data: categories } = useGetAllCategories()

  const parentOptions = (categories ?? [])
    .filter((c) => !c.parentId) // only root categories as parent options
    .map((c) => ({ value: c.id, label: c.name }))

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      parentId: null as string | null,
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    createCategory(
      {
        data: {
          name: values.name,
          description: values.description || null,
          parentId: values.parentId || null,
        },
      },
      {
        onSuccess: () => {
          notifications.show({ title: 'Success', message: 'Category created', color: 'green' })
          navigate('/admin/category')
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Could not create category', color: 'red' })
        },
      },
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto h-full">
      <div className="flex items-center gap-4 mb-6">
        <ActionIcon component={Link} to="/admin/category" variant="light" color="gray" radius="xl" size="lg">
          <FiArrowLeft />
        </ActionIcon>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Add New Category</h1>
          <p className="text-gray-500 mt-1">Fill in the details to create a new category.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-8">
        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-6">
          <TextInput label="Category Name" placeholder="e.g. Zero Waste" withAsterisk {...form.getInputProps('name')} />
          <TextInput
            label="Description"
            placeholder="Description of the category"
            {...form.getInputProps('description')}
          />
          <Select
            label="Parent Category"
            placeholder="None (top-level)"
            data={parentOptions}
            clearable
            {...form.getInputProps('parentId')}
          />

          <div className="flex justify-end gap-4 mt-4">
            <Button component={Link} to="/admin/category" variant="default">
              Cancel
            </Button>
            <Button type="submit" color="primary" loading={isPending}>
              Create Category
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryCreate
