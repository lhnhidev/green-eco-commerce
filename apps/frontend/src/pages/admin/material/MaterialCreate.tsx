import { Button, TextInput, NumberInput, Select, ActionIcon } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router'
import { FiArrowLeft } from 'react-icons/fi'
import { getGetApiMaterialsQueryKey, usePostApiMaterials } from '../../../api'
import { MaterialTypeEnum } from '../../../api/schemas'

const MaterialCreate = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createMaterial, isPending } = usePostApiMaterials()

  const form = useForm({
    initialValues: {
      name: '',
      sku: '',
      origin: '',
      type: MaterialTypeEnum.Recycled,
      ecoRating: 50,
      stockQty: 0,
      unit: 'kg',
      unitPrice: 0,
      notes: '',
    },
    validate: {
      name: (val) => (val.trim().length === 0 ? 'Name is required' : null),
      sku: (val) => (val.trim().length === 0 ? 'SKU is required' : null),
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    createMaterial(
      { data: values },
      {
        onSuccess: () => {
          notifications.show({ title: 'Success', message: 'Material created successfully', color: 'green' })
          queryClient.invalidateQueries({ queryKey: getGetApiMaterialsQueryKey() })
          navigate('/admin/material')
        },
        onError: () => {
          notifications.show({ title: 'Error', message: 'Could not create material', color: 'red' })
        },
      }
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto h-full">
      <div className="flex items-center gap-4 mb-6">
        <ActionIcon component={Link} to="/admin/material" variant="light" color="gray" radius="xl" size="lg">
          <FiArrowLeft />
        </ActionIcon>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Add New Material</h1>
          <p className="text-gray-500 mt-1">Provide details for the sustainable material.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-primary/10 p-8">
        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <TextInput label="Name" placeholder="Bamboo Fiber" withAsterisk {...form.getInputProps('name')} />
            <TextInput label="SKU" placeholder="MAT-BAM-01" withAsterisk {...form.getInputProps('sku')} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <TextInput label="Origin" placeholder="Vietnam" {...form.getInputProps('origin')} />
            <Select
              label="Type"
              data={[
                { value: MaterialTypeEnum.Recycled, label: 'Recycled' },
                { value: MaterialTypeEnum.Organic, label: 'Organic' },
                { value: MaterialTypeEnum.Biodegradable, label: 'Biodegradable' },
              ]}
              {...form.getInputProps('type')}
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <NumberInput label="Eco Rating" min={0} max={100} {...form.getInputProps('ecoRating')} />
            <NumberInput label="Stock Qty" min={0} {...form.getInputProps('stockQty')} />
            <TextInput label="Unit" placeholder="kg, meters..." {...form.getInputProps('unit')} />
          </div>

          <NumberInput label="Unit Price (VND)" min={0} step={1000} {...form.getInputProps('unitPrice')} />
          <TextInput label="Notes" placeholder="Additional details..." {...form.getInputProps('notes')} />

          <div className="flex justify-end gap-4 mt-4">
            <Button component={Link} to="/admin/material" variant="default">Cancel</Button>
            <Button type="submit" color="primary" loading={isPending}>Create Material</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MaterialCreate
