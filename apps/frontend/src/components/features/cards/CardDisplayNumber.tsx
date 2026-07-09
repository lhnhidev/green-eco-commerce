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
}

const CardDisplayNumber = ({
  icon,
  title,
  currentData,
  previousData,
  isGrowth,
  showDolarIcon,
  showPercentIcon,
  growthValue,
}: CardDisplayNumberType) => {
  return (
    <div className="border border-gray-400 rounded-xl shadow-sm w-70 max-h-80 p-5">
      <div className="flex justify-between items-center mb-5">
        <div className="rounded-lg bg-[#ccebc7] text-primary px-2 py-1 text-2xl">{icon}</div>
        <div
          className={`flex gap-2 items-center ${isGrowth === 'up' ? 'bg-[#ccebc7]' : isGrowth === 'down' ? 'bg-red-400 text-white' : 'bg-gray-300 text-gray-600'} text-primary px-2 py-1 rounded-2xl`}
        >
          {isGrowth === 'up' ? (
            <FaArrowTrendUp />
          ) : isGrowth === 'down' ? (
            <FaArrowTrendDown />
          ) : (
            <PiApproximateEquals />
          )}
          {growthValue}
          {showPercentIcon && <span>%</span>}
        </div>
      </div>
      <div className="mb-1 font-bold text-gray-600">
        <p>{title}</p>
      </div>
      <div>
        <div>
          <span className="text-gray-600 text-sm">Current data:</span> {showDolarIcon && <span>$</span>}
          {currentData}
        </div>
        <div>
          <span className="text-gray-600 text-sm">Previous data:</span> {showDolarIcon && <span>$</span>}
          {previousData}
        </div>
      </div>
    </div>
  )
}

export default CardDisplayNumber
