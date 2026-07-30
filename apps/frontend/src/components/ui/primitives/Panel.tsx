import type { ComponentPropsWithoutRef } from 'react'

type PanelProps = ComponentPropsWithoutRef<'div'> & {
  /** `customer` (default) matches the softer storefront look; `admin` matches the tighter admin-console density. */
  variant?: 'customer' | 'admin'
  /** `none` | `sm` (p-3) | `md` (p-4) | `lg` (p-5, default for customer panels). */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Adds a hover shadow transition for clickable panels. */
  interactive?: boolean
}

const variantClasses: Record<NonNullable<PanelProps['variant']>, string> = {
  customer: 'bg-white rounded-lg border border-border shadow-xs',
  admin: 'bg-white rounded-lg border border-border shadow-2xs',
}

const paddingClasses: Record<NonNullable<PanelProps['padding']>, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

// `padding` defaults to "none" — most call sites still set their own padding via `className`
// until their page is migrated. Pass `padding` explicitly once a page adopts it instead of a
// hand-written p-* class, so the two can never both apply at once.
const Panel = ({ variant = 'customer', padding = 'none', interactive, className, children, ...rest }: PanelProps) => (
  <div
    className={`${variantClasses[variant]} ${paddingClasses[padding]} ${
      interactive ? 'transition-shadow hover:shadow-sm' : ''
    } ${className ?? ''}`}
    {...rest}
  >
    {children}
  </div>
)

export default Panel
