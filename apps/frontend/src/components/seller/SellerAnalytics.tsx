import { Card } from '@mantine/core'
import { formatCurrency } from '../utils/statusHelpers'

export function SellerAnalytics() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card shadow="sm" padding="lg" radius="md">
        <h3 className="text-lg font-bold mb-4">Monthly Performance</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>This Month</span>
            <span className="font-semibold">{formatCurrency(2850)}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Month</span>
            <span className="font-semibold">{formatCurrency(2400)}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Growth</span>
            <span className="font-semibold">+18.8%</span>
          </div>
        </div>
      </Card>

      <Card shadow="sm" padding="lg" radius="md">
        <h3 className="text-lg font-bold mb-4">Top Selling Products</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Snake Plant</span>
            <span className="font-semibold">45 sold</span>
          </div>
          <div className="flex justify-between">
            <span>Monstera Deliciosa</span>
            <span className="font-semibold">38 sold</span>
          </div>
          <div className="flex justify-between">
            <span>Peace Lily</span>
            <span className="font-semibold">32 sold</span>
          </div>
          <div className="flex justify-between">
            <span>Fiddle Leaf Fig</span>
            <span className="font-semibold">28 sold</span>
          </div>
        </div>
      </Card>

      <Card shadow="sm" padding="lg" radius="md">
        <h3 className="text-lg font-bold mb-4">Customer Ratings</h3>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Average Rating</span>
            <span className="font-semibold">4.8/5</span>
          </div>
          <div className="flex justify-between">
            <span>Total Reviews</span>
            <span className="font-semibold">234</span>
          </div>
          <div className="flex justify-between">
            <span>5 Star Reviews</span>
            <span className="font-semibold">78%</span>
          </div>
          <div className="flex justify-between">
            <span>Return Rate</span>
            <span className="font-semibold">2.1%</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
