import { Button, Modal, NumberInput, Select, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  getGetApiMaterialsQueryKey,
  usePostApiMaterials,
  usePutApiMaterialsId,
} from '../../../api'
import type { MaterialItem } from '../../../api/schemas'
import { MaterialTypeEnum } from '../../../api/schemas'

// Các lựa chọn cho dropdown "Type" — lấy trực tiếp từ enum backend
const typeOptions = Object.values(MaterialTypeEnum).map((value) => ({
  value,
  label: value,
}))

type MaterialFormValues = {
  name: string
  type: string
  ecoRating: number
  origin: string
  sku: string
  stockQty: number
  unit: string
  unitPrice: number
  imageUrl: string
}

const emptyValues: MaterialFormValues = {
  name: '',
  type: MaterialTypeEnum.Natural,
  ecoRating: 0,
  origin: '',
  sku: '',
  stockQty: 0,
  unit: '',
  unitPrice: 0,
  imageUrl: '',
}

type MaterialFormModalProps = {
  opened: boolean
  onClose: () => void
  // Nếu có material => chế độ Edit; nếu null => chế độ Create
  material: MaterialItem | null
}

const MaterialFormModal = ({ opened, onClose, material }: MaterialFormModalProps) => {
  const queryClient = useQueryClient()
  const isEdit = material !== null

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MaterialFormValues>({ defaultValues: emptyValues })

  // Đổ dữ liệu vào form mỗi khi mở modal (Create: rỗng, Edit: dữ liệu material)
  useEffect(() => {
    if (opened) {
      if (material) {
        reset({
          name: material.name,
          type: material.type,
          ecoRating: Number(material.ecoRating),
          origin: material.origin ?? '',
          sku: material.sku ?? '',
          stockQty: Number(material.stockQty),
          unit: material.unit ?? '',
          unitPrice: Number(material.unitPrice),
          imageUrl: material.imageUrl ?? '',
        })
      } else {
        reset(emptyValues)
      }
    }
  }, [opened, material, reset])

  const { mutate: createMaterial, isPending: isCreating } = usePostApiMaterials()
  const { mutate: updateMaterial, isPending: isUpdating } = usePutApiMaterialsId()

  const invalidateAndClose = () => {
    queryClient.invalidateQueries({ queryKey: getGetApiMaterialsQueryKey() })
    onClose()
  }

  const onSubmit = (values: MaterialFormValues) => {
    // Backend nhận các field mở rộng là optional
    const payload = {
      name: values.name,
      type: values.type,
      ecoRating: values.ecoRating,
      origin: values.origin || null,
      sku: values.sku || null,
      stockQty: values.stockQty,
      unit: values.unit || null,
      unitPrice: values.unitPrice,
      imageUrl: values.imageUrl || null,
    }

    if (isEdit && material) {
      updateMaterial(
        { id: material.id, data: payload },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Updated',
              message: 'Material updated successfully.',
              color: 'green',
            })
            invalidateAndClose()
          },
          onError: () => {
            notifications.show({
              title: 'Update failed',
              message: 'Could not update material. Please check the input.',
              color: 'red',
            })
          },
        },
      )
    } else {
      createMaterial(
        { data: payload },
        {
          onSuccess: () => {
            notifications.show({
              title: 'Created',
              message: 'Material created successfully.',
              color: 'green',
            })
            invalidateAndClose()
          },
          onError: () => {
            notifications.show({
              title: 'Create failed',
              message: 'Could not create material. Please check the input.',
              color: 'red',
            })
          },
        },
      )
    }
  }

  const isPending = isCreating || isUpdating

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? 'Edit material' : 'Add new material'}
      centered
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <TextInput
          label="Name"
          placeholder="e.g. Natural bamboo"
          withAsterisk
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

        <Select
          label="Type"
          data={typeOptions}
          value={watch('type')}
          onChange={(value) => setValue('type', value ?? MaterialTypeEnum.Natural)}
          withAsterisk
          allowDeselect={false}
        />

        <NumberInput
          label="Eco rating (0 - 100)"
          min={0}
          max={100}
          value={watch('ecoRating')}
          onChange={(value) => setValue('ecoRating', Number(value) || 0)}
          withAsterisk
        />

        <TextInput
          label="Origin"
          placeholder="e.g. Vietnam (Ha Giang)"
          {...register('origin')}
        />

        <TextInput label="SKU" placeholder="e.g. MAT-BMBO-01" {...register('sku')} />

        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Stock quantity"
            min={0}
            decimalScale={2}
            value={watch('stockQty')}
            onChange={(value) => setValue('stockQty', Number(value) || 0)}
          />
          <TextInput label="Unit" placeholder="e.g. kg, m²" {...register('unit')} />
        </div>

        <NumberInput
          label="Unit price (VND)"
          min={0}
          thousandSeparator=","
          value={watch('unitPrice')}
          onChange={(value) => setValue('unitPrice', Number(value) || 0)}
        />

        <TextInput
          label="Image URL"
          placeholder="https://..."
          {...register('imageUrl')}
        />

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="default" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" color="green" loading={isPending}>
            {isEdit ? 'Save changes' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default MaterialFormModal
