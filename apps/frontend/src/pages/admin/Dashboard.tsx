import { useGetInfoAnalyst } from '@api'
import Co2SavedCard from '@components/features/dashboard/Co2SavedCard'
import LowStockProducts from '@components/features/dashboard/LowStockProducts'
import MonthlyStatisticsChart from '@components/features/dashboard/MonthlyStatisticsChart'
import RecentOrders from '@components/features/dashboard/RecentOrders'
import BestSellingProducts from '@components/features/products/BestSellingProducts'
import AdminPageShell from '@components/ui/primitives/AdminPageShell'
import StatCard from '@components/ui/primitives/StatCard'
import Loading from '@components/ui/status/Loading'
import { Button } from '@mantine/core'
import { MonthPickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { DownloadSimpleIcon, MoneyIcon, ShoppingCartIcon, UserIcon } from '@phosphor-icons/react'
import { downloadFile } from '@utils/downloadFile'
import { useState } from 'react'

const Dashboard = () => {
  const [value, setValue] = useState<Date | string | null>(new Date())
  const [exporting, setExporting] = useState(false)

  const getDateObject = (val: Date | string | null): Date => {
    if (!val) return new Date()
    if (val instanceof Date) return val
    const parsed = new Date(val)
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed
  }

  const activeDate = getDateObject(value)

  const { data: analysted, isLoading } = useGetInfoAnalyst({
    month: activeDate.getMonth() + 1,
    year: activeDate.getFullYear(),
  })

  const getGrowth = (m: { isGrowth?: boolean; growthPercentage?: number }): 'up' | 'down' | 'flat' =>
    m.isGrowth === true ? 'up' : Number(m.growthPercentage).toFixed(0) === '0' ? 'flat' : 'down'

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      await downloadFile(
        `/api/admin/analyst/export.xlsx?month=${activeDate.getMonth() + 1}&year=${activeDate.getFullYear()}`,
        `revenue_report_${activeDate.getFullYear()}-${String(activeDate.getMonth() + 1).padStart(2, '0')}.xlsx`,
      )
    } catch {
      notifications.show({ title: 'Export failed', message: 'Could not download Excel report.', color: 'red' })
    } finally {
      setExporting(false)
    }
  }

  if (isLoading || !analysted) return <Loading text="Loading" />

  return (
    <AdminPageShell
      title="Dashboard"
      description="Overview of store performance"
      actions={
        <>
          <Button
            size="xs"
            variant="light"
            color="gray"
            leftSection={<DownloadSimpleIcon size={13} />}
            loading={exporting}
            onClick={handleExportExcel}
          >
            Export Report
          </Button>
          <MonthPickerInput
            placeholder="Select month..."
            value={value as never}
            onChange={(v) => setValue(v as never)}
            clearable
            size="xs"
            dropdownType="popover"
            valueFormat="MM/YYYY"
            w={140}
          />
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2.5">
        <StatCard
          label="Total Revenue"
          icon={MoneyIcon}
          value={`$${Number(analysted.totalRevenue.currentValue).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
          delta={{
            value: Number(Number(analysted.totalRevenue.growthPercentage).toFixed(1)),
            direction: getGrowth(analysted.totalRevenue),
          }}
        />
        <StatCard
          label="Total Orders"
          icon={ShoppingCartIcon}
          value={Number(analysted.amountOrders.currentValue).toFixed(0)}
          delta={{
            value: Number(Number(analysted.amountOrders.growthPercentage).toFixed(1)),
            direction: getGrowth(analysted.amountOrders),
          }}
        />
        <StatCard
          label="New Users"
          icon={UserIcon}
          value={Number(analysted.amountUsers.currentValue).toFixed(0)}
          delta={{
            value: Number(Number(analysted.amountUsers.growthPercentage).toFixed(1)),
            direction: getGrowth(analysted.amountUsers),
          }}
        />
        <Co2SavedCard data={analysted.totalCo2Saved} direction={getGrowth(analysted.totalCo2Saved)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 mb-2.5">
        <div className="lg:col-span-8">
          <RecentOrders month={activeDate.getMonth() + 1} year={activeDate.getFullYear()} />
        </div>
        <div className="lg:col-span-4">
          <LowStockProducts />
        </div>
      </div>

      <MonthlyStatisticsChart year={activeDate.getFullYear()} />

      <div className="mt-4">
        <BestSellingProducts top={10} month={activeDate.getMonth() + 1} year={activeDate.getFullYear()} />
      </div>
    </AdminPageShell>
  )
}

export default Dashboard
