import type { ReactNode } from 'react'
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6'

type CardDisplayNumberType = {
  icon: ReactNode
  title: string
  subtitle: string | number
  isGrowth: boolean
  showDolarIcon: boolean
  showPercentIcon: boolean
  growthValue: number
}

const CardDisplayNumber = ({
  icon,
  title,
  subtitle,
  isGrowth,
  showDolarIcon,
  showPercentIcon,
  growthValue,
}: CardDisplayNumberType) => {
  return (
    <div className="border border-gray-400 rounded-xl shadow-sm w-70 max-h-80 p-5">
      <div className="flex justify-between items-center mb-5">
        <div className="rounded-lg bg-[#ccebc7] text-primary px-2 py-1 text-2xl">{icon}</div>
        <div className="flex gap-2 items-center bg-[#ccebc7] text-primary px-2 py-1 rounded-2xl">
          {isGrowth === true ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
          {growthValue}
          {showPercentIcon && <span>%</span>}
        </div>
      </div>
      <div className="mb-1 font-bold text-gray-600">
        <p>
          {showDolarIcon && <span>$</span>}
          {title}
        </p>
      </div>
      <div>${subtitle}</div>
    </div>
  )
}

export default CardDisplayNumber
