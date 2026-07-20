import {
  getGetAllProductsQueryKey,
  useGetAllCategories,
  useGetAllMaterials,
  useGetProductById,
  useUpdateProduct,
} from '@api'
import { ActionIcon, Button, MultiSelect, NumberInput, Select, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useNavigate, useParams } from 'react-router'

const ProductEdit = () => {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: product, isLoading: isLoadingProduct } = useGetProductById(id!, {
    query: { enabled: !!id },
  })
  const { mutate: updateProduct, isPending } = useUpdateProduct()
  const { data: categories } = useGetAllCategories()
  const { data: materials } = useGetAllMaterials()

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }))
  const materialOptions = (materials ?? []).map((m) => ({ value: m.id, label: m.name }))

  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      price: 0,
      stockQty: 0,
      categoryId: '',
      carbonIndex: 0,
      baselineCarbonIndex: 0,
      decomposePercent: 0,
      recyclePercent: 0,
      imageUrl: [] as string[],
      materialIds: [] as string[],
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
      categoryId: (value) => (!value ? 'Category is required' : null),
    },
  })

  useEffect(() => {
    if (product) {
      form.setValues({
        name: product.name ?? '',
        description: product.description ?? '',
        price: product.price ?? 0,
        stockQty: product.stockQty ?? 0,
        categoryId: product.categoryId ?? '',
        carbonIndex: product.carbonIndex ?? 0,
        baselineCarbonIndex: product.baselineCarbonIndex ?? 0,
        decomposePercent: product.decomposePercent ?? 0,
        recyclePercent: product.recyclePercent ?? 0,
        imageUrl: product.imageUrl ?? [],
        materialIds: (product.materials ?? []).map((m) => m.id),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product])

  const handleSubmit = (values: typeof form.values) => {
    if (!id) return
    updateProduct(
      {
        id,
        data: {
          name: values.name,
          description: values.description || null,
          price: values.price,
          stockQty: values.stockQty,
          categoryId: values.categoryId,
          carbonIndex: values.carbonIndex,
          baselineCarbonIndex: values.baselineCarbonIndex,
          decomposePercent: values.decomposePercent,
          recyclePercent: values.recyclePercent,
          imageUrl: values.imageUrl,
          materialIds: values.materialIds,
        },
      },
      {
        onSuccess: () => {
          notifications.show({ title: 'Success', message: 'Product updated', color: 'green' })
          queryClient.invalidateQueries({ queryKey: getGetAllProductsQueryKey() })
          navigate('/admin/product')
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Could not update product', color: 'red' })
        },
      },
    )
  }

  if (isLoadingProduct) {
    return <div className="text-center py-16 text-gray-400">Loading product…</div>
  }

  return (
    <div className="w-full max-w-2xl mx-auto h-full">
      <div className="flex items-center gap-4 mb-6">
        <ActionIcon component={Link} to="/admin/product" variant="light" color="gray" radius="xl" size="lg">
          <FiArrowLeft />
        </ActionIcon>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Edit Product</h1>
          <p className="text-gray-500 mt-1">Update the details of this eco-friendly product.</p>
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
          <Textarea
            label="Description"
            placeholder="Description of the product"
            autosize
            minRows={2}
            {...form.getInputProps('description')}
          />

          <div className="grid grid-cols-2 gap-6">
            <NumberInput label="Price ($)" withAsterisk min={0} decimalScale={2} {...form.getInputProps('price')} />
            <NumberInput label="Stock Qty" min={0} {...form.getInputProps('stockQty')} />
          </div>

          <Select
            label="Category"
            placeholder="Select a category"
            data={categoryOptions}
            withAsterisk
            searchable
            {...form.getInputProps('categoryId')}
          />

          <MultiSelect
            label="Materials"
            placeholder="Select materials"
            data={materialOptions}
            searchable
            {...form.getInputProps('materialIds')}
          />

          <div className="grid grid-cols-2 gap-6">
            <NumberInput
              label="Carbon Index (kg CO₂)"
              min={0}
              decimalScale={2}
              {...form.getInputProps('carbonIndex')}
            />
            <NumberInput
              label="Baseline Carbon Index (kg CO₂)"
              min={0}
              decimalScale={2}
              {...form.getInputProps('baselineCarbonIndex')}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <NumberInput
              label="Decompose %"
              min={0}
              max={100}
              suffix="%"
              {...form.getInputProps('decomposePercent')}
            />
            <NumberInput
              label="Recycle %"
              min={0}
              max={100}
              suffix="%"
              {...form.getInputProps('recyclePercent')}
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button component={Link} to="/admin/product" variant="default">
              Cancel
            </Button>
            <Button type="submit" color="primary" loading={isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductEdit
