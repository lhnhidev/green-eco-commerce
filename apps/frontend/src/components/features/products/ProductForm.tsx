import { useGetAllCategories, useGetAllMaterials } from '@api'
import type { ProductDto } from '@api/schemas'
import { MultiImageDropzone } from '@components/features/upload/ImageDropzone'
import FormGrid from '@components/ui/primitives/FormGrid'
import FormPanel from '@components/ui/primitives/FormPanel'
import { MultiSelect, NumberInput, Select, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

export type ProductFormValues = {
  name: string
  description: string
  price: number
  stockQty: number
  categoryId: string
  carbonIndex: number
  baselineCarbonIndex: number
  decomposePercent: number
  recyclePercent: number
  imageUrl: string[]
  materialIds: string[]
}

const emptyValues: ProductFormValues = {
  name: '',
  description: '',
  price: 0,
  stockQty: 0,
  categoryId: '',
  carbonIndex: 0,
  baselineCarbonIndex: 0,
  decomposePercent: 0,
  recyclePercent: 0,
  imageUrl: [],
  materialIds: [],
}

const toFormValues = (product: ProductDto): ProductFormValues => ({
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

type ProductFormProps = {
  editingProduct: ProductDto | null
  onSubmit: (values: ProductFormValues) => void
  isSubmitting?: boolean
}

const ProductForm = ({ editingProduct, onSubmit, isSubmitting }: ProductFormProps) => {
  const isEditing = !!editingProduct
  const { data: categories } = useGetAllCategories()
  const { data: materials } = useGetAllMaterials()

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }))
  const materialOptions = (materials ?? []).map((m) => ({ value: m.id, label: m.name }))

  const form = useForm<ProductFormValues>({
    initialValues: editingProduct ? toFormValues(editingProduct) : emptyValues,
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      price: (value) => (value <= 0 ? 'Price must be greater than 0' : null),
      categoryId: (value) => (!value ? 'Category is required' : null),
    },
  })

  useEffect(() => {
    form.setValues(editingProduct ? toFormValues(editingProduct) : emptyValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct])

  return (
    <FormPanel
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      description={
        isEditing
          ? 'Update the details of this eco-friendly product.'
          : 'Fill in the details to create a new eco-friendly product.'
      }
      backTo="/admin/product"
      cancelTo="/admin/product"
      submitLabel={isEditing ? 'Save Changes' : 'Create Product'}
      isSubmitting={isSubmitting}
      onSubmit={form.onSubmit(onSubmit)}
      width="wide"
    >
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

      <FormGrid>
        <NumberInput label="Price ($)" withAsterisk min={0} decimalScale={2} {...form.getInputProps('price')} />
        <NumberInput label="Stock Qty" min={0} {...form.getInputProps('stockQty')} />
      </FormGrid>

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

      <MultiImageDropzone
        label="Product Images"
        value={form.values.imageUrl}
        onChange={(urls) => form.setFieldValue('imageUrl', urls)}
      />

      <FormGrid>
        <NumberInput label="Carbon Index (kg CO₂)" min={0} decimalScale={2} {...form.getInputProps('carbonIndex')} />
        <NumberInput
          label="Baseline Carbon Index (kg CO₂)"
          min={0}
          decimalScale={2}
          {...form.getInputProps('baselineCarbonIndex')}
        />
      </FormGrid>

      <FormGrid>
        <NumberInput label="Decompose %" min={0} max={100} suffix="%" {...form.getInputProps('decomposePercent')} />
        <NumberInput label="Recycle %" min={0} max={100} suffix="%" {...form.getInputProps('recyclePercent')} />
      </FormGrid>
    </FormPanel>
  )
}

export default ProductForm
