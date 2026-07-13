import { getGetApiProductsAllQueryKey, usePostApiProducts } from '@api'
import { Button, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router'

const ProductCreate = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createProduct, isPending } = usePostApiProducts()

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      ecoScore: 0,
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    createProduct(
      { data: values },
      {
        onSuccess: () => {
          notifications.show({ title: 'Success', message: 'Product created', color: 'green' })
          queryClient.invalidateQueries({ queryKey: getGetApiProductsAllQueryKey() })
          navigate('/admin/product')
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Could not create product', color: 'red' })
        },
      },
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto h-full">
      <div className="flex items-center gap-4 mb-6">
        <ActionIcon component={Link} to="/admin/product" variant="light" color="gray" radius="xl" size="lg">
          <FiArrowLeft />
        </ActionIcon>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Add New Product</h1>
          <p className="text-gray-500 mt-1">Fill in the details to create a new eco-friendly product.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-8">
        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-6">
          <TextInput
            label="Product Name"
            placeholder="e.g. Bamboo Toothbrush"
            withAsterisk
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Description"
            placeholder="Description of the product"
            {...form.getInputProps('description')}
          />
          <div className="grid grid-cols-2 gap-6">
            <TextInput type="number" label="Price ($)" withAsterisk {...form.getInputProps('price')} />
            <TextInput type="number" label="Eco Score (0-100)" {...form.getInputProps('ecoScore')} />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button component={Link} to="/admin/product" variant="default">
              Cancel
            </Button>
            <Button type="submit" color="primary" loading={isPending}>
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { ActionIcon } from '@mantine/core'
export default ProductCreate
