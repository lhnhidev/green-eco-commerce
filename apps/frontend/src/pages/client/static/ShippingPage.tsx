import StaticPageLayout from '@layouts/StaticPageLayout'
import { Link } from 'react-router'

const ShippingPage = () => (
  <StaticPageLayout title="Shipping Policy" path="/shipping">
    <h2>Free shipping, every order</h2>
    <p>
      Shipping is free on every GreenCart order — there's no minimum order size and no separate shipping line at
      checkout. The total you see when you place your order is the total you pay.
    </p>

    <h2>Delivery timeframe</h2>
    <p>
      Orders are typically packed within 1–2 business days and delivered within 3–7 business days, depending on your
      location. You can track the status of any order from your <Link to="/my-orders">My Orders</Link> page.
    </p>

    <h2>Payment on delivery</h2>
    <p>
      Choose Cash on Delivery at checkout to pay when your order arrives, or pay upfront by bank transfer or MoMo
      Wallet.
    </p>

    <h2>Packaging</h2>
    <p>
      We ship in minimal, recyclable packaging wherever possible — it's part of keeping the carbon footprint of your
      order as low as the products inside it.
    </p>
  </StaticPageLayout>
)

export default ShippingPage
