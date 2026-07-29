import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Seo from '@components/ui/Seo'
import type { ReactNode } from 'react'

type StaticPageLayoutProps = {
  title: string
  path: string
  children: ReactNode
}

const StaticPageLayout = ({ title, path, children }: StaticPageLayoutProps) => {
  const breadcrumbItems = [
    { title: 'Home', href: '/' },
    { title, href: path },
  ]

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Seo title={title} />
      <PageBreadcrumbs items={breadcrumbItems} mb="lg" />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      <div className="prose prose-sm md:prose-base prose-green max-w-none text-gray-600 leading-relaxed">
        {children}
      </div>
    </div>
  )
}

export default StaticPageLayout
