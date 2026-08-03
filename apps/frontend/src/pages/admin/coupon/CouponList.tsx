import { invalidateGetAllCoupons, useCreateCoupon, useDeleteCoupon, useGetAllCoupons, useUpdateCoupon } from '@api'
import { CouponDiscountTypeEnum, type CouponDto } from '@api/schemas'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import ConfirmModal from '@components/ui/primitives/ConfirmModal'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import FormGrid from '@components/ui/primitives/FormGrid'
import RowActions from '@components/ui/primitives/RowActions'
import Toolbar from '@components/ui/primitives/Toolbar'
import { Badge, Button, Modal, NumberInput, Select, Switch, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { PlusIcon, SealPercentIcon, TagIcon } from '@phosphor-icons/react'
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

const isExpired = (expiresAt: string | Date) => new Date(expiresAt).getTime() < Date.now()

const CouponList = () => {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const [editTarget, setEditTarget] = useState<CouponDto | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CouponDto | null>(null)

  const queryClient = useQueryClient()
  const invalidate = () => invalidateGetAllCoupons(queryClient)

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

  const columns: DataTableColumn<CouponDto>[] = [
    {
      key: 'code',
      header: 'Code',
      width: 110,
      render: (c) => <span className="font-mono font-semibold text-primary">{c.code}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      width: 100,
      render: (c) => (
        <Badge
          size="xs"
          variant="outline"
          color={c.discountType === CouponDiscountTypeEnum.Percent ? 'violet' : 'blue'}
        >
          {c.discountType === CouponDiscountTypeEnum.Percent ? 'Percent' : 'Fixed'}
        </Badge>
      ),
    },
    {
      key: 'value',
      header: 'Value',
      width: 90,
      render: (c) => (
        <span className="font-semibold">
          {c.discountType === CouponDiscountTypeEnum.Percent ? `${c.discountValue}%` : `$${c.discountValue}`}
        </span>
      ),
    },
    {
      key: 'minOrder',
      header: 'Min Order',
      width: 90,
      render: (c) => <span className="text-muted-foreground">${c.minOrderAmount}</span>,
    },
    {
      key: 'usage',
      header: 'Usage',
      width: 80,
      render: (c) => (
        <span className="text-muted-foreground">
          {c.usedCount}/{c.maxUses}
        </span>
      ),
    },
    {
      key: 'expires',
      header: 'Expires',
      width: 130,
      render: (c) => (
        <span className={isExpired(c.expiresAt) ? 'text-red-400' : 'text-muted-foreground'}>
          {dayjs(c.expiresAt).format('DD/MM/YY HH:mm')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: 80,
      render: (c) =>
        isExpired(c.expiresAt) ? (
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
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: 70,
      align: 'right',
      render: (c) => (
        <RowActions
          onEdit={() => openEdit(c)}
          onDelete={() => {
            setDeleteTarget(c)
            openDelete()
          }}
        />
      ),
    },
  ]

  return (
    <AdminPageShell
      title="Coupons"
      actions={
        <Button size="xs" leftSection={<PlusIcon size={13} />} onClick={openCreate}>
          New Coupon
        </Button>
      }
    >
      <DataTable
        columns={columns}
        rows={coupons}
        getRowKey={(c) => c.id}
        isLoading={isLoading}
        emptyIcon={SealPercentIcon}
        emptyTitle="No coupons yet"
        toolbar={<Toolbar right={<span className="text-2xs text-muted-foreground">{coupons.length} coupons total</span>} />}
      />

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
      >
        <form onSubmit={form.onSubmit(handleSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Code"
            placeholder="SUMMER20"
            description="Will be auto-uppercased"
            withAsterisk
            {...form.getInputProps('code')}
          />
          <FormGrid>
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
          </FormGrid>
          <FormGrid>
            <NumberInput
              label="Minimum Order Amount ($)"
              min={0}
              decimalScale={2}
              {...form.getInputProps('minOrderAmount')}
            />
            <NumberInput label="Max Uses" min={1} withAsterisk {...form.getInputProps('maxUses')} />
          </FormGrid>
          <DateTimePicker
            label="Expires At"
            placeholder="Pick date and time"
            withAsterisk
            minDate={new Date()}
            {...form.getInputProps('expiresAt')}
          />
          {editTarget && <Switch label="Active" {...form.getInputProps('isActive', { type: 'checkbox' })} />}
          <div className="flex justify-end gap-2 mt-1">
            <Button variant="subtle" color="gray" size="xs" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" size="xs" loading={creating || updating}>
              {editTarget ? 'Save Changes' : 'Create Coupon'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        opened={deleteOpened}
        onClose={closeDelete}
        onConfirm={() => deleteTarget && deleteCoupon({ id: deleteTarget.id })}
        title="Delete Coupon?"
        message={
          <>
            Delete coupon <strong>{deleteTarget?.code}</strong>? This cannot be undone.
          </>
        }
        confirmLabel="Delete"
        loading={deleting}
      />
    </AdminPageShell>
  )
}

export default CouponList
