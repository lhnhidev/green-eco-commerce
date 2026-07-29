import { getGetAllCouponsQueryKey, useCreateCoupon, useDeleteCoupon, useGetAllCoupons, useUpdateCoupon } from '@api'
import { CouponDiscountTypeEnum, type CouponDto } from '@api/schemas'
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Switch,
  Table,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { NotePencilIcon, PlusIcon, TagIcon, TrashIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'

type CouponForm = {
  code: string
  discountType: CouponDiscountTypeEnum
  discountValue: number
  minOrderAmount: number
  maxUses: number
  expiresAt: Date | null
  isActive: boolean
}

const defaultForm: CouponForm = {
  code: '',
  discountType: CouponDiscountTypeEnum.Percent,
  discountValue: 10,
  minOrderAmount: 0,
  maxUses: 100,
  expiresAt: null,
  isActive: true,
}

const CouponList = () => {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const [editTarget, setEditTarget] = useState<CouponDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CouponDto | null>(null)

  const queryClient = useQueryClient()
  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetAllCouponsQueryKey() })

  const { data: coupons = [], isLoading } = useGetAllCoupons()

  const form = useForm<CouponForm>({
    initialValues: defaultForm,
    validate: {
      code: (v) => (!v.trim() ? 'Code is required' : null),
      discountValue: (v) => (v <= 0 ? 'Must be > 0' : null),
      maxUses: (v) => (v <= 0 ? 'Must be > 0' : null),
      expiresAt: (v) => (!v ? 'Expiry date required' : null),
    },
  })

  const { mutate: createCoupon, isPending: creating } = useCreateCoupon({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeModal()
        form.reset()
        notifications.show({ title: 'Created', message: 'Coupon created.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to create coupon.', color: 'red' }),
    },
  })

  const { mutate: updateCoupon, isPending: updating } = useUpdateCoupon({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeModal()
        form.reset()
        setEditTarget(null)
        notifications.show({ title: 'Updated', message: 'Coupon updated.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to update coupon.', color: 'red' }),
    },
  })

  const { mutate: deleteCoupon, isPending: deleting } = useDeleteCoupon({
    mutation: {
      onSuccess: async () => {
        await invalidate()
        closeDelete()
        setDeleteTarget(null)
        notifications.show({ title: 'Deleted', message: 'Coupon removed.', color: 'red' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Failed to delete.', color: 'red' }),
    },
  })

  const openCreate = () => {
    setEditTarget(null)
    form.setValues(defaultForm)
    openModal()
  }

  const openEdit = (c: CouponDto) => {
    setEditTarget(c)
    form.setValues({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount,
      maxUses: c.maxUses,
      expiresAt: new Date(c.expiresAt),
      isActive: c.isActive,
    })
    openModal()
  }

  const handleSubmit = (values: CouponForm) => {
    const expiresAt = values.expiresAt!.toISOString()
    if (editTarget) {
      updateCoupon({
        id: editTarget.id,
        data: { ...values, expiresAt } as never,
      })
    } else {
      createCoupon({ data: { ...values, expiresAt } as never })
    }
  }

  return (
    <div className="w-full h-full">
      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={
          <div className="flex items-center gap-2">
            <TagIcon size={16} className="text-primary" />
            <span>{editTarget ? 'Edit Coupon' : 'New Coupon'}</span>
          </div>
        }
        size="md"
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Code"
            placeholder="SUMMER20"
            description="Will be auto-uppercased"
            withAsterisk
            {...form.getInputProps('code')}
          />
          <Select
            label="Discount Type"
            data={[
              { value: CouponDiscountTypeEnum.Percent, label: 'Percentage (%)' },
              { value: CouponDiscountTypeEnum.Fixed, label: 'Fixed Amount ($)' },
            ]}
            withAsterisk
            {...form.getInputProps('discountType')}
          />
          <NumberInput
            label={form.values.discountType === CouponDiscountTypeEnum.Percent ? 'Discount (%)' : 'Discount ($)'}
            min={0.01}
            max={form.values.discountType === CouponDiscountTypeEnum.Percent ? 100 : undefined}
            decimalScale={2}
            withAsterisk
            {...form.getInputProps('discountValue')}
          />
          <NumberInput
            label="Minimum Order Amount ($)"
            min={0}
            decimalScale={2}
            {...form.getInputProps('minOrderAmount')}
          />
          <NumberInput label="Max Uses" min={1} withAsterisk {...form.getInputProps('maxUses')} />
          <DateTimePicker
            label="Expires At"
            placeholder="Pick date and time"
            withAsterisk
            minDate={new Date()}
            {...form.getInputProps('expiresAt')}
          />
          {editTarget && <Switch label="Active" {...form.getInputProps('isActive', { type: 'checkbox' })} />}
          <Group justify="flex-end" mt="sm">
            <Button variant="subtle" color="gray" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" color="primary" loading={creating || updating}>
              {editTarget ? 'Save Changes' : 'Create Coupon'}
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal opened={deleteOpened} onClose={closeDelete} title="Delete Coupon?" centered size="sm">
        <Text size="sm" c="dimmed" mb="md">
          Delete coupon <strong>{deleteTarget?.code}</strong>? This cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="subtle" color="gray" onClick={closeDelete}>
            Cancel
          </Button>
          <Button color="red" loading={deleting} onClick={() => deleteTarget && deleteCoupon({ id: deleteTarget.id })}>
            Delete
          </Button>
        </Group>
      </Modal>

      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] text-muted-foreground">{coupons.length} coupons total</span>
        <Button size="xs" leftSection={<PlusIcon size={13} />} color="primary" onClick={openCreate}>
          New Coupon
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            verticalSpacing={6}
            horizontalSpacing={8}
            highlightOnHover
            classNames={{
              th: '!text-[11px] !font-semibold !uppercase !tracking-[0.04em] !text-muted-foreground !bg-[#fafafa]',
              td: '!text-[12px]',
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={110}>Code</Table.Th>
                <Table.Th w={100}>Type</Table.Th>
                <Table.Th w={90}>Value</Table.Th>
                <Table.Th w={90}>Min Order</Table.Th>
                <Table.Th w={80}>Usage</Table.Th>
                <Table.Th w={130}>Expires</Table.Th>
                <Table.Th w={80}>Status</Table.Th>
                <Table.Th w={70} ta="right">
                  Actions
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <div className="text-center py-8 text-[12px] text-[#a1a1aa]">Loading coupons…</div>
                  </Table.Td>
                </Table.Tr>
              ) : coupons.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <div className="text-center py-8 text-[12px] text-[#a1a1aa]">No coupons yet.</div>
                  </Table.Td>
                </Table.Tr>
              ) : (
                coupons.map((c) => (
                  <Table.Tr key={c.id}>
                    <Table.Td>
                      <span className="font-mono font-bold text-primary">{c.code}</span>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        size="xs"
                        variant="outline"
                        color={c.discountType === CouponDiscountTypeEnum.Percent ? 'violet' : 'blue'}
                        radius="sm"
                      >
                        {c.discountType === CouponDiscountTypeEnum.Percent ? 'Percent' : 'Fixed'}
                      </Badge>
                    </Table.Td>
                    <Table.Td className="font-semibold!">
                      {c.discountType === CouponDiscountTypeEnum.Percent
                        ? `${c.discountValue}%`
                        : `$${c.discountValue}`}
                    </Table.Td>
                    <Table.Td className="text-muted-foreground!">${c.minOrderAmount}</Table.Td>
                    <Table.Td className="text-muted-foreground!">
                      {c.usedCount}/{c.maxUses}
                    </Table.Td>
                    <Table.Td className={`text-muted-foreground! ${c.expiresAt >= new Date() ? 'text-red-400!' : ''}`}>
                      {dayjs(c.expiresAt).format('DD/MM/YY HH:mm')}
                    </Table.Td>
                    <Table.Td>
                      {c.expiresAt >= new Date() ? (
                        <Badge size="xs" color="red" variant="light">
                          Expired
                        </Badge>
                      ) : c.isActive ? (
                        <Badge size="xs" color="green" variant="light">
                          Active
                        </Badge>
                      ) : (
                        <Badge size="xs" color="gray" variant="light">
                          Disabled
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip label="Edit" withArrow>
                          <ActionIcon variant="subtle" color="gray" size="sm" onClick={() => openEdit(c)}>
                            <NotePencilIcon size={13} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Delete" withArrow>
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={() => {
                              setDeleteTarget(c)
                              openDelete()
                            }}
                          >
                            <TrashIcon size={13} />
                          </ActionIcon>
                        </Tooltip>
                      </div>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default CouponList
