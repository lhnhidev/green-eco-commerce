import Container from '@components/ui/primitives/Container'
import Prose from '@components/ui/primitives/Prose'
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
    <Container width="narrow" className="py-8">
      <Seo title={title} />
      <PageBreadcrumbs items={breadcrumbItems} mb="sm" />
      <h1 className="text-2xl font-semibold text-gray-900 mb-5">{title}</h1>
      <Prose size="md">{children}</Prose>
    </Container>
  )
}

export default StaticPageLayout
