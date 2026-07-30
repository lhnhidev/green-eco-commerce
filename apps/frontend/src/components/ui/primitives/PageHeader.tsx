import PageBreadcrumbs, { type PageBreadcrumbItem } from '@components/ui/PageBreadcrumbs'
import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  breadcrumbItems?: PageBreadcrumbItem[]
  icon?: Icon
  iconClassName?: string
  title: string
  subtitle?: string
  /** Rendered right after the title — e.g. an item count like "(3 items)". */
  suffix?: ReactNode
  /** Right-aligned controls — buttons, filters, etc. */
  actions?: ReactNode
  /** `default` (storefront, text-2xl) or `compact` (admin, text-xl). */
  density?: 'default' | 'compact'
}

const PageHeader = ({
  breadcrumbItems,
  icon: IconComponent,
  iconClassName,
  title,
  subtitle,
  suffix,
  actions,
  density = 'default',
}: PageHeaderProps) => (
  <>
    {breadcrumbItems && <PageBreadcrumbs items={breadcrumbItems} mb="sm" />}
    <div className={`flex items-center justify-between gap-3 flex-wrap ${density === 'compact' ? 'mb-3' : 'mb-5'}`}>
      <div>
        <div className="flex items-center gap-2">
          {IconComponent && <IconComponent className={iconClassName ?? 'text-xl text-primary'} />}
          <h1 className={`font-semibold text-gray-800 ${density === 'compact' ? 'text-xl' : 'text-2xl'}`}>{title}</h1>
          {suffix}
        </div>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  </>
)

export default PageHeader
