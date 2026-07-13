import { Button, TextInput, ActionIcon } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router'
import { FiArrowLeft } from 'react-icons/fi'
import { getGetApiCategoriesQueryKey, usePostApiCategories } from '../../../api'

const CategoryCreate = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createCategory, isPending } = usePostApiCategories()

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    createCategory(
      { data: values },
      {
        onSuccess: () => {
          notifications.show({ title: 'Success', message: 'Category created', color: 'green' })
          queryClient.invalidateQueries({ queryKey: getGetApiCategoriesQueryKey() })
          navigate('/admin/category')
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Could not create category', color: 'red' })
        },
      }
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
          <TextInput label="Description" placeholder="Description of the category" {...form.getInputProps('description')} />
          
          <div className="flex justify-end gap-4 mt-4">
            <Button component={Link} to="/admin/category" variant="default">Cancel</Button>
            <Button type="submit" color="primary" loading={isPending}>Create Category</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryCreate
