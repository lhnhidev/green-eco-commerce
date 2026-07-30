import {
  getGetAllOrdersQueryKey,
  useGetAllOrders,
  useGetOrderByIdAdmin,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from '@api'
import { OrderSortBy, OrderStatusEnum, PaymentStatusEnum } from '@api/schemas'
import InvoicePrint from '@components/features/order/InvoicePrint'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import DataTable, { type DataTableColumn } from '@components/ui/primitives/DataTable'
import RowActions from '@components/ui/primitives/RowActions'
import Toolbar from '@components/ui/primitives/Toolbar'
import { ActionIcon, Badge, Button, Image, Modal, Select, Stack, Text, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  DownloadSimpleIcon as DownloadIcon,
  EyeIcon,
  LeafIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  ReceiptIcon,
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { downloadFile } from '@utils/downloadFile'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import dayjs from 'dayjs'
import { useState } from 'react'
import type { OrderDto } from '@/api/schemas'

const statusColor: Record<string, string> = {
  Pending: 'gray',
  Packing: 'blue',
  Delivering: 'yellow',
  Delivered: 'primary',
  Cancelled: 'red',
}

const paymentStatusColor: Record<string, string> = {
  Pending: 'gray',
  Paid: 'green',
  Refunded: 'orange',
  Failed: 'red',
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
      await downloadFile(`/api/orders/${selectedOrderId}/invoice.pdf`, `invoice_${selectedOrderId.substring(0, 8)}.pdf`)
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
        await queryClient.invalidateQueries({ queryKey: getGetAllOrdersQueryKey() })
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
        await queryClient.invalidateQueries({ queryKey: getGetAllOrdersQueryKey() })
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
      render: (o) => <span className="font-medium">#{o.id?.substring(0, 8)}</span>,
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
    { key: 'points', header: 'Points', width: 90, align: 'right', render: (o) => o.earnedPoints },
    {
      key: 'discount',
      header: 'Discount',
      width: 90,
      align: 'right',
      render: (o) => <span className="text-muted-foreground">{formatCurrency(o.discountAmount)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      width: 170,
      render: (o) => {
        const isUpdating = pendingChange?.id === o.id
        return (
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
            leftSection={<Badge size="xs" variant="dot" color={statusColor[o.status] ?? 'gray'} p={0} />}
            w={160}
            comboboxProps={{ withinPortal: true }}
          />
        )
      },
    },
    {
      key: 'payment',
      header: 'Payment',
      width: 170,
      render: (o) => {
        const isUpdatingPayment = pendingPaymentChange?.data.orderId === o.id
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
              leftSection={
                <Badge size="xs" variant="dot" color={paymentStatusColor[o.paymentStatus] ?? 'gray'} p={0} />
              }
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
        <RowActions
          extra={
            <ActionIcon variant="subtle" size="sm" aria-label="View" onClick={() => setSelectedOrderId(o.id)}>
              <EyeIcon size={13} />
            </ActionIcon>
          }
        />
      ),
    },
  ]

  return (
    <AdminPageShell title="Orders">
      {/* Order Detail Modal */}
      <Modal
        opened={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        title={`Order #${selectedOrderId?.substring(0, 8).toUpperCase()}`}
        size="lg"
      >
        {loadingDetail ? (
          <Text size="sm" c="dimmed">
            Loading...
          </Text>
        ) : detailOrder ? (
          <>
            <Stack gap="sm">
              {detailOrder.items.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <Image
                    src={resolveImageUrl(item.productImage) || 'https://placehold.co/48x48?text=Eco'}
                    w={48}
                    h={48}
                    fit="cover"
                    radius="sm"
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
              <hr className="border-border" />
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
              <Text size="xs" c="dimmed">
                Delivery: {detailOrder.deliveryAddress}
              </Text>
              <Text size="xs" c="dimmed">
                Placed: {dayjs(detailOrder.createdAt).format('DD/MM/YYYY HH:mm')}
              </Text>
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
      />
    </AdminPageShell>
  )
}

export default OrderList
