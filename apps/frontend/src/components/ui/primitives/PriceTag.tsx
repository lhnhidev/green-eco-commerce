import { formatCurrency } from '@utils/formatCurrency'

type PriceTagProps = {
  value: number | null | undefined
  /** Struck-through original price, shown before the current value when provided. */
  compareAt?: number | null
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Tailwind text-color utility, e.g. "text-gray-900". Defaults to the brand primary color. */
  colorClassName?: string
  className?: string
}

const sizeClasses: Record<NonNullable<PriceTagProps['size']>, string> = {
  xs: 'text-xs font-semibold',
  sm: 'text-sm font-semibold',
  md: 'text-md font-semibold',
  lg: 'text-2xl font-bold',
  xl: 'text-3xl font-bold',
}

const PriceTag = ({ value, compareAt, size = 'md', colorClassName = 'text-primary', className }: PriceTagProps) => (
  <span className={`inline-flex items-baseline gap-1.5 ${className ?? ''}`}>
    <span className={`${colorClassName} ${sizeClasses[size]}`}>{formatCurrency(value)}</span>
    {compareAt != null && compareAt > (value ?? 0) && (
      <span className="text-xs text-muted-foreground line-through">{formatCurrency(compareAt)}</span>
    )}
  </span>
)

export default PriceTag
