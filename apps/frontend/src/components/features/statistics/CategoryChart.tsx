import type { GetMyStatisticsQueryCategorySlice } from '@api/schemas'
import { DonutChart } from '@mantine/charts'

const PALETTE = ['teal.6', 'green.6', 'lime.6', 'cyan.6', 'blue.6', 'indigo.6', 'grape.6', 'orange.6']

const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')} ₫`

type CategoryChartProps = {
  data: GetMyStatisticsQueryCategorySlice[]
}

/** Spending distribution across product categories (by amount). */
const CategoryChart = ({ data }: CategoryChartProps) => {
  const cells = data.map((slice, index) => ({
    name: slice.category,
    value: slice.amount,
    color: PALETTE[index % PALETTE.length],
  }))

  return (
    <DonutChart
      data={cells}
      size={200}
      thickness={28}
      withLabelsLine
      withLabels
      labelsType="percent"
      withTooltip
      tooltipDataSource="segment"
      withLegend
      valueFormatter={formatVnd}
    />
  )
}

export default CategoryChart
