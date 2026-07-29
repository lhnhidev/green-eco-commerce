import { formatCurrency } from '@utils/formatCurrency'

type PriceTagProps = {
  value: number | null | undefined
  size?: 'sm' | 'md' | 'lg'
  /** Tailwind text-color utility, e.g. "text-gray-900". Defaults to the brand primary color. */
  colorClassName?: string
  className?: string
}

const sizeClasses: Record<NonNullable<PriceTagProps['size']>, string> = {
  sm: 'text-sm font-bold',
  md: 'text-lg font-extrabold',
  lg: 'text-2xl font-extrabold',
}

const PriceTag = ({ value, size = 'md', colorClassName = 'text-primary', className }: PriceTagProps) => (
  <span className={`${colorClassName} ${sizeClasses[size]} ${className ?? ''}`}>{formatCurrency(value)}</span>
)

export default PriceTag
