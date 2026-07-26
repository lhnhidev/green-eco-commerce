import { getGetInfoAnalystQueryOptions } from '@api'
import type { GetInfoAnalystQueryResponse } from '@api/schemas'
import { BarChart } from '@mantine/charts'
import { Alert, SegmentedControl, Skeleton } from '@mantine/core'
import { useQueries } from '@tanstack/react-query'
import { useState } from 'react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CHART_HEIGHT = 300

const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})
const integerFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const decimalFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const compactFormat = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

type MetricKey = 'revenue' | 'orders' | 'users' | 'co2Saved'

type MetricConfig = {
  label: string
  /** Matching field in the analyst endpoint response */
  field: keyof GetInfoAnalystQueryResponse
  /** Formatting used inside the tooltip */
  format: (value: number) => string
  /** Shortened formatting used for the y-axis ticks */
  formatAxis: (value: number) => string
}

const METRICS: Record<MetricKey, MetricConfig> = {
  revenue: {
    label: 'Revenue',
    field: 'totalRevenue',
    format: (value) => currencyFormat.format(value),
    formatAxis: (value) => compactFormat.format(value),
  },
  orders: {
    label: 'Orders',
    field: 'amountOrders',
    format: (value) => integerFormat.format(Math.round(value)),
    formatAxis: (value) => integerFormat.format(Math.round(value)),
  },
  users: {
    label: 'New Users',
    field: 'amountUsers',
    format: (value) => integerFormat.format(Math.round(value)),
    formatAxis: (value) => integerFormat.format(Math.round(value)),
  },
  co2Saved: {
    label: 'CO₂ Saved',
    field: 'totalCo2Saved',
    format: (value) => `${decimalFormat.format(value)} kg`,
    formatAxis: (value) => `${compactFormat.format(value)} kg`,
  },
}

const SEGMENTS = (Object.keys(METRICS) as MetricKey[]).map((key) => ({
  value: key,
  label: METRICS[key].label,
}))

type MonthlyStatisticsChartProps = {
  /** Year to break down by month, defaults to the current year */
  year?: number
}

const MonthlyStatisticsChart = ({ year = new Date().getFullYear() }: MonthlyStatisticsChartProps) => {
  const [metric, setMetric] = useState<MetricKey>('revenue')
  const config = METRICS[metric]

  // The analyst endpoint only returns a single month, so all twelve months are
  // fetched in parallel. React Query shares its cache with the Dashboard's own
  // per-month query, so the selected month is not requested twice.
  const results = useQueries({
    queries: MONTHS.map((_, index) => getGetInfoAnalystQueryOptions({ month: index + 1, year: year })),
  })

  const isLoading = results.some((result) => result.isPending)
  const error = results.find((result) => result.isError)?.error

  const data = results.map((result, index) => ({
    month: MONTHS[index],
    value: result.data?.[config.field].currentValue ?? 0,
  }))

  const hasData = data.some((item) => item.value > 0)

  const renderBody = () => {
    if (isLoading) return <Skeleton h={CHART_HEIGHT} radius="md" />

    if (error) {
      return (
        <Alert color="red" variant="light" title="Unable to load statistics">
          <span className="text-[12px]">
            {error.detail ?? error.title ?? 'Something went wrong, please try again.'}
          </span>
        </Alert>
      )
    }

    if (!hasData) {
      return (
        <div className="flex items-center justify-center text-[12px] text-[#a1a1aa]" style={{ height: CHART_HEIGHT }}>
          No data for {year}
        </div>
      )
    }

    return (
      <BarChart
        h={CHART_HEIGHT}
        data={data}
        dataKey="month"
        series={[{ name: 'value', label: config.label, color: 'primary.6' }]}
        valueFormatter={config.format}
        yAxisProps={{ width: 64, tickFormatter: config.formatAxis }}
        xAxisProps={{ interval: 0 }}
        barProps={{ radius: [4, 4, 0, 0] }}
        gridAxis="y"
        tickLine="none"
        maxBarWidth={44}
      />
    )
  }

  return (
    <div className="bg-white border border-[#ececee] rounded-xl shadow-[0_1px_2px_rgba(24,24,27,0.04)] overflow-hidden">
      <div className="px-3.5 py-2.5 border-b border-[#ececee] flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold text-[#18181b]">Monthly breakdown</span>
          <span className="text-[11px] text-[#a1a1aa]">{year}</span>
        </div>
        <SegmentedControl
          size="xs"
          value={metric}
          onChange={(value) => setMetric(value as MetricKey)}
          data={SEGMENTS}
        />
      </div>

      <div className="p-3.5">{renderBody()}</div>
    </div>
  )
}

export default MonthlyStatisticsChart
