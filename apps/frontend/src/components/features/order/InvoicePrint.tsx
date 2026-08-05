import type { OrderDto } from '@api/schemas'
import { formatCurrency } from '@utils/formatCurrency'
import dayjs from 'dayjs'

// Rendered into a hidden container and printed via window.print(), styled by the
// @media print block in src/index.css — replaces the old window.open + innerHTML approach.
const InvoicePrint = ({ order }: { order: OrderDto }) => (
  <div id="invoice-print" className="hidden print:block text-sm">
    <div className="flex justify-between border-b-2 border-gray-100 pb-5 mb-6">
      <div>
        <h1 className="text-xl font-semibold text-primary m-0">Green Eco Commerce</h1>
        <p className="text-gray-500 mt-1">Invoice &amp; Shipping Label</p>
      </div>
      <div className="text-right">
        <p className="m-0">
          <strong>Order ID:</strong> #{order.id.slice(-8).toUpperCase()}
        </p>
        <p className="mt-1">
          <strong>Date:</strong> {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
        </p>
        <p className="mt-1">
          <strong>Status:</strong> {order.status}
        </p>
      </div>
    </div>

    <div className="mb-6">
      <h3 className="mb-2">Delivery Details</h3>
      <p className="font-semibold">{order.deliveryAddress}</p>
    </div>

    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border border-gray-200 p-3 text-left bg-gray-50">Product</th>
          <th className="border border-gray-200 p-3 text-left bg-gray-50">Unit Price</th>
          <th className="border border-gray-200 p-3 text-left bg-gray-50">Qty</th>
          <th className="border border-gray-200 p-3 text-right bg-gray-50">Amount</th>
        </tr>
      </thead>
      <tbody>
        {order.items.map((item) => (
          <tr key={item.productId}>
            <td className="border border-gray-200 p-3">{item.productName}</td>
            <td className="border border-gray-200 p-3">{formatCurrency(item.unitPrice)}</td>
            <td className="border border-gray-200 p-3">{item.quantity}</td>
            <td className="border border-gray-200 p-3 text-right">{formatCurrency(item.unitPrice * item.quantity)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="text-right mt-5">
      <p>Subtotal: {formatCurrency(order.totalAmount)}</p>
      <p>Discount: -{formatCurrency(order.discountAmount)}</p>
      <p className="text-lg font-bold text-primary mt-2">Total: {formatCurrency(order.finalAmount)}</p>
    </div>
  </div>
)

export default InvoicePrint
