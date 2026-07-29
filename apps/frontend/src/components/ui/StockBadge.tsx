import { Badge } from '@mantine/core'

const LOW_STOCK_THRESHOLD = 10

type StockBadgeProps = {
  stockQty: number
  className?: string
}

const StockBadge = ({ stockQty, className }: StockBadgeProps) => {
  if (stockQty <= 0) {
    return (
      <Badge color="gray" variant="filled" radius="xl" className={className}>
        Out of stock
      </Badge>
    )
  }

  if (stockQty <= LOW_STOCK_THRESHOLD) {
    return (
      <Badge color="orange" variant="filled" radius="xl" className={className}>
        Only {stockQty} left
      </Badge>
    )
  }

  return null
}

export default StockBadge
