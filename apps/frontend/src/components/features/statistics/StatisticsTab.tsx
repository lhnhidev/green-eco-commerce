import { useGetMyStatistics } from '@api'
import Loading from '@components/ui/status/Loading'
import { Alert, Center, Group, Paper, SegmentedControl, SimpleGrid, Stack, Text, Tooltip } from '@mantine/core'
import {
  ClockIcon,
  CoinsIcon,
  InfoIcon,
  LeafIcon,
  ShoppingCartIcon,
  TrayIcon,
  WalletIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import CategoryChart from './CategoryChart'
import SpendingChart from './SpendingChart'
import StatusChart from './StatusChart'

const MONTH_OPTIONS = [
  { label: '3 months', value: '3' },
  { label: '6 months', value: '6' },
  { label: '12 months', value: '12' },
]

const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')} ₫`
const formatNumber = (value: number) => value.toLocaleString('vi-VN')

type StatCardProps = {
  icon: ReactNode
  title: string
  value: string
  hint?: ReactNode
  tooltip?: string
}

const StatCard = ({ icon, title, value, hint, tooltip }: StatCardProps) => (
  <Paper withBorder radius="md" p="md" className="bg-white">
    <Group gap="xs" mb={6}>
      <span className="text-primary text-lg">{icon}</span>
      <Group gap={4} align="center" wrap="nowrap">
        <Text size="xs" c="dimmed">
          {title}
        </Text>
        {tooltip && (
          <Tooltip label={tooltip} withArrow multiline w={220} events={{ hover: true, focus: true, touch: true }}>
            <span className="text-gray-400 cursor-help flex items-center">
              <InfoIcon size={12} />
            </span>
          </Tooltip>
        )}
      </Group>
    </Group>
    <Text fw={700} fz={22} lh={1.2} className="truncate">
      {value}
    </Text>
    {hint && <div className="mt-1 text-xs text-gray-500 leading-snug">{hint}</div>}
  </Paper>
)

type ChartCardProps = {
  title: string
  isEmpty: boolean
  children: ReactNode
}

const ChartCard = ({ title, isEmpty, children }: ChartCardProps) => (
  <Paper withBorder radius="md" p="md" className="bg-white">
    <Text fw={600} size="sm" mb="md">
      {title}
    </Text>
    {isEmpty ? (
      <Center h={200}>
        <Text size="sm" c="dimmed">
          No data yet
        </Text>
      </Center>
    ) : (
      children
    )}
  </Paper>
)

const StatisticsTab = () => {
  const [months, setMonths] = useState('6')
  const { data, isLoading, isError, refetch } = useGetMyStatistics({ months: Number(months) })

  if (isLoading) return <Loading text="Loading statistics" />

  if (isError || !data) {
    return (
      <Alert icon={<WarningCircleIcon />} color="red" title="Couldn't load statistics" variant="light">
        <Text size="sm" mb="sm">
          Something went wrong while loading your statistics.
        </Text>
        <button type="button" onClick={() => refetch()} className="text-sm font-semibold text-primary hover:underline">
          Try again
        </button>
      </Alert>
    )
  }

  const { summary, monthlySpending, categoryBreakdown, statusBreakdown } = data

  if (summary.totalOrders === 0) {
    return (
      <Center className="flex-col py-10 text-center">
        <TrayIcon className="text-3xl text-gray-300 mb-3" />
        <Text fw={600} className="text-gray-600">
          You have no orders yet
        </Text>
        <Text size="sm" c="dimmed" mt={4}>
          Shop green products to start tracking your statistics.
        </Text>
      </Center>
    )
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Text fw={600}>Your shopping statistics</Text>
        <SegmentedControl size="xs" value={months} onChange={setMonths} data={MONTH_OPTIONS} />
      </Group>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="sm">
        <StatCard icon={<ShoppingCartIcon />} title="Total orders" value={formatNumber(summary.totalOrders)} />
        <StatCard
          icon={<WalletIcon />}
          title="Total spending"
          tooltip="Total value of orders that aren't cancelled. Cancelled orders are excluded."
          value={formatVnd(summary.totalSpending)}
          hint={
            <>
              <div>Paid: {formatVnd(summary.paidSpending)}</div>
              <div>Awaiting payment (COD): {formatVnd(summary.pendingSpending)}</div>
            </>
          }
        />
        <StatCard
          icon={<LeafIcon />}
          title="CO₂ saved"
          value={`${formatNumber(Number(summary.totalCo2Saved.toFixed(1)))} kg`}
        />
        <StatCard
          icon={<CoinsIcon />}
          title="Available points"
          tooltip="Available points can be redeemed for discounts at checkout. Lifetime is every point you've ever earned."
          value={formatNumber(summary.currentPoints)}
          hint={`Lifetime: ${formatNumber(summary.lifetimePoints)} · Redeemed: ${formatNumber(Math.max(0, summary.lifetimePoints - summary.currentPoints))}`}
        />
      </SimpleGrid>

      {summary.refundPendingSpending > 0 && (
        <Tooltip
          label="Money paid for cancelled orders, awaiting refund."
          withArrow
          multiline
          w={240}
          events={{ hover: true, focus: true, touch: true }}
        >
          <div className="inline-flex items-center gap-1.5 self-start rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 cursor-help">
            <ClockIcon size={13} />
            Pending refund: {formatVnd(summary.refundPendingSpending)}
            <InfoIcon size={12} className="text-amber-500" />
          </div>
        </Tooltip>
      )}

      <ChartCard title="Monthly spending" isEmpty={monthlySpending.every((p) => p.amount === 0)}>
        <SpendingChart data={monthlySpending} />
      </ChartCard>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <ChartCard title="Spending by category" isEmpty={categoryBreakdown.length === 0}>
          <Center>
            <CategoryChart data={categoryBreakdown} />
          </Center>
        </ChartCard>
        <ChartCard title="Orders by status" isEmpty={statusBreakdown.length === 0}>
          <Center>
            <StatusChart data={statusBreakdown} />
          </Center>
        </ChartCard>
      </SimpleGrid>
    </Stack>
  )
}

export default StatisticsTab
