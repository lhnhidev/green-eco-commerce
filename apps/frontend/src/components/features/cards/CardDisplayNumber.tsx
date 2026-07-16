import type { ReactNode } from 'react'
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6'
import { PiApproximateEquals } from 'react-icons/pi'

type CardDisplayNumberType = {
  icon: ReactNode
  title: string
  isGrowth: 'up' | 'down' | 'balance'
  showDolarIcon: boolean
  showPercentIcon: boolean
  growthValue: string | number
  currentData: string | number
  previousData: string | number
  unit?: string
}

const CardDisplayNumber = ({
  icon,
  title,
  currentData,
  isGrowth,
  showDolarIcon,
  showPercentIcon,
  growthValue,
  unit,
}: CardDisplayNumberType) => {
  const growthColor =
    isGrowth === 'up' ? 'text-primary' : isGrowth === 'down' ? 'text-red-500' : 'text-gray-500'

  return (
    <div className="flex-1 min-w-0 bg-white border border-[#ececee] rounded-xl shadow-[0_1px_2px_rgba(24,24,27,0.04)] px-3.5 py-3">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[#71717a] text-[13px]">{icon}</span>
        <span className="text-[11px] text-[#71717a] truncate">{title}</span>
      </div>

      <div className="text-[20px] font-bold leading-tight text-[#18181b] truncate">
        {showDolarIcon && '$'}
        {currentData}
        {unit && <span className="text-[13px] font-medium ml-0.5">{unit}</span>}
      </div>

      <div className="flex items-center gap-1 mt-1">
        <span className={`flex items-center gap-1 text-[11px] font-semibold ${growthColor}`}>
          {isGrowth === 'up' ? (
            <FaArrowTrendUp size={10} />
          ) : isGrowth === 'down' ? (
            <FaArrowTrendDown size={10} />
          ) : (
            <PiApproximateEquals size={10} />
          )}
          {growthValue}
          {showPercentIcon && '%'}
        </span>
        <span className="text-[11px] text-[#a1a1aa]">vs last month</span>
      </div>
    </div>
  )
}

export default CardDisplayNumber
