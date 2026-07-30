const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export const formatCurrency = (value: number | null | undefined) => currencyFormatter.format(value ?? 0)
