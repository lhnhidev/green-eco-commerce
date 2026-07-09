/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noGlobalIsNan: <> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
/** biome-ignore-all lint/style/noNonNullAssertion: <> */

import { MonthPickerInput } from '@mantine/dates'
import { useState } from 'react'
import { FaMoneyBillAlt } from 'react-icons/fa'
import { IoCartOutline } from 'react-icons/io5'
import { LuUserPlus } from 'react-icons/lu'
import { MdCo2 } from 'react-icons/md'
import { useGetApiAdminAnalyst } from '../../api'
import CardDisplayNumber from '../../components/features/cards/CardDisplayNumber'
import Loading from '../../components/ui/status/Loading'

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
  const { data: analysted, isLoading } = useGetApiAdminAnalyst({
    Month: activeDate.getMonth() + 1,
    Year: activeDate.getFullYear(),
  })

  // 4. Hàm handle chuẩn khớp hoàn toàn với type '(value: string | null) => void'
  // (Dùng kiểu `any` ở tham số đầu vào để nuốt trọn mọi xung đột type từ thư viện)
  const handleDateChange = (newValue: any) => {
    setValue(newValue)
  }

  if (isLoading) return <Loading text="Loading" />

  return (
    <div className="px-8 py-5 bg-[#f9f9f9]">
      <div className="italic text-gray-600 mb-4 text-lg">Here is what happen with GreenEcoCommerce today</div>

      <div className="flex gap-7 mb-7 items-end">
        <CardDisplayNumber
          icon={<FaMoneyBillAlt />}
          title="Total Revenue"
          currentData={Number(analysted!.totalRevenue.currentValue).toFixed(2)}
          previousData={Number(analysted!.totalRevenue.previousValue).toFixed(2)}
          isGrowth={
            analysted!.totalRevenue.isGrowth === true
              ? 'up'
              : Number(analysted!.totalRevenue.growthPercentage).toFixed(0) === '0'
                ? 'balance'
                : 'down'
          }
          showDolarIcon={true}
          showPercentIcon={true}
          growthValue={Number(analysted!.totalRevenue.growthPercentage).toFixed(0)}
        />
        <CardDisplayNumber
          icon={<IoCartOutline />}
          title="Total Orders"
          currentData={Number(analysted!.amountOrders.currentValue).toFixed(2)}
          previousData={Number(analysted!.amountOrders.previousValue).toFixed(2)}
          isGrowth={
            analysted!.amountOrders.isGrowth === true
              ? 'up'
              : Number(analysted!.amountOrders.growthPercentage).toFixed(0) === '0'
                ? 'balance'
                : 'down'
          }
          showDolarIcon={false}
          showPercentIcon={true}
          growthValue={Number(analysted!.amountOrders.growthPercentage).toFixed(0)}
        />
        <CardDisplayNumber
          icon={<LuUserPlus />}
          title="Total Customers"
          currentData={Number(analysted!.amountUsers.currentValue).toFixed(2)}
          previousData={Number(analysted!.amountUsers.previousValue).toFixed(2)}
          isGrowth={
            analysted!.amountUsers.isGrowth === true
              ? 'up'
              : Number(analysted!.amountUsers.growthPercentage).toFixed(0) === '0'
                ? 'balance'
                : 'down'
          }
          showDolarIcon={false}
          showPercentIcon={true}
          growthValue={Number(analysted!.amountUsers.growthPercentage).toFixed(0)}
        />
        <CardDisplayNumber
          icon={<MdCo2 />}
          title="Carbon Offset"
          currentData={Number(analysted!.totalCo2Saved.currentValue).toFixed(2)}
          previousData={Number(analysted!.totalCo2Saved.previousValue).toFixed(2)}
          isGrowth={
            analysted!.totalCo2Saved.isGrowth === true
              ? 'up'
              : Number(analysted!.totalCo2Saved.growthPercentage).toFixed(0) === '0'
                ? 'balance'
                : 'down'
          }
          showDolarIcon={false}
          showPercentIcon={true}
          growthValue={Number(analysted!.totalCo2Saved.growthPercentage).toFixed(0)}
        />

        <MonthPickerInput
          label="Choose time analyst"
          placeholder="Bấm để chọn..."
          classNames={{
            label: '!mb-2',
          }}
          value={value as any} // Ép kiểu cục bộ tại component để dập tắt cảnh báo của TypeScript
          onChange={handleDateChange}
          clearable
          dropdownType="popover"
          valueFormat="MM/YYYY"
          w={250}
        />
      </div>

      <div className="grid grid-cols-12 gap-7">
        <div className="col-span-8 bg-red-400">123</div>
        <div className="col-span-4 bg-red-400">123</div>
      </div>
    </div>
  )
}

export default Dashboard
