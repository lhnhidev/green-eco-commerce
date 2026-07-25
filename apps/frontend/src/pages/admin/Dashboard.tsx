/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noGlobalIsNan: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/style/noNonNullAssertion: <> */

import { useGetInfoAnalyst } from '@api'
import CardDisplayNumber from '@components/features/cards/CardDisplayNumber'
import LowStockProducts from '@components/features/dashboard/LowStockProducts'
import MonthlyStatisticsChart from '@components/features/dashboard/MonthlyStatisticsChart'
import RecentOrders from '@components/features/dashboard/RecentOrders'
import Loading from '@components/ui/status/Loading'
import { MonthPickerInput } from '@mantine/dates'
import { useState } from 'react'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { LuUserPlus } from 'react-icons/lu'
import { MdCo2 } from 'react-icons/md'

const Dashboard = () => {
  // 1. Chuyển đổi State sang kiểu Date | string | null để tương thích hoàn toàn với prop `value` và `onChange`
  const [value, setValue] = useState<Date | string | null>(new Date())

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
    Month: activeDate.getMonth() + 1,
    Year: activeDate.getFullYear(),
  })

  // 4. Hàm handle chuẩn khớp hoàn toàn với type '(value: string | null) => void'
  // (Dùng kiểu `any` ở tham số đầu vào để nuốt trọn mọi xung đột type từ thư viện)
  const handleDateChange = (newValue: any) => {
    setValue(newValue)
  }

  if (isLoading) return <Loading text="Loading" />

  const getGrowth = (m: { isGrowth?: boolean; growthPercentage?: number }) =>
    m.isGrowth === true ? 'up' : Number(m.growthPercentage).toFixed(0) === '0' ? 'balance' : 'down'

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[13px] text-muted-foreground">Overview of store performance</div>
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

      <div className="flex gap-2.5 mb-2.5">
        <CardDisplayNumber
          icon={<FaMoneyBillAlt />}
          title="Total Revenue"
          currentData={Number(analysted!.totalRevenue.currentValue).toLocaleString('en-US', {
            maximumFractionDigits: 0,
          })}
          previousData={Number(analysted!.totalRevenue.previousValue).toFixed(2)}
          isGrowth={getGrowth(analysted!.totalRevenue)}
          showDolarIcon={true}
          showPercentIcon={true}
          growthValue={Number(analysted!.totalRevenue.growthPercentage).toFixed(1)}
        />
        <CardDisplayNumber
          icon={<IoCartOutline />}
          title="Total Orders"
          currentData={Number(analysted!.amountOrders.currentValue).toFixed(0)}
          previousData={Number(analysted!.amountOrders.previousValue).toFixed(0)}
          isGrowth={getGrowth(analysted!.amountOrders)}
          showDolarIcon={false}
          showPercentIcon={true}
          growthValue={Number(analysted!.amountOrders.growthPercentage).toFixed(1)}
        />
        <CardDisplayNumber
          icon={<LuUserPlus />}
          title="New Users"
          currentData={Number(analysted!.amountUsers.currentValue).toFixed(0)}
          previousData={Number(analysted!.amountUsers.previousValue).toFixed(0)}
          isGrowth={getGrowth(analysted!.amountUsers)}
          showDolarIcon={false}
          showPercentIcon={true}
          growthValue={Number(analysted!.amountUsers.growthPercentage).toFixed(1)}
        />
        <CardDisplayNumber
          icon={<MdCo2 />}
          title="CO₂ Saved"
          currentData={Number(analysted!.totalCo2Saved.currentValue).toFixed(1)}
          previousData={Number(analysted!.totalCo2Saved.previousValue).toFixed(1)}
          isGrowth={getGrowth(analysted!.totalCo2Saved)}
          showDolarIcon={false}
          showPercentIcon={true}
          growthValue={Number(analysted!.totalCo2Saved.growthPercentage).toFixed(1)}
          unit="kg"
        />
      </div>

      <div className="grid grid-cols-12 gap-2.5 mb-2.5">
        <div className="col-span-8">
          <RecentOrders />
        </div>
        <div className="col-span-4">
          <LowStockProducts />
        </div>
      </div>

      <MonthlyStatisticsChart year={activeDate.getFullYear()} />
    </div>
  )
}

export default Dashboard
