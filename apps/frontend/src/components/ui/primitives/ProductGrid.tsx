import type { ReactNode } from 'react'

type ProductGridProps = {
  children: ReactNode
  /** `catalog`: a filter rail is present alongside the grid (max 4 cols). `showcase`: full-width (max 4 cols, earlier breakpoint). */
  variant?: 'catalog' | 'showcase'
  className?: string
}

const variantClasses: Record<NonNullable<ProductGridProps['variant']>, string> = {
  catalog: 'grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 xl:grid-cols-4',
  showcase: 'grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
}

const ProductGrid = ({ children, variant = 'showcase', className }: ProductGridProps) => (
  <div className={`${variantClasses[variant]} ${className ?? ''}`}>{children}</div>
)

export default ProductGrid
