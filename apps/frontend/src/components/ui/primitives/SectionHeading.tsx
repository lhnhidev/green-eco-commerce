import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  icon?: Icon
  children: ReactNode
  description?: string
  /** Right-aligned slot — e.g. a "View all" link. */
  action?: ReactNode
  /** `sm` (16px, default) or `md` (18px) — pick `md` for top-level page sections. */
  size?: 'sm' | 'md'
  /** Spacing/layout classes for the wrapping div — e.g. "mb-4". No default, since it varies by context. */
  className?: string
}

const sizeClasses: Record<NonNullable<SectionHeadingProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-xl',
}

const SectionHeading = ({
  icon: IconComponent,
  children,
  description,
  action,
  size = 'sm',
  className,
}: SectionHeadingProps) => (
  <div className={`flex items-center justify-between gap-3 ${className ?? ''}`}>
    <div className="flex items-center gap-2">
      {IconComponent && <IconComponent className="text-lg text-primary" />}
      <div>
        <h2 className={`font-semibold text-gray-800 ${sizeClasses[size]}`}>{children}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
    {action}
  </div>
)

export default SectionHeading
