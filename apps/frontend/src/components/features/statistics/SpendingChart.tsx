import type { MonthlyPoint } from '@hooks/useMyStatistics'
import { BarChart } from '@mantine/charts'
import dayjs from 'dayjs'

const formatVnd = (value: number) => value.toLocaleString('vi-VN')

/** `MMM YYYY` axis label built from the point's own year/month, e.g. `Jul 2026`. */
const formatMonth = (point: MonthlyPoint) => dayjs(new Date(point.year, point.month - 1, 1)).format('MMM YYYY')

type SpendingChartProps = {
  data: MonthlyPoint[]
}

/** Monthly spending (non-canceled orders) over the selected window. */
const SpendingChart = ({ data }: SpendingChartProps) => {
  const chartData = data.map((point) => ({ month: formatMonth(point), spending: point.amount }))

  return (
    <BarChart
      h={260}
      data={chartData}
      dataKey="month"
      series={[{ name: 'spending', color: 'teal.6', label: 'Spending (₫)' }]}
      valueFormatter={formatVnd}
      tickLine="y"
      gridAxis="y"
      withLegend
    />
  )
}

export default SpendingChart
