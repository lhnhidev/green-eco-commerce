import { Button, Card, Tabs } from '@mantine/core'
import { ArrowLeftIcon, CurrencyDollarIcon, PackageIcon, ShoppingBagIcon, TrendUpIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { useLocation } from 'wouter'
import { SellerAnalytics } from './seller/SellerAnalytics'
import { SellerOrders } from './seller/SellerOrders'
import { SellerProducts } from './seller/SellerProducts'
import { formatCurrency } from './utils/statusHelpers'

export function SellerDashboard() {
  const [, navigate] = useLocation()
  const [activeTab, setActiveTab] = useState<string | null>('products')

  const sellerStats = {
    totalProducts: 24,
    totalOrders: 156,
    totalRevenue: 8750,
    pendingOrders: 12,
  }

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
            <h1 className="text-3xl font-bold text-primary">Seller Dashboard</h1>
            <p className="text-gray-500">Manage your plant business</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card shadow="sm" padding="lg" radius="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Total Products</span>
            <PackageIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{sellerStats.totalProducts}</div>
          <p className="text-xs text-gray-500">+3 added this month</p>
        </Card>
        <Card shadow="sm" padding="lg" radius="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Total Orders</span>
            <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{sellerStats.totalOrders}</div>
          <p className="text-xs text-gray-500">+18 from last month</p>
        </Card>
        <Card shadow="sm" padding="lg" radius="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Revenue</span>
            <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{formatCurrency(sellerStats.totalRevenue)}</div>
          <p className="text-xs text-gray-500">+15% from last month</p>
        </Card>
        <Card shadow="sm" padding="lg" radius="md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Pending Orders</span>
            <TrendUpIcon className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold">{sellerStats.pendingOrders}</div>
          <p className="text-xs text-gray-500">Need attention</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={setActiveTab} color="green.9">
        <Tabs.List grow>
          <Tabs.Tab value="products">Products</Tabs.Tab>
          <Tabs.Tab value="orders">Orders</Tabs.Tab>
          <Tabs.Tab value="analytics">Analytics</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="products" className="space-y-6 pt-6">
          <SellerProducts />
        </Tabs.Panel>
        <Tabs.Panel value="orders" className="space-y-6 pt-6">
          <SellerOrders />
        </Tabs.Panel>
        <Tabs.Panel value="analytics" className="space-y-6 pt-6">
          <SellerAnalytics />
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
