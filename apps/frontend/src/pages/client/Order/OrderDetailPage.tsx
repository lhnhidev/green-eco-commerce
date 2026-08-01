import { invalidateGetMyOrderById, invalidateGetMyOrders, useCancelMyOrder, useGetMyOrderById } from '@api'
import { OrderStatusEnum } from '@api/schemas'
import ImageWithFallback from '@components/ui/ImageWithFallback'
import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Container from '@components/ui/primitives/Container'
import Loading from '@components/ui/status/Loading'
import { Badge, Button, Divider, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { ArrowLeftIcon, DownloadSimpleIcon, LeafIcon, MapPinIcon, PackageIcon, StarIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { downloadFile } from '@utils/downloadFile'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

const statusColor: Record<string, string> = {
  Pending: 'gray',
  Packing: 'blue',
  Delivering: 'yellow',
  Delivered: 'green',
  Cancelled: 'red',
}

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)
  const { data: order, isLoading, isError } = useGetMyOrderById(id ?? '')
  const { mutate: cancel, isPending: cancelling } = useCancelMyOrder({
    mutation: {
      onSuccess: async () => {
        await invalidateGetMyOrderById(queryClient, id ?? '')
        await invalidateGetMyOrders(queryClient)
        notifications.show({ title: 'Order Cancelled', message: 'Your order has been cancelled.', color: 'green' })
      },
      onError: () =>
        notifications.show({ title: 'Cancel Failed', message: 'Unable to cancel this order.', color: 'red' }),
    },
  })

  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title: 'My Orders', href: '/my-orders' },
    { title: `Order #${id?.slice(-8).toUpperCase()}`, href: `/my-orders/${id}` },
  ]

  if (isLoading) return <Loading text="Loading order details..." />
  if (isError || !order) {
    return (
      <Container width="narrow" className="py-8 text-center">
        <Title order={3} c="dimmed">
          Order not found
        </Title>
        <Button mt="md" variant="light" leftSection={<ArrowLeftIcon />} onClick={() => navigate('/my-orders')}>
          Back to Orders
        </Button>
      </Container>
    )
  }

  const handleCancel = () => {
    modals.openConfirmModal({
      title: 'Cancel Order',
      children: <Text size="sm">Are you sure you want to cancel this order? This action cannot be undone.</Text>,
      labels: { confirm: 'Yes, Cancel Order', cancel: 'Keep Order' },
      confirmProps: { color: 'red' },
      onConfirm: () => cancel({ id: order.id }),
    })
  }

  const subtotal = order.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true)
    try {
      await downloadFile(`/api/me/orders/${order.id}/invoice.pdf`, `invoice_${order.id.slice(-8)}.pdf`)
    } catch {
      notifications.show({ title: 'Download failed', message: 'Could not download invoice PDF.', color: 'red' })
    } finally {
      setDownloadingInvoice(false)
    }
  }

  return (
    <Container width="narrow" className="py-6">
      <PageBreadcrumbs items={breadcrumbItems} mb="sm" />

      <Group justify="space-between" align="flex-start" mb="md">
        <div>
          <Title order={2} mb={4}>
            Order Details
          </Title>
          <Group gap="xs">
            <Text size="sm" c="dimmed" ff="mono">
              #{order.id?.slice(-8).toUpperCase()}
            </Text>
            <Badge size="sm" variant="light" color={statusColor[order.status] ?? 'gray'}>
              {order.status}
            </Badge>
          </Group>
        </div>
        <Group gap="xs">
          <Button
            variant="light"
            color="gray"
            leftSection={<DownloadSimpleIcon size={14} />}
            size="sm"
            loading={downloadingInvoice}
            onClick={handleDownloadInvoice}
          >
            Invoice PDF
          </Button>
          <Button
            variant="subtle"
            leftSection={<ArrowLeftIcon size={14} />}
            size="sm"
            onClick={() => navigate('/my-orders')}
          >
            Back
          </Button>
        </Group>
      </Group>

      {/* Items */}
      <Paper withBorder radius="md" p="md" mb="md">
        <Title order={5} mb="sm">
          <PackageIcon className="inline mr-2" />
          Items ({order.items.length})
        </Title>
        <Stack gap="sm">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-3 items-center">
              <ImageWithFallback
                src={resolveImageUrl(item.productImage)}
                alt={item.productName}
                className="w-12 h-12 object-cover rounded-sm shrink-0"
              />
              <div className="flex-1">
                <Text fw={600} size="sm">
                  <Link to={`/products/${item.productId}`} className="hover:text-green-700">
                    {item.productName}
                  </Link>
                </Text>
                <Text size="xs" c="dimmed">
                  {formatCurrency(item.unitPrice)} × {item.quantity}
                </Text>
                <Text size="xs" c="teal.6">
                  <LeafIcon className="inline mr-1" />
                  CO₂ Saved: {(item.unitCo2Saved * item.quantity).toFixed(2)} kg
                </Text>
              </div>
              <Text fw={700} size="sm">
                {formatCurrency(item.unitPrice * item.quantity)}
              </Text>
            </div>
          ))}
        </Stack>
      </Paper>

      {/* Summary */}
      <Paper withBorder radius="md" p="md" mb="md">
        <Title order={5} mb="sm">
          Summary
        </Title>
        <Stack gap={4}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Subtotal:
            </Text>
            <Text size="sm">{formatCurrency(subtotal)}</Text>
          </Group>
          {order.discountAmount > 0 && (
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Discount:
              </Text>
              <Text size="sm" c="red">
                -{formatCurrency(order.discountAmount)}
              </Text>
            </Group>
          )}
          <Divider my={4} />
          <Group justify="space-between">
            <Text fw={700}>Total:</Text>
            <Text fw={700} c="green.7">
              {formatCurrency(order.finalAmount)}
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="teal.6">
              <LeafIcon className="inline mr-1" />
              CO₂ Saved:
            </Text>
            <Text size="sm" c="teal.6">
              {order.totalCo2Saved.toFixed(2)} kg
            </Text>
          </Group>
          <Group justify="space-between">
            <Text size="sm" c="amber.6">
              <StarIcon className="inline mr-1" />
              Points Earned:
            </Text>
            <Text size="sm" c="amber.6">
              +{order.earnedPoints} pts
            </Text>
          </Group>
        </Stack>
      </Paper>

      {/* Delivery */}
      <Paper withBorder radius="md" p="md" mb="md">
        <Title order={5} mb="sm">
          <MapPinIcon className="inline mr-2" />
          Delivery
        </Title>
        <Text size="sm">{order.deliveryAddress || '—'}</Text>
        <Text size="xs" c="dimmed" mt={4}>
          Placed on {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
        </Text>
      </Paper>

      {/* Actions */}
      {order.status === OrderStatusEnum.Pending && (
        <Button color="red" variant="outline" fullWidth loading={cancelling} onClick={handleCancel}>
          Cancel Order
        </Button>
      )}
    </Container>
  )
}

export default OrderDetailPage
