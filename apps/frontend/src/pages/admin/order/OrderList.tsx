import {
  invalidateGetAllOrders,
  useGetAllOrders,
  useGetOrderByIdAdmin,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from '@api'
import { OrderSortBy, OrderStatusEnum, PaymentStatusEnum } from '@api/schemas'
import InvoicePrint from '@components/features/order/InvoicePrint'
import ImageWithFallback from '@components/ui/ImageWithFallback'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import RowActions from '@components/ui/primitives/RowActions'
import Toolbar from '@components/ui/primitives/Toolbar'
import { ActionIcon, Badge, Button, Divider, Modal, Select, Stack, Text, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  ArrowCounterClockwiseIcon,
  CheckCircleIcon,
  ClockIcon,
  DownloadSimpleIcon as DownloadIcon,
  EyeIcon,
  LeafIcon,
  MagnifyingGlassIcon,
  PackageIcon,
  PhoneIcon,
  PrinterIcon,
  ReceiptIcon,
  ShoppingCartIcon,
  TruckIcon,
  UserIcon,
  XCircleIcon,
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { downloadFile } from '@utils/downloadFile'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import dayjs from 'dayjs'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { OrderDto } from '@/api/schemas'

const SectionLabel = ({ children, icon: Icon }: { children: ReactNode; icon?: typeof UserIcon }) => (
  <div className="flex items-center gap-1.5 text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
    {Icon && <Icon size={12} />}
    {children}
  </div>
)

const statusColor: Record<string, string> = {
  Pending: 'gray',
  Packing: 'blue',
  Delivering: 'yellow',
  Delivered: 'primary',
  Cancelled: 'red',
}

const statusIcon: Record<string, typeof ClockIcon> = {
  Pending: ClockIcon,
  Packing: PackageIcon,
  Delivering: TruckIcon,
  Delivered: CheckCircleIcon,
  Cancelled: XCircleIcon,
}

const paymentStatusColor: Record<string, string> = {
  Pending: 'gray',
  Paid: 'green',
  Refunded: 'orange',
  Failed: 'red',
}

const paymentStatusIcon: Record<string, typeof ClockIcon> = {
  Pending: ClockIcon,
  Paid: CheckCircleIcon,
  Refunded: ArrowCounterClockwiseIcon,
  Failed: XCircleIcon,
}

const STATUS_OPTIONS = Object.values(OrderStatusEnum).map((s) => ({ value: s, label: s }))
const PAYMENT_STATUS_OPTIONS = Object.values(PaymentStatusEnum).map((s) => ({ value: s, label: s }))
const PAGE_SIZE = 20

const OrderList = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatusEnum | null>(null)
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const { data: detailOrder, isLoading: loadingDetail } = useGetOrderByIdAdmin(selectedOrderId ?? '', {
    query: { enabled: !!selectedOrderId },
  })

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      await downloadFile('/api/orders/export', `orders_${new Date().toISOString().slice(0, 10)}.csv`)
    } catch {
      notifications.show({ title: 'Export failed', message: 'Could not download CSV.', color: 'red' })
    } finally {
      setExporting(false)
    }
  }

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      await downloadFile('/api/orders/export.xlsx', `orders_${new Date().toISOString().slice(0, 10)}.xlsx`)
    } catch {
      notifications.show({ title: 'Export failed', message: 'Could not download Excel file.', color: 'red' })
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadInvoicePdf = async () => {
    if (!selectedOrderId) return
    setDownloadingInvoice(true)
    try {
      await downloadFile(`/api/orders/${selectedOrderId}/invoice.pdf`, `invoice_${selectedOrderId.slice(-8)}.pdf`)
    } catch {
      notifications.show({ title: 'Download failed', message: 'Could not download invoice PDF.', color: 'red' })
    } finally {
      setDownloadingInvoice(false)
    }
  }

  const queryClient = useQueryClient()
  const [debouncedSearch] = useDebouncedValue(search, 300)

  const { data, isLoading } = useGetAllOrders({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: statusFilter ?? undefined,
    sortBy: OrderSortBy.CreatedAt,
    sortDescending: true,
  })

  const { mutate: changeStatus, variables: pendingChange } = useUpdateOrderStatus({
    mutation: {
      onSuccess: async () => {
        await invalidateGetAllOrders(queryClient)
        notifications.show({ title: 'Updated', message: 'Order status changed.', color: 'green' })
      },
      onError: () => {
        notifications.show({ title: 'Error', message: 'Could not update status.', color: 'red' })
      },
    },
  })

  const { mutate: changePaymentStatus, variables: pendingPaymentChange } = useUpdatePaymentStatus({
    mutation: {
      onSuccess: async () => {
        await invalidateGetAllOrders(queryClient)
        notifications.show({ title: 'Updated', message: 'Payment status changed.', color: 'green' })
      },
      onError: () => {
        notifications.show({ title: 'Error', message: 'Could not update payment status.', color: 'red' })
      },
    },
  })

  const orders = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  const columns: DataTableColumn<OrderDto>[] = [
    {
      key: 'id',
      header: 'Order ID',
      width: 110,
      render: (o) => <span className="font-medium">#{o.id?.slice(-8)}</span>,
    },
    {
      key: 'address',
      header: 'Delivery address',
      render: (o) => <span className="text-muted-foreground">{o.deliveryAddress || '—'}</span>,
    },
    {
      key: 'created',
      header: 'Created',
      width: 110,
      render: (o) => (
        <span className="text-muted-foreground">{o.createdAt ? dayjs(o.createdAt).format('DD/MM/YYYY') : '—'}</span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      width: 80,
      align: 'right',
      render: (o) => <span className="font-semibold">{formatCurrency(o.finalAmount)}</span>,
    },
    { key: 'points', header: 'Points', width: 90, align: 'center', render: (o) => o.earnedPoints },
    {
      key: 'discount',
      header: 'Discount',
      width: 90,
      align: 'center',
      render: (o) => <span className="text-muted-foreground">{formatCurrency(o.discountAmount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 170,
      render: (o) => {
        const isUpdating = pendingChange?.id === o.id
        const Icon = statusIcon[o.status] ?? ClockIcon
        const color = statusColor[o.status] ?? 'gray'
        return (
          <div className="flex flex-col gap-0.5">
            <Select
              size="xs"
              data={STATUS_OPTIONS}
              value={o.status}
              disabled={isUpdating}
              onChange={(val) => {
                if (val && val !== o.status) {
                  changeStatus({ id: o.id, data: { status: val as OrderStatusEnum } })
                }
              }}
              leftSection={<Icon size={14} weight="bold" style={{ color: `var(--mantine-color-${color}-6)` }} />}
              styles={{ input: { fontWeight: 600 } }}
              w={160}
              comboboxProps={{ withinPortal: true }}
            />
            {/* Invisible spacer matching the Payment column's method sub-label, so both Select boxes align to the same row height. */}
            <span className="text-2xs invisible pl-1" aria-hidden="true">
              &nbsp;
            </span>
          </div>
        )
      },
    },
    {
      key: 'payment',
      header: 'Payment',
      width: 170,
      render: (o) => {
        const isUpdatingPayment = pendingPaymentChange?.data.orderId === o.id
        const Icon = paymentStatusIcon[o.paymentStatus] ?? ClockIcon
        const color = paymentStatusColor[o.paymentStatus] ?? 'gray'
        return (
          <div className="flex flex-col gap-0.5">
            <Select
              size="xs"
              data={PAYMENT_STATUS_OPTIONS}
              value={o.paymentStatus}
              disabled={isUpdatingPayment}
              onChange={(val) => {
                if (val && val !== o.paymentStatus) {
                  changePaymentStatus({ data: { orderId: o.id, status: val as PaymentStatusEnum } })
                }
              }}
              leftSection={<Icon size={14} weight="bold" style={{ color: `var(--mantine-color-${color}-6)` }} />}
              styles={{ input: { fontWeight: 600 } }}
              w={160}
              comboboxProps={{ withinPortal: true }}
            />
            <span className="text-2xs text-muted-foreground pl-1">{o.paymentMethod}</span>
          </div>
        )
      },
    },
    {
      key: 'actions',
      header: 'View',
      width: 50,
      align: 'right',
      render: (o) => (
        <div className="h-full flex items-start justify-end pr-2">
          <RowActions
            extra={
              <ActionIcon variant="subtle" size="sm" aria-label="View" onClick={() => setSelectedOrderId(o.id)}>
                <EyeIcon size={13} />
              </ActionIcon>
            }
          />
        </div>
      ),
    },
  ]

  return (
    <AdminPageShell title="Orders">
      {/* Order Detail Modal */}
      <Modal
        opened={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        title={`Order #${selectedOrderId?.slice(-8).toUpperCase()}`}
        size="lg"
      >
        {loadingDetail ? (
          <Text size="sm" c="dimmed">
            Loading...
          </Text>
        ) : detailOrder ? (
          <>
            <Stack gap="sm">
              <SectionLabel icon={UserIcon}>Customer</SectionLabel>
              <div>
                <Text size="sm" fw={600}>
                  {detailOrder.customerName}
                </Text>
                <Text size="xs" c="dimmed" className="flex items-center gap-1">
                  <PhoneIcon size={12} /> {detailOrder.customerPhone}
                </Text>
              </div>

              <Divider />
              <SectionLabel>Order Info</SectionLabel>
              <div className="flex items-center justify-between">
                <Text size="xs" c="dimmed">
                  Placed: {dayjs(detailOrder.createdAt).format('DD/MM/YYYY HH:mm')}
                </Text>
                <Badge size="xs" variant="light" color={statusColor[detailOrder.status] ?? 'gray'}>
                  {detailOrder.status}
                </Badge>
              </div>
              <Text size="xs" c="dimmed">
                Delivery Address: {detailOrder.deliveryAddress}
              </Text>

              <Divider />
              <SectionLabel icon={ShoppingCartIcon}>Products ({detailOrder.items.length} items)</SectionLabel>
              {detailOrder.items.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <ImageWithFallback
                    src={resolveImageUrl(item.productImage)}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded-sm shrink-0"
                  />
                  <div className="flex-1">
                    <Text size="sm" fw={600}>
                      {item.productName}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatCurrency(item.unitPrice)} × {item.quantity}
                    </Text>
                    <Text size="xs" c="teal.6">
                      <LeafIcon className="inline" /> CO₂ Saved: {(item.unitCo2Saved * item.quantity).toFixed(2)} kg
                    </Text>
                  </div>
                  <Text size="sm" fw={700}>
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </Text>
                </div>
              ))}

              <Divider />
              <SectionLabel>Payment & Totals</SectionLabel>
              <div className="flex items-center gap-2">
                <Text size="xs" c="dimmed">
                  Payment:
                </Text>
                <Badge size="xs" variant="light" color={paymentStatusColor[detailOrder.paymentStatus] ?? 'gray'}>
                  {detailOrder.paymentStatus}
                </Badge>
                <Text size="xs" c="dimmed">
                  via {detailOrder.paymentMethod}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text size="sm" c="dimmed">
                  Subtotal:
                </Text>
                <Text size="sm">{formatCurrency(detailOrder.totalAmount)}</Text>
              </div>
              <div className="flex justify-between">
                <Text size="sm" c="dimmed">
                  Discount:
                </Text>
                <Text size="sm">-{formatCurrency(detailOrder.discountAmount)}</Text>
              </div>
              <div className="flex justify-between">
                <Text fw={700}>Total:</Text>
                <Text fw={700} c="primary">
                  {formatCurrency(detailOrder.finalAmount)}
                </Text>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  leftSection={<DownloadIcon size={14} />}
                  color="gray"
                  variant="light"
                  size="xs"
                  loading={downloadingInvoice}
                  onClick={handleDownloadInvoicePdf}
                >
                  Download PDF
                </Button>
                <Button
                  leftSection={<PrinterIcon size={14} />}
                  color="gray"
                  variant="light"
                  size="xs"
                  onClick={() => window.print()}
                >
                  Print Invoice
                </Button>
              </div>
            </Stack>
            <InvoicePrint order={detailOrder} />
          </>
        ) : (
          <Text size="sm" c="dimmed">
            Order not found.
          </Text>
        )}
      </Modal>

      <DataTable
        columns={columns}
        rows={orders}
        getRowKey={(o) => o.id}
        isLoading={isLoading}
        emptyIcon={ReceiptIcon}
        emptyTitle="No orders found"
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        toolbar={
          <Toolbar
            left={
              <>
                <TextInput
                  placeholder="Search order ID or address..."
                  size="xs"
                  leftSection={<MagnifyingGlassIcon size={13} />}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.currentTarget.value)
                    setPage(1)
                  }}
                  w={240}
                />
                <Select
                  placeholder="All statuses"
                  size="xs"
                  data={Object.values(OrderStatusEnum)}
                  value={statusFilter}
                  onChange={(val) => {
                    setStatusFilter(val as OrderStatusEnum | null)
                    setPage(1)
                  }}
                  clearable
                  w={140}
                />
                <span className="text-2xs text-muted-foreground">{totalCount} orders total</span>
              </>
            }
            right={
              <>
                <Button
                  size="xs"
                  variant="light"
                  color="gray"
                  leftSection={<DownloadIcon size={13} />}
                  loading={exporting}
                  onClick={handleExportCsv}
                >
                  Export CSV
                </Button>
                <Button
                  size="xs"
                  variant="light"
                  color="gray"
                  leftSection={<DownloadIcon size={13} />}
                  loading={exporting}
                  onClick={handleExportExcel}
                >
                  Export Excel
                </Button>
              </>
            }
          />
        }
      />
    </AdminPageShell>
  )
}

export default OrderList
