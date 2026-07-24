import Loading from '@components/ui/status/Loading'
import { useMyStatistics } from '@hooks/useMyStatistics'
import { Alert, Center, Group, Paper, SegmentedControl, SimpleGrid, Stack, Text, Tooltip } from '@mantine/core'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { FiAlertCircle, FiClock, FiInbox, FiInfo } from 'react-icons/fi'
import { IoCartOutline, IoLeafOutline } from 'react-icons/io5'
import { LuCoins, LuWallet } from 'react-icons/lu'
import CategoryChart from './CategoryChart'
import SpendingChart from './SpendingChart'
import StatusChart from './StatusChart'

const MONTH_OPTIONS = [
  { label: '3 tháng', value: '3' },
  { label: '6 tháng', value: '6' },
  { label: '12 tháng', value: '12' },
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
              <FiInfo size={12} />
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
          Chưa có dữ liệu
        </Text>
      </Center>
    ) : (
      children
    )}
  </Paper>
)

const StatisticsTab = () => {
  const [months, setMonths] = useState('6')
  const { data, isLoading, isError, refetch } = useMyStatistics(Number(months))

  if (isLoading) return <Loading text="Đang tải thống kê" />

  if (isError || !data) {
    return (
      <Alert
        icon={<FiAlertCircle />}
        color="red"
        title="Không tải được thống kê"
        variant="light"
      >
        <Text size="sm" mb="sm">
          Đã xảy ra lỗi khi lấy dữ liệu thống kê của bạn.
        </Text>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Thử lại
        </button>
      </Alert>
    )
  }

  const { summary, monthlySpending, categoryBreakdown, statusBreakdown } = data

  if (summary.totalOrders === 0) {
    return (
      <Center className="flex-col py-16 text-center">
        <FiInbox className="text-4xl text-gray-300 mb-3" />
        <Text fw={600} className="text-gray-600">
          Bạn chưa có đơn hàng nào
        </Text>
        <Text size="sm" c="dimmed" mt={4}>
          Hãy mua sắm sản phẩm xanh để bắt đầu theo dõi thống kê của mình.
        </Text>
      </Center>
    )
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <Text fw={600}>Thống kê mua sắm của bạn</Text>
        <SegmentedControl
          size="xs"
          value={months}
          onChange={setMonths}
          data={MONTH_OPTIONS}
        />
      </Group>

      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="sm">
        <StatCard
          icon={<IoCartOutline />}
          title="Tổng đơn hàng"
          value={formatNumber(summary.totalOrders)}
        />
        <StatCard
          icon={<LuWallet />}
          title="Tổng chi tiêu"
          tooltip="Tổng giá trị các đơn chưa huỷ. Không tính đơn đã huỷ."
          value={formatVnd(summary.totalSpending)}
          hint={
            <>
              <div>Đã thanh toán: {formatVnd(summary.paidSpending)}</div>
              <div>Chờ thanh toán (COD): {formatVnd(summary.pendingSpending)}</div>
            </>
          }
        />
        <StatCard
          icon={<IoLeafOutline />}
          title="CO₂ tiết kiệm"
          value={`${formatNumber(Number(summary.totalCo2Saved.toFixed(1)))} kg`}
        />
        <StatCard
          icon={<LuCoins />}
          title="Điểm khả dụng"
          tooltip="Điểm khả dụng dùng để giảm giá khi mua. Tổng tích luỹ là toàn bộ điểm bạn từng nhận."
          value={formatNumber(summary.currentPoints)}
          hint={`Đã tích luỹ: ${formatNumber(summary.lifetimePoints)} · Đã đổi: ${formatNumber(Math.max(0, summary.lifetimePoints - summary.currentPoints))}`}
        />
      </SimpleGrid>

      {summary.refundPendingSpending > 0 && (
        <Tooltip
          label="Tiền đã thanh toán cho đơn đã huỷ, đang chờ hoàn lại."
          withArrow
          multiline
          w={240}
          events={{ hover: true, focus: true, touch: true }}
        >
          <div className="inline-flex items-center gap-1.5 self-start rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700 cursor-help">
            <FiClock size={13} />
            Đang chờ hoàn: {formatVnd(summary.refundPendingSpending)}
            <FiInfo size={12} className="text-amber-500" />
          </div>
        </Tooltip>
      )}

      <ChartCard title="Chi tiêu theo tháng" isEmpty={monthlySpending.every((p) => p.amount === 0)}>
        <SpendingChart data={monthlySpending} />
      </ChartCard>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <ChartCard title="Chi tiêu theo danh mục" isEmpty={categoryBreakdown.length === 0}>
          <Center>
            <CategoryChart data={categoryBreakdown} />
          </Center>
        </ChartCard>
        <ChartCard title="Đơn hàng theo trạng thái" isEmpty={statusBreakdown.length === 0}>
          <Center>
            <StatusChart data={statusBreakdown} />
          </Center>
        </ChartCard>
      </SimpleGrid>
    </Stack>
  )
}

export default StatisticsTab