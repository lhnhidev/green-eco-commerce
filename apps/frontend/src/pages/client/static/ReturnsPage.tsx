import StaticPageLayout from '@layouts/StaticPageLayout'
import { Link } from 'react-router'

const ReturnsPage = () => (
  <StaticPageLayout title="Returns & Refunds" path="/returns">
    <h2>30-day guarantee</h2>
    <p>
      If you're not satisfied with a purchase, you can return it within 30 days of delivery for a
      full refund — no questions asked.
    </p>

    <h2>What qualifies</h2>
    <ul>
      <li>The item is unused and in its original condition and packaging.</li>
      <li>The return request is made within 30 days of the delivery date.</li>
    </ul>

    <h2>How to start a return</h2>
    <p>
      Open the order from your <Link to="/my-orders">My Orders</Link> page and{' '}
      <Link to="/contact">contact our support team</Link> with your order number and the reason for
      the return. We'll confirm the return address and next steps by email.
    </p>

    <h2>Refunds</h2>
    <p>
      Once we receive and inspect the returned item, your refund is issued to the original payment
      method. Refunds are typically processed within 5–7 business days of the item arriving back
      with us.
    </p>
  </StaticPageLayout>
)

export default ReturnsPage
