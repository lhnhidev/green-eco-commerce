import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type EmptyStateColor = 'green' | 'rose' | 'gray' | 'amber' | 'red'

const colorClasses: Record<EmptyStateColor, { bg: string; text: string }> = {
  green: { bg: 'bg-green-50', text: 'text-green-500' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-500' },
  gray: { bg: 'bg-gray-50', text: 'text-gray-400' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-500' },
  red: { bg: 'bg-red-50', text: 'text-red-500' },
}

const sizeClasses = {
  sm: { padding: 'py-10 px-4', circle: 'w-12 h-12', icon: 20, title: 'text-md' },
  md: { padding: 'py-14 px-4', circle: 'w-14 h-14', icon: 24, title: 'text-lg' },
}

type EmptyStateProps = {
  icon: Icon
  title?: string
  description?: string
  action?: ReactNode
  color?: EmptyStateColor
  /** `sm` (default): py-10, circle 48. `md`: py-14, circle 56. */
  size?: 'sm' | 'md'
  /** Override the default padding classes entirely — e.g. "py-4" for a tighter fit inside a table cell. */
  className?: string
}

const EmptyState = ({
  icon: IconComponent,
  title,
  description,
  action,
  color = 'green',
  size = 'sm',
  className,
}: EmptyStateProps) => {
  const { bg, text } = colorClasses[color]
  const { padding, circle, icon, title: titleClass } = sizeClasses[size]

  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center ${className ?? padding}`}>
      <div className={`${circle} ${bg} rounded-full flex items-center justify-center`}>
        <IconComponent className={text} weight="bold" size={icon} />
      </div>
      {title && <p className={`font-semibold text-gray-800 ${titleClass}`}>{title}</p>}
      {description && <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">{description}</p>}
      {action}
    </div>
  )
}

export default EmptyState
