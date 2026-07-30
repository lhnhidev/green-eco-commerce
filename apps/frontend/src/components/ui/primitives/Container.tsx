import type { ComponentPropsWithoutRef } from 'react'

type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  /** `page` (1280, default) | `wide` (1440, catalog/admin) | `narrow` (720, forms/static pages). */
  width?: 'page' | 'wide' | 'narrow'
}

const widthClasses: Record<NonNullable<ContainerProps['width']>, string> = {
  page: 'max-w-(--container-page)',
  wide: 'max-w-(--container-wide)',
  narrow: 'max-w-[720px]',
}

const Container = ({ width = 'page', className, children, ...rest }: ContainerProps) => (
  <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${widthClasses[width]} ${className ?? ''}`} {...rest}>
    {children}
  </div>
)

export default Container
