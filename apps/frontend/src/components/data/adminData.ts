export const adminStats = {
  totalUsers: 2547,
  totalOrders: 1832,
  totalRevenue: 45670,
  growthRate: 12.5
}

export const recentOrders = [
  {
    id: '#12345',
    customer: 'Sarah Johnson',
    items: 3,
    total: 127.50,
    status: 'completed',
    date: '2025-01-10'
  },
  {
    id: '#12346',
    customer: 'Mike Chen',
    items: 1,
    total: 45.00,
    status: 'processing',
    date: '2025-01-10'
  },
  {
    id: '#12347',
    customer: 'Emma Wilson',
    items: 5,
    total: 235.75,
    status: 'shipped',
    date: '2025-01-09'
  },
  {
    id: '#12348',
    customer: 'David Brown',
    items: 2,
    total: 89.50,
    status: 'pending',
    date: '2025-01-09'
  }
]

export const users = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    role: 'Customer',
    joinDate: '2024-06-15',
    orders: 12,
    status: 'active'
  },
  {
    id: 2,
    name: 'Green Garden Co.',
    email: 'seller@greengarden.com',
    role: 'Seller',
    joinDate: '2024-03-20',
    orders: 245,
    status: 'active'
  },
  {
    id: 3,
    name: 'Mike Chen',
    email: 'mike@email.com',
    role: 'Customer',
    joinDate: '2024-11-01',
    orders: 3,
    status: 'active'
  },
  {
    id: 4,
    name: 'Inactive User',
    email: 'inactive@email.com',
    role: 'Customer',
    joinDate: '2024-01-10',
    orders: 1,
    status: 'inactive'
  }
]

export const products = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Indoor Plants',
    price: 45,
    stock: 24,
    sold: 156,
    status: 'active'
  },
  {
    id: 2,
    name: 'Peace Lily',
    category: 'Indoor Plants',
    price: 28,
    stock: 0,
    sold: 89,
    status: 'out-of-stock'
  },
  {
    id: 3,
    name: 'Snake Plant',
    category: 'Indoor Plants',
    price: 35,
    stock: 18,
    sold: 201,
    status: 'active'
  },
  {
    id: 4,
    name: 'Fiddle Leaf Fig',
    category: 'Indoor Plants',
    price: 85,
    stock: 7,
    sold: 67,
    status: 'low-stock'
  }
]
