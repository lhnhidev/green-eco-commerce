import PageBreadcrumbs, { type PageBreadcrumbItem } from '@components/ui/PageBreadcrumbs'
import type { Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  breadcrumbItems: PageBreadcrumbItem[]
  icon: Icon
  iconClassName?: string
  title: string
  /** Rendered right after the title — e.g. an item count like "(3 items)". */
  suffix?: ReactNode
  /** Right-aligned controls — buttons, filters, etc. */
  actions?: ReactNode
}

const PageHeader = ({ breadcrumbItems, icon: IconComponent, iconClassName, title, suffix, actions }: PageHeaderProps) => (
  <>
    <PageBreadcrumbs items={breadcrumbItems} mb="lg" />
    <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
      <div className="flex items-center gap-3">
        <IconComponent className={iconClassName ?? 'text-2xl text-primary'} />
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {suffix}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  </>
)

export default PageHeader
