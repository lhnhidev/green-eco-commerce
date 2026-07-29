/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noGlobalIsNan: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/style/noNonNullAssertion: <> */

import { useGetInfoAnalyst } from '@api'
import CardDisplayNumber from '@components/features/cards/CardDisplayNumber'
import BestSellingProducts from '@components/features/products/BestSellingProducts'
import LowStockProducts from '@components/features/dashboard/LowStockProducts'
import MonthlyStatisticsChart from '@components/features/dashboard/MonthlyStatisticsChart'
import RecentOrders from '@components/features/dashboard/RecentOrders'
import Loading from '@components/ui/status/Loading'
import { Button } from '@mantine/core'
import { MonthPickerInput } from '@mantine/dates'
import { notifications } from '@mantine/notifications'
import { DownloadSimpleIcon, MoneyIcon, ShoppingCartIcon, UserIcon } from '@phosphor-icons/react'
import { downloadFile } from '@utils/downloadFile'
import { useState } from 'react'
import { MdCo2 } from 'react-icons/md'

const Dashboard = () => {
  // 1. Chuyển đổi State sang kiểu Date | string | null để tương thích hoàn toàn với prop `value` và `onChange`
  const [value, setValue] = useState<Date | string | null>(new Date())
  const [exporting, setExporting] = useState(false)

  // 2. Hàm phụ trợ để an toàn lấy ra đối tượng Date thực sự từ State (dù nó là string hay Date)
  const getDateObject = (val: Date | string | null): Date => {
    if (!val) return new Date()
    if (val instanceof Date) return val
    const parsed = new Date(val)
    return isNaN(parsed.getTime()) ? new Date() : parsed
  }

  const activeDate = getDateObject(value)

  // 3. Truyền tháng/năm chuẩn vào API thông qua biến activeDate đã parse
  const { data: analysted, isLoading } = useGetInfoAnalyst({
    month: activeDate.getMonth() + 1,
    year: activeDate.getFullYear(),
  })

  // 4. Hàm handle chuẩn khớp hoàn toàn với type '(value: string | null) => void'
  // (Dùng kiểu `any` ở tham số đầu vào để nuốt trọn mọi xung đột type từ thư viện)
  const handleDateChange = (newValue: any) => {
    setValue(newValue)
  }

  if (isLoading) return <Loading text="Loading" />

  const getGrowth = (m: { isGrowth?: boolean; growthPercentage?: number }) =>
    m.isGrowth === true ? 'up' : Number(m.growthPercentage).toFixed(0) === '0' ? 'balance' : 'down'

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

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] text-muted-foreground">Overview of store performance</div>
        <div className="flex items-center gap-2">
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
            value={value as any}
            onChange={handleDateChange}
            clearable
            size="xs"
            dropdownType="popover"
            valueFormat="MM/YYYY"
            w={140}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-2.5">
        <CardDisplayNumber
          icon={<MoneyIcon weight="fill" />}
          title="Total Revenue"
          currentData={Number(analysted!.totalRevenue.currentValue).toLocaleString('en-US', {
            maximumFractionDigits: 0,
          })}
          previousData={Number(analysted!.totalRevenue.previousValue).toFixed(2)}
          isGrowth={getGrowth(analysted!.totalRevenue)}
          showDollarIcon={true}
          showPercentIcon={true}
          growthValue={Number(analysted!.totalRevenue.growthPercentage).toFixed(1)}
        />
        <CardDisplayNumber
          icon={<ShoppingCartIcon />}
          title="Total Orders"
          currentData={Number(analysted!.amountOrders.currentValue).toFixed(0)}
          previousData={Number(analysted!.amountOrders.previousValue).toFixed(0)}
          isGrowth={getGrowth(analysted!.amountOrders)}
          showDollarIcon={false}
          showPercentIcon={true}
          growthValue={Number(analysted!.amountOrders.growthPercentage).toFixed(1)}
        />
        <CardDisplayNumber
          icon={<UserIcon />}
          title="New Users"
          currentData={Number(analysted!.amountUsers.currentValue).toFixed(0)}
          previousData={Number(analysted!.amountUsers.previousValue).toFixed(0)}
          isGrowth={getGrowth(analysted!.amountUsers)}
          showDollarIcon={false}
          showPercentIcon={true}
          growthValue={Number(analysted!.amountUsers.growthPercentage).toFixed(1)}
        />
        <CardDisplayNumber
          icon={<MdCo2 />}
          title="CO₂ Saved"
          currentData={Number(analysted!.totalCo2Saved.currentValue).toFixed(1)}
          previousData={Number(analysted!.totalCo2Saved.previousValue).toFixed(1)}
          isGrowth={getGrowth(analysted!.totalCo2Saved)}
          showDollarIcon={false}
          showPercentIcon={true}
          growthValue={Number(analysted!.totalCo2Saved.growthPercentage).toFixed(1)}
          unit="kg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 mb-2.5">
        <div className="lg:col-span-8">
          <RecentOrders />
        </div>
        <div className="lg:col-span-4">
          <LowStockProducts />
        </div>
      </div>

      <MonthlyStatisticsChart year={activeDate.getFullYear()} />

      <div className="mt-4">
        <BestSellingProducts top={10} />
      </div>
    </div>
  )
}

export default Dashboard
