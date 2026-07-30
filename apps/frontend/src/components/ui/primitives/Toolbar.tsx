import type { ReactNode } from 'react'

type ToolbarProps = {
  left?: ReactNode
  right?: ReactNode
  /** Sticks below the site/admin header while scrolling — used on the catalog and admin list toolbars. */
  sticky?: boolean
  /** `sm` (admin, py-2) or `md` (storefront, py-3, default). */
  density?: 'sm' | 'md'
  className?: string
}

const Toolbar = ({ left, right, sticky, density = 'md', className }: ToolbarProps) => (
  <div
    className={`flex items-center justify-between gap-3 flex-wrap ${density === 'sm' ? 'py-2' : 'py-3'} ${
      sticky ? 'sticky top-(--spacing-header) z-20 bg-white/95 backdrop-blur border-b border-border' : ''
    } ${className ?? ''}`}
  >
    <div className="flex items-center gap-2 flex-wrap min-w-0">{left}</div>
    {right && <div className="flex items-center gap-2 flex-wrap">{right}</div>}
  </div>
)

export default Toolbar
