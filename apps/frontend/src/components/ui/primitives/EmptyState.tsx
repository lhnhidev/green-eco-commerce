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

type EmptyStateProps = {
  icon: Icon
  title?: string
  description?: string
  action?: ReactNode
  color?: EmptyStateColor
  /** Padding classes, e.g. "py-16 px-4" (the default) or "py-4" for a tighter fit inside a table cell. */
  className?: string
}

const EmptyState = ({ icon: IconComponent, title, description, action, color = 'green', className }: EmptyStateProps) => {
  const { bg, text } = colorClasses[color]

  return (
    <div className={`flex flex-col items-center justify-center gap-3 text-center ${className ?? 'py-16 px-4'}`}>
      <div className={`w-20 h-20 ${bg} rounded-full flex items-center justify-center mb-2`}>
        <IconComponent className={text} weight="bold" size={32} />
      </div>
      {title && <p className="font-bold text-gray-800 text-lg">{title}</p>}
      {description && <p className="text-sm text-gray-400 max-w-sm leading-relaxed">{description}</p>}
      {action}
    </div>
  )
}

export default EmptyState
