import type { ComponentPropsWithoutRef } from 'react'

type PanelProps = ComponentPropsWithoutRef<'div'> & {
  /** `customer` (default) matches the softer storefront look; `admin` matches the tighter admin-console density. */
  variant?: 'customer' | 'admin'
}

const variantClasses: Record<NonNullable<PanelProps['variant']>, string> = {
  customer: 'bg-white rounded-2xl border border-gray-100 shadow-sm',
  admin: 'bg-white rounded-xl border border-[#ececee] shadow-[0_1px_2px_rgba(24,24,27,0.04)]',
}

const Panel = ({ variant = 'customer', className, children, ...rest }: PanelProps) => (
  <div className={`${variantClasses[variant]} ${className ?? ''}`} {...rest}>
    {children}
  </div>
)

export default Panel
