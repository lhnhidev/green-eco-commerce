import { Anchor, Breadcrumbs, type BreadcrumbsProps } from '@mantine/core'
import { Link } from 'react-router'

export type PageBreadcrumbItem = {
  title: string
  href: string
}

type PageBreadcrumbsProps = Omit<BreadcrumbsProps, 'children'> & {
  items: PageBreadcrumbItem[]
}

const PageBreadcrumbs = ({ items, ...breadcrumbsProps }: PageBreadcrumbsProps) => (
  <Breadcrumbs {...breadcrumbsProps}>
    {items.map((item) => (
      <Anchor component={Link} to={item.href} key={item.href} size="sm">
        {item.title}
      </Anchor>
    ))}
  </Breadcrumbs>
)

export default PageBreadcrumbs
