import { useGetMyOrderById } from '@api'
import Container from '@components/ui/primitives/Container'
import Loading from '@components/ui/status/Loading'
import { Button, Divider, Group, Image, Paper, Stack, Text, Title } from '@mantine/core'
import { CheckCircleIcon, DownloadSimpleIcon, LeafIcon, StarIcon } from '@phosphor-icons/react'
import { downloadFile } from '@utils/downloadFile'
import { formatCurrency } from '@utils/formatCurrency'
import { resolveImageUrl } from '@utils/resolveImageUrl'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'

const OrderSuccessPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [downloadingInvoice, setDownloadingInvoice] = useState(false)
  const { data: order, isLoading, isError } = useGetMyOrderById(id ?? '')

  if (isLoading) return <Loading text="Loading your order..." />

  if (isError || !order) {
    return (
      <Container width="narrow" className="py-8 text-center">
        <Title order={3} c="dimmed">
          Order not found
        </Title>
        <Button mt="md" variant="light" onClick={() => navigate('/my-orders')}>
          Go to My Orders
        </Button>
      </Container>
    )
  }

  const handleDownloadInvoice = async () => {
    setDownloadingInvoice(true)
    try {
      await downloadFile(`/api/me/orders/${order.id}/invoice.pdf`, `invoice_${order.id.substring(0, 8)}.pdf`)
    } catch {
      setDownloadingInvoice(false)
      return
    }
    setDownloadingInvoice(false)
  }

  return (
    <Container width="narrow" className="py-8">
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-3">
          <CheckCircleIcon weight="fill" size={28} className="text-green-500" />
        </div>
        <Title order={2} mb={4}>
          Order placed!
        </Title>
        <Text c="dimmed" size="sm">
          Thanks for shopping sustainably. A confirmation has been saved to your order history.
        </Text>
        <Text size="sm" ff="mono" c="dimmed" mt={4}>
          Order #{order.id?.substring(0, 8).toUpperCase()}
        </Text>
      </div>

      <Paper withBorder radius="md" p="md" mb="md">
        <Title order={5} mb="sm">
          Items ({order.items.length})
        </Title>
        <Stack gap="sm">
          {order.items.map((item) => (
            <div key={item.productId} className="flex gap-3 items-center">
              <Image
                src={resolveImageUrl(item.productImage) || 'https://placehold.co/48x48?text=Eco'}
                alt={item.productName}
                w={48}
                h={48}
                fit="cover"
                radius="sm"
              />
              <div className="flex-1">
                <Text fw={600} size="sm">
                  {item.productName}
                </Text>
                <Text size="xs" c="dimmed">
                  {formatCurrency(item.unitPrice)} × {item.quantity}
                </Text>
              </div>
              <Text fw={700} size="sm">
                {formatCurrency(item.unitPrice * item.quantity)}
              </Text>
            </div>
          ))}
        </Stack>
      </Paper>

      <Paper withBorder radius="md" p="md" mb="md">
        <Stack gap={4}>
          <Group justify="space-between">
            <Text fw={700}>Total paid:</Text>
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
          <Divider my={4} />
          <Text size="xs" c="dimmed">
            Delivering to {order.deliveryAddress || '—'}
          </Text>
        </Stack>
      </Paper>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="light"
          color="gray"
          leftSection={<DownloadSimpleIcon size={14} />}
          loading={downloadingInvoice}
          onClick={handleDownloadInvoice}
          fullWidth
        >
          Download Invoice
        </Button>
        <Button component={Link} to={`/my-orders/${order.id}`} variant="light" color="primary" fullWidth>
          View Order
        </Button>
        <Button component={Link} to="/products" color="primary" fullWidth>
          Continue Shopping
        </Button>
      </div>
    </Container>
  )
}

export default OrderSuccessPage
