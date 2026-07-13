import { getGetApiMaterialsQueryKey, usePostApiMaterials } from '@api'
import { MaterialTypeEnum } from '@api/schemas'
import { ActionIcon, Button, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { FiArrowLeft } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router'

const MaterialCreate = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createMaterial, isPending } = usePostApiMaterials()

  const form = useForm({
    initialValues: {
      name: '',
      type: MaterialTypeEnum.Recycled,
      ecoRating: 50,
      unit: 'kg',
      notes: '',
    },
    validate: {
      name: (val) => (val.trim().length === 0 ? 'Name is required' : null),
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
      },
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
          <div className="grid grid-cols-1 gap-6">
            <TextInput label="Name" placeholder="Bamboo Fiber" withAsterisk {...form.getInputProps('name')} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Select
              label="Type"
              data={[
                { value: MaterialTypeEnum.Recycled, label: 'Recycled' },
                { value: MaterialTypeEnum.Organic, label: 'Organic' },
                { value: MaterialTypeEnum.Biodegradable, label: 'Biodegradable' },
              ]}
              {...form.getInputProps('type')}
            />
            <NumberInput label="Eco Rating" min={0} max={100} {...form.getInputProps('ecoRating')} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <TextInput label="Unit" placeholder="kg, meters..." {...form.getInputProps('unit')} />
            <TextInput label="Notes" placeholder="Additional details..." {...form.getInputProps('notes')} />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button component={Link} to="/admin/material" variant="default">
              Cancel
            </Button>
            <Button type="submit" color="primary" loading={isPending}>
              Create Material
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MaterialCreate
