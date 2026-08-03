import { useGetAllOrders } from '@api'
import type { OrderStatusEnum } from '@api/schemas/orderStatusEnum'
import { Badge } from '@mantine/core'
import { formatCurrency } from '@utils/formatCurrency'

const statusColor: Record<OrderStatusEnum, string> = {
  Pending: 'gray',
  Packing: 'blue',
  Delivering: 'yellow',
  Delivered: 'primary',
  Cancelled: 'red',
}

const RecentOrders = () => {
  const { data, isLoading } = useGetAllOrders()

  const rows = [...(data?.items ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 7)

  return (
    <div className="bg-white border border-border rounded-xl shadow-2xs overflow-hidden h-full">
      <div className="px-3.5 py-2.5 border-b border-border">
        <span className="text-sm font-semibold text-gray-800">Recent orders</span>
      </div>

      {isLoading ? (
        <div className="p-6 text-center text-xs text-fg-subtle">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="p-6 text-center text-xs text-fg-subtle">No orders yet</div>
      ) : (
        <>
          <div className="grid grid-cols-[1.2fr_1.2fr_100px_90px_90px] bg-surface-sunken border-b border-border text-2xs font-semibold uppercase tracking-[0.04em] text-muted-foreground">
            <div className="px-2 py-1.5">Order</div>
            <div className="px-2 py-1.5">Created</div>
            <div className="px-2 py-1.5">Status</div>
            <div className="px-2 py-1.5 text-right">Points</div>
            <div className="px-2 py-1.5 text-right">Discount</div>
          </div>
          {rows.map((o) => (
            <div
              key={o.id}
              className="grid grid-cols-[1.2fr_1.2fr_100px_90px_90px] border-b border-border last:border-0 hover:bg-[#f7fdf9] text-xs"
            >
              <div className="px-2 py-1.5 font-medium truncate">#{o.id.slice(-8)}</div>
              <div className="px-2 py-1.5 text-muted-foreground">
                {new Date(o.createdAt).toLocaleDateString('vi-VN')}
              </div>
              <div className="px-2 py-1">
                <Badge size="xs" variant="light" color={statusColor[o.status]} radius="xl">
                  {o.status}
                </Badge>
              </div>
              <div className="px-2 py-1.5 text-right">{o.earnedPoints}</div>
              <div className="px-2 py-1.5 text-right text-muted-foreground">{formatCurrency(o.discountAmount)}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default RecentOrders
