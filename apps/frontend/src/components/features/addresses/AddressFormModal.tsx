import { invalidateGetMyAddresses, useCreateAddress, useUpdateAddress } from '@api'
import type { AddressDto, ProblemDetails } from '@api/schemas'
import { Button, Checkbox, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useEffect } from 'react'
import AddressAutocomplete from './AddressAutocomplete'

type AddressFormValues = {
  label: string
  recipientName: string
  phone: string
  formattedAddress: string
  commune: string | null
  province: string | null
  placeId: string | null
  isDefault: boolean
}

const emptyValues: AddressFormValues = {
  label: '',
  recipientName: '',
  phone: '',
  formattedAddress: '',
  commune: null,
  province: null,
  placeId: null,
  isDefault: false,
}

type AddressFormModalProps = {
  opened: boolean
  onClose: () => void
  address?: AddressDto | null
}

const AddressFormModal = ({ opened, onClose, address }: AddressFormModalProps) => {
  const isEdit = !!address
  const queryClient = useQueryClient()

  const form = useForm<AddressFormValues>({
    initialValues: emptyValues,
    validate: {
      label: (v) => (!v.trim() ? 'Label is required' : null),
      recipientName: (v) => (!v.trim() ? 'Recipient name is required' : null),
      phone: (v) => (!v.trim() ? 'Phone is required' : null),
      formattedAddress: (v) => (!v.trim() ? 'Address is required' : null),
    },
  })

  useEffect(() => {
    if (!opened) return
    form.setValues(
      address
        ? {
            label: address.label,
            recipientName: address.recipientName,
            phone: address.phone,
            formattedAddress: address.formattedAddress,
            commune: address.commune,
            province: address.province,
            placeId: null,
            isDefault: address.isDefault,
          }
        : emptyValues,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened, address])

  const invalidate = () => invalidateGetMyAddresses(queryClient)

  const handleError = (error: unknown) => {
    const detail = (error as AxiosError<ProblemDetails>).response?.data?.detail
    notifications.show({ title: 'Error', message: detail || 'Could not save address.', color: 'red' })
  }

  const { mutate: createAddress, isPending: creating } = useCreateAddress({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        notifications.show({ title: 'Address added', message: 'Your address has been saved.', color: 'green' })
        onClose()
      },
      onError: handleError,
    },
  })

  const { mutate: updateAddress, isPending: updating } = useUpdateAddress({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        notifications.show({ title: 'Address updated', message: 'Your changes have been saved.', color: 'green' })
        onClose()
      },
      onError: handleError,
    },
  })

  const handleSubmit = (values: AddressFormValues) => {
    if (isEdit && address) {
      updateAddress({ id: address.id, data: values })
    } else {
      createAddress({ data: values })
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title={isEdit ? 'Edit Address' : 'Add Address'} centered>
      <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
        <TextInput label="Label" placeholder="Home, Work, ..." withAsterisk {...form.getInputProps('label')} />
        <TextInput label="Recipient Name" withAsterisk {...form.getInputProps('recipientName')} />
        <TextInput label="Phone" withAsterisk {...form.getInputProps('phone')} />
        <AddressAutocomplete
          label="Address"
          value={form.values.formattedAddress}
          onChange={(v) => form.setFieldValue('formattedAddress', v)}
          onSelectSuggestion={(s) => {
            form.setFieldValue('formattedAddress', s.description)
            form.setFieldValue('commune', s.commune)
            form.setFieldValue('province', s.province)
            form.setFieldValue('placeId', s.placeId)
          }}
        />
        {form.errors.formattedAddress && <p className="text-xs text-red-500 -mt-2">{form.errors.formattedAddress}</p>}
        <Checkbox label="Set as default address" {...form.getInputProps('isDefault', { type: 'checkbox' })} />
        <div className="flex justify-end gap-2">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="primary" loading={creating || updating}>
            Save
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddressFormModal
