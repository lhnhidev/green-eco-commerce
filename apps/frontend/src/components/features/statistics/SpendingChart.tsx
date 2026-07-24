import type { MonthlyPoint } from '@hooks/useMyStatistics'
import { BarChart } from '@mantine/charts'

const formatVnd = (value: number) => value.toLocaleString('vi-VN')

type SpendingChartProps = {
  data: MonthlyPoint[]
}

/** Monthly spending (non-cancelled orders) over the selected window. */
const SpendingChart = ({ data }: SpendingChartProps) => {
  const chartData = data.map((point) => ({ month: point.label, spending: point.amount }))

  return (
    <BarChart
      h={260}
      data={chartData}
      dataKey="month"
      series={[{ name: 'spending', color: 'teal.6', label: 'Chi tiêu (₫)' }]}
      valueFormatter={formatVnd}
      tickLine="y"
      gridAxis="y"
      withLegend
    />
  )
}

export default SpendingChart