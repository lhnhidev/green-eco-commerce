export const getStatusBadgeColor = (status: string) => {
  const statusConfig: Record<string, string> = {
    'completed': 'green',
    'processing': 'blue',
    'shipped': 'violet',
    'pending': 'yellow',
    'active': 'green',
    'inactive': 'gray',
    'out-of-stock': 'red',
    'low-stock': 'yellow'
  }
  return statusConfig[status] || 'gray'
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
