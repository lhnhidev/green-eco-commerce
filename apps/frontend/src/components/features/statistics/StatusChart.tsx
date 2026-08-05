import { OrderStatusEnum } from '@api/schemas/orderStatusEnum'
import type { GetMyStatisticsQueryStatusSlice } from '@api/schemas'
import { DonutChart } from '@mantine/charts'

const STATUS_META: Record<OrderStatusEnum, { label: string; color: string }> = {
  [OrderStatusEnum.Pending]: { label: 'Pending', color: 'gray.5' },
  [OrderStatusEnum.Packing]: { label: 'Packing', color: 'yellow.6' },
  [OrderStatusEnum.Delivering]: { label: 'Delivering', color: 'blue.6' },
  [OrderStatusEnum.Delivered]: { label: 'Delivered', color: 'teal.6' },
  [OrderStatusEnum.Cancelled]: { label: 'Cancelled', color: 'red.6' },
}

type StatusChartProps = {
  data: GetMyStatisticsQueryStatusSlice[]
}

/** Order count distribution by status. */
const StatusChart = ({ data }: StatusChartProps) => {
  const cells = data.map((slice) => ({
    name: STATUS_META[slice.status].label,
    value: slice.count,
    color: STATUS_META[slice.status].color,
  }))

  return (
    <DonutChart
      data={cells}
      size={200}
      thickness={28}
      withLabels
      withLabelsLine
      withTooltip
      tooltipDataSource="segment"
      withLegend
      valueFormatter={(value) => `${value} ${value === 1 ? 'order' : 'orders'}`}
    />
  )
}

export default StatusChart
