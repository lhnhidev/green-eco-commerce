import type { Icon } from '@phosphor-icons/react'
import { TrendDownIcon, TrendUpIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type StatTone = 'default' | 'primary' | 'warning' | 'danger'

const toneClasses: Record<StatTone, string> = {
  default: 'text-gray-800',
  primary: 'text-primary',
  warning: 'text-amber-600',
  danger: 'text-red-600',
}

type StatProps = {
  label: string
  value: ReactNode
  delta?: { value: number; direction: 'up' | 'down' }
  icon?: Icon
  tone?: StatTone
  className?: string
}

const Stat = ({ label, value, delta, icon: IconComponent, tone = 'default', className }: StatProps) => (
  <div className={`flex flex-col gap-1 ${className ?? ''}`}>
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {IconComponent && <IconComponent size={14} />}
      <span className="text-xs font-medium">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className={`text-xl font-semibold ${toneClasses[tone]}`}>{value}</span>
      {delta && (
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-medium ${
            delta.direction === 'up' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {delta.direction === 'up' ? <TrendUpIcon size={12} /> : <TrendDownIcon size={12} />}
          {delta.value}%
        </span>
      )}
    </div>
  </div>
)

export default Stat
