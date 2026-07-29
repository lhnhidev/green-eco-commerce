import { getGetAllOrdersQueryKey, useGetAllOrders, useGetMyOrderById, useUpdateOrderStatus } from '@api'
import { OrderSortBy, OrderStatusEnum } from '@api/schemas'
import {
  ActionIcon,
  Badge,
  Button,
  Image,
  Modal,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import {
  DownloadSimpleIcon as DownloadIcon,
  EyeIcon,
  LeafIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
} from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { downloadFile } from '@utils/downloadFile'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import dayjs from 'dayjs'
import { useState } from 'react'

const statusColor: Record<string, string> = {
  Pending: 'gray',
  Packing: 'blue',
  Delivering: 'yellow',
  Delivered: 'primary',
  Cancelled: 'red',
}

const STATUS_OPTIONS = Object.values(OrderStatusEnum).map((s) => ({ value: s, label: s }))
const PAGE_SIZE = 20

const OrderList = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const { data: detailOrder, isLoading: loadingDetail } = useGetMyOrderById(selectedOrderId ?? '', {
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

  const handlePrint = () => {
    if (!detailOrder) return
    const newWin = window.open('', '_blank')
    if (newWin) {
      newWin.document.body.innerHTML = `
        <html lang="en">
          <head>
            <title>Invoice - Order #${detailOrder.id.substring(0, 8)}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #eee; padding: 12px; text-align: left; }
              th { background-color: #f9fafb; font-weight: 600; }
              .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px;}
              .total-row { text-align: right; margin-top: 20px; font-size: 16px; }
              .final-total { text-align: right; font-size: 20px; font-weight: bold; color: #16a34a; margin-top: 10px; }
            </style>
          </head>
          <body onload="window.print();window.close()">
            <div class="header">
              <div>
                <h1 style="color: #16a34a; margin: 0;">Green Eco Commerce</h1>
                <p style="margin-top: 5px; color: #666;">Invoice & Shipping Label</p>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0;"><strong>Order ID:</strong> #${detailOrder.id.substring(0, 8).toUpperCase()}</p>
                <p style="margin: 5px 0 0 0;"><strong>Date:</strong> ${dayjs(detailOrder.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                <p style="margin: 5px 0 0 0;"><strong>Status:</strong> ${detailOrder.status}</p>
              </div>
            </div>
            
            <div style="margin-bottom: 30px;">
              <h3 style="margin-bottom: 10px;">Delivery Details:</h3>
              <p style="margin: 0; font-size: 16px;"><strong>${detailOrder.deliveryAddress}</strong></p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${detailOrder.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.productName}</td>
                    <td>${formatCurrency(item.unitPrice)}</td>
                    <td>${item.quantity}</td>
                    <td style="text-align: right;">${formatCurrency(item.unitPrice * item.quantity)}</td>
                  </tr>
                `,
                  )
                  .join('')}
              </tbody>
            </table>
            <div class="total-row">
              <p>Subtotal: ${formatCurrency(detailOrder.totalAmount)}</p>
              <p>Discount: -${formatCurrency(detailOrder.discountAmount)}</p>
            </div>
            <div class="final-total">
              <p>Total: ${formatCurrency(detailOrder.finalAmount)}</p>
            </div>
          </body>
        </html>
      `
      newWin.document.close()
    }
  }

  const queryClient = useQueryClient()
  const [debouncedSearch] = useDebouncedValue(search, 300)
  const { data, isLoading } = useGetAllOrders({
    pageNumber: page,
    pageSize: PAGE_SIZE,
    search: debouncedSearch || undefined,
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

  const allOrders = data?.items ?? []
  const totalCount = data?.totalCount ?? 0
  const totalPages = data?.totalPages ?? 1

  // Search is server-side (see useGetAllOrders above); status is still filtered
  // client-side within the current page.
  const filteredOrders = statusFilter ? allOrders.filter((o) => o.status === statusFilter) : allOrders

  return (
    <div className="w-full h-full">
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
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <Text size="sm" c="dimmed">
                Discount:
              </Text>
              <Text size="sm">-{formatCurrency(detailOrder.discountAmount)}</Text>
            </div>
            <div className="flex justify-between">
              <Text fw={700}>Total:</Text>
              <Text fw={700} c="green.7">
                {formatCurrency(detailOrder.finalAmount)}
              </Text>
            </div>
            <Text size="xs" c="dimmed">
              Delivery: {detailOrder.deliveryAddress}
            </Text>
            <Text size="xs" c="dimmed">
              Placed: {dayjs(detailOrder.createdAt).format('DD/MM/YYYY HH:mm')}
            </Text>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                leftSection={<DownloadIcon />}
                color="gray"
                variant="light"
                loading={downloadingInvoice}
                onClick={handleDownloadInvoicePdf}
              >
                Download PDF
              </Button>
              <Button leftSection={<PrinterIcon />} color="gray" variant="light" onClick={handlePrint}>
                Print Invoice
              </Button>
            </div>
          </Stack>
        ) : (
          <Text size="sm" c="dimmed">
            Order not found.
          </Text>
        )}
      </Modal>
      <div className="flex items-center gap-2.5 mb-2.5">
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
          onChange={setStatusFilter}
          clearable
          w={140}
        />
        <span className="text-[11px] text-muted-foreground flex-1">{totalCount} orders total</span>
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
      </div>

      <div className="bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            verticalSpacing={6}
            horizontalSpacing={8}
            highlightOnHover
            classNames={{
              th: '!text-[11px] font-semibold! !uppercase !tracking-[0.04em] text-muted-foreground! !bg-[#fafafa]',
              td: '!text-[12px]',
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={110}>Order ID</Table.Th>
                <Table.Th>Delivery address</Table.Th>
                <Table.Th w={110}>Created</Table.Th>
                <Table.Th w={80} ta="right">
                  Total
                </Table.Th>
                <Table.Th w={90} ta="right">
                  Points
                </Table.Th>
                <Table.Th w={90} ta="right">
                  Discount
                </Table.Th>
                <Table.Th w={170}>Status</Table.Th>
                <Table.Th w={50} ta="right">
                  View
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <div className="text-center py-8 text-[12px] text-[#a1a1aa]">Loading orders…</div>
                  </Table.Td>
                </Table.Tr>
              ) : filteredOrders.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <div className="text-center py-8 text-[12px] text-[#a1a1aa]">No orders found.</div>
                  </Table.Td>
                </Table.Tr>
              ) : (
                filteredOrders.map((order) => {
                  const isUpdating = pendingChange?.id === order.id
                  return (
                    <Table.Tr key={order.id}>
                      <Table.Td className="font-medium!">#{order.id?.substring(0, 8)}</Table.Td>
                      <Table.Td className="text-muted-foreground!">{order.deliveryAddress || '—'}</Table.Td>
                      <Table.Td className="text-muted-foreground!">
                        {order.createdAt ? dayjs(order.createdAt).format('DD/MM/YYYY') : '—'}
                      </Table.Td>
                      <Table.Td ta="right" className="font-semibold!">
                        {formatCurrency(order.finalAmount)}
                      </Table.Td>
                      <Table.Td ta="right">{order.earnedPoints}</Table.Td>
                      <Table.Td ta="right" className="text-muted-foreground!">
                        {formatCurrency(order.discountAmount)}
                      </Table.Td>
                      <Table.Td>
                        <Select
                          size="xs"
                          data={STATUS_OPTIONS}
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(val) => {
                            if (val && val !== order.status) {
                              changeStatus({ id: order.id, data: { status: val as OrderStatusEnum } })
                            }
                          }}
                          leftSection={
                            <Badge size="xs" variant="dot" color={statusColor[order.status] ?? 'gray'} p={0} />
                          }
                          w={160}
                          comboboxProps={{ withinPortal: true }}
                        />
                      </Table.Td>
                      <Table.Td>
                        <div className="flex justify-end">
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="sm"
                            aria-label="View"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            <EyeIcon size={13} />
                          </ActionIcon>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  )
                })
              )}
            </Table.Tbody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-end mt-3">
          <Pagination total={totalPages} value={page} onChange={setPage} size="xs" />
        </div>
      )}
    </div>
  )
}

export default OrderList
