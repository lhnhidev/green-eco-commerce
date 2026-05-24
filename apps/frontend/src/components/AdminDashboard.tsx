import { Button, Card, Tabs } from '@mantine/core'
import { ArrowLeftIcon, CurrencyDollarIcon, ShoppingBagIcon, TrendUpIcon, UsersIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLocation } from 'wouter'
import { AdminOrders } from './admin/AdminOrders'
import { AdminOverview } from './admin/AdminOverview'
import { AdminProducts } from './admin/AdminProducts'
import { AdminUsers } from './admin/AdminUsers'
import { adminStats } from './data/adminData'
import { formatCurrency } from './utils/statusHelpers'

export function AdminDashboard() {
  const [, navigate] = useLocation()
  const [activeTab, setActiveTab] = useState<string | null>('overview')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="subtle"
            color="gray"
            onClick={() => navigate('/')}
            leftSection={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Back to Store
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your GreenCart platform</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card shadow="sm" padding="lg" radius="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Total Users</span>
            <UsersIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{adminStats.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-gray-500">+180 from last month</p>
        </Card>
        <Card shadow="sm" padding="lg" radius="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Total Orders</span>
            <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{adminStats.totalOrders.toLocaleString()}</div>
          <p className="text-xs text-gray-500">+12% from last month</p>
        </Card>
        <Card shadow="sm" padding="lg" radius="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Revenue</span>
            <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(adminStats.totalRevenue)}</div>
          <p className="text-xs text-gray-500">+8% from last month</p>
        </Card>
        <Card shadow="sm" padding="lg" radius="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Growth Rate</span>
            <TrendUpIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{adminStats.growthRate}%</div>
          <p className="text-xs text-gray-500">+2.5% from last month</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} color="green.9">
        <Tabs.List grow>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="users">Users</Tabs.Tab>
          <Tabs.Tab value="products">Products</Tabs.Tab>
          <Tabs.Tab value="orders">Orders</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" className="space-y-6 pt-6">
          <AdminOverview />
        </Tabs.Panel>
        <Tabs.Panel value="users" className="space-y-6 pt-6">
          <AdminUsers />
        </Tabs.Panel>
        <Tabs.Panel value="products" className="space-y-6 pt-6">
          <AdminProducts />
        </Tabs.Panel>
        <Tabs.Panel value="orders" className="space-y-6 pt-6">
          <AdminOrders />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
