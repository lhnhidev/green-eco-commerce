import type { MaterialDto } from '@api/schemas'
import { MaterialTypeEnum } from '@api/schemas'
import { Button, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

export type MaterialFormValues = {
  name: string
  type: MaterialTypeEnum
  ecoRating: number
}

const emptyValues: MaterialFormValues = {
  name: '',
  type: MaterialTypeEnum.Recycled,
  ecoRating: 50,
}

const toFormValues = (material: MaterialDto): MaterialFormValues => ({
  name: material.name,
  type: material.type,
  ecoRating: Number(material.ecoRating),
})

const typeOptions = Object.values(MaterialTypeEnum).map((t) => ({ value: t, label: t }))

type MaterialFormProps = {
  editingMaterial: MaterialDto | null
  onSubmit: (values: MaterialFormValues) => void
  onCancel: () => void
  isSubmitting?: boolean
}

const MaterialForm = ({ editingMaterial, onSubmit, onCancel, isSubmitting }: MaterialFormProps) => {
  const isEditing = !!editingMaterial

  const form = useForm<MaterialFormValues>({
    initialValues: editingMaterial ? toFormValues(editingMaterial) : emptyValues,
    validate: {
      name: (val) => (val.trim().length === 0 ? 'Name is required' : null),
    },
  })

  useEffect(() => {
    form.setValues(editingMaterial ? toFormValues(editingMaterial) : emptyValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingMaterial])

  return (
    <form onSubmit={form.onSubmit(onSubmit)} className="flex flex-col gap-3">
      <TextInput label="Name" placeholder="Bamboo Fiber" withAsterisk {...form.getInputProps('name')} />
      <Select label="Type" data={typeOptions} allowDeselect={false} {...form.getInputProps('type')} />
      <NumberInput label="Eco rating" min={0} max={100} {...form.getInputProps('ecoRating')} />
      <div className="flex justify-end gap-2 mt-2">
        <Button variant="default" size="xs" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="xs" loading={isSubmitting}>
          {isEditing ? 'Save changes' : 'Create Material'}
        </Button>
      </div>
    </form>
  )
}

export default MaterialForm
