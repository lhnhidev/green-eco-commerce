import type { Icon } from '@phosphor-icons/react'
import { ApproximateEqualsIcon, TrendDownIcon, TrendUpIcon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

type StatCardTone = 'default' | 'primary' | 'warning' | 'danger'

const toneClasses: Record<StatCardTone, string> = {
  default: 'text-[#18181b]',
  primary: 'text-primary',
  warning: 'text-amber-600',
  danger: 'text-red-600',
}

type StatCardProps = {
  label: string
  value: ReactNode
  icon?: Icon
  delta?: { value: number; direction: 'up' | 'down' | 'flat' }
  tone?: StatCardTone
  to?: string
}

// Numbers here are ported verbatim from the admin dashboard's original CardDisplayNumber —
// that density was already correct, so this generalizes its shape without regressing sizing.
const StatCard = ({ label, value, icon: IconComponent, delta, tone = 'default', to }: StatCardProps) => {
  const deltaColor =
    delta?.direction === 'up' ? 'text-primary' : delta?.direction === 'down' ? 'text-red-500' : 'text-gray-500'

  const content = (
    <>
      <div className="flex items-center gap-2 mb-1.5">
        {IconComponent && <IconComponent className="text-muted-foreground" size={13} />}
        <span className="text-[11px] text-muted-foreground truncate">{label}</span>
      </div>
      <div className={`text-[20px] font-bold leading-tight truncate ${toneClasses[tone]}`}>{value}</div>
      {delta && (
        <div className="flex items-center gap-1 mt-1">
          <span className={`flex items-center gap-1 text-[11px] font-semibold ${deltaColor}`}>
            {delta.direction === 'up' ? (
              <TrendUpIcon size={10} />
            ) : delta.direction === 'down' ? (
              <TrendDownIcon size={10} />
            ) : (
              <ApproximateEqualsIcon size={10} />
            )}
            {delta.value}%
          </span>
          <span className="text-[11px] text-fg-subtle">vs last month</span>
        </div>
      )}
    </>
  )

  const className = 'flex-1 min-w-0 bg-white border border-border rounded-lg shadow-2xs px-3.5 py-3'

  if (to) {
    return (
      <Link to={to} className={`${className} block transition-shadow hover:shadow-sm`}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}

export default StatCard
