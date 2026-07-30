import { getGetMyAddressesQueryKey, useDeleteAddress, useGetMyAddresses, useSetDefaultAddress } from '@api'
import type { AddressDto } from '@api/schemas'
import EmptyState from '@components/ui/primitives/EmptyState'
import Panel from '@components/ui/primitives/Panel'
import { ActionIcon, Badge, Button, Menu, Skeleton } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { DotsThreeIcon, MapPinIcon, PlusIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import AddressFormModal from './AddressFormModal'

const AddressManager = () => {
  const queryClient = useQueryClient()
  const { data: addresses, isLoading } = useGetMyAddresses()
  const [formOpened, setFormOpened] = useState(false)
  const [editingAddress, setEditingAddress] = useState<AddressDto | null>(null)

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetMyAddressesQueryKey() })

  const { mutate: deleteAddress } = useDeleteAddress({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        notifications.show({ title: 'Address removed', message: 'The address has been deleted.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not delete address.', color: 'red' }),
    },
  })

  const { mutate: setDefault } = useSetDefaultAddress({
    mutation: {
      onSuccess: invalidate,
      onError: () => notifications.show({ title: 'Error', message: 'Could not set default address.', color: 'red' }),
    },
  })

  const openCreate = () => {
    setEditingAddress(null)
    setFormOpened(true)
  }

  const openEdit = (address: AddressDto) => {
    setEditingAddress(address)
    setFormOpened(true)
  }

  const handleDelete = (address: AddressDto) => {
    modals.openConfirmModal({
      title: 'Delete address',
      children: <p className="text-sm text-gray-600">Delete "{address.label}"? This can't be undone.</p>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteAddress({ id: address.id }),
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton height={80} radius="lg" />
        <Skeleton height={80} radius="lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-gray-500">Saved Addresses</p>
        <Button size="xs" leftSection={<PlusIcon size={13} />} onClick={openCreate}>
          Add Address
        </Button>
      </div>

      {!addresses?.length ? (
        <EmptyState
          icon={MapPinIcon}
          color="gray"
          title="No saved addresses"
          description="Add an address to speed up checkout."
          action={
            <Button size="sm" onClick={openCreate} mt="md">
              Add Address
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <Panel key={address.id} padding="md">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-800">{address.label}</span>
                    {address.isDefault && (
                      <Badge size="xs" color="primary" variant="light">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {address.recipientName} · {address.phone}
                  </p>
                  <p className="text-sm text-gray-400 mt-0.5">{address.formattedAddress}</p>
                </div>

                <Menu position="bottom-end" shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" color="gray" aria-label="Address options">
                      <DotsThreeIcon size={18} weight="bold" />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    {!address.isDefault && (
                      <Menu.Item onClick={() => setDefault({ id: address.id })}>Set as default</Menu.Item>
                    )}
                    <Menu.Item onClick={() => openEdit(address)}>Edit</Menu.Item>
                    <Menu.Item color="red" onClick={() => handleDelete(address)}>
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <AddressFormModal opened={formOpened} onClose={() => setFormOpened(false)} address={editingAddress} />
    </div>
  )
}

export default AddressManager
