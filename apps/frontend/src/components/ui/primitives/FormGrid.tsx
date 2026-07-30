import type { ReactNode } from 'react'

type FormGridProps = {
  cols?: 1 | 2
  children: ReactNode
}

const FormGrid = ({ cols = 2, children }: FormGridProps) => (
  <div className={`grid gap-4 ${cols === 2 ? 'md:grid-cols-2' : ''}`}>{children}</div>
)

export default FormGrid
