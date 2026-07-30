import StaticPageLayout from '@layouts/StaticPageLayout'
import { Link } from 'react-router'

const TermsPage = () => (
  <StaticPageLayout title="Terms of Service" path="/terms">
    <p className="text-sm text-gray-400 italic">Last updated: {new Date().getFullYear()}</p>

    <h2>Using GreenCart</h2>
    <p>
      By creating an account or placing an order, you agree to provide accurate information and to use GreenCart only
      for lawful purposes.
    </p>

    <h2>Orders & payment</h2>
    <p>
      Placing an order is an offer to purchase at the price shown at checkout. We accept Cash on Delivery, bank
      transfer, and MoMo Wallet. Shipping is free on every order.
    </p>

    <h2>Green Points</h2>
    <p>
      Green Points are awarded per order based on the CO₂ savings of the items purchased and can be redeemed for a
      discount on a future order. Points have no cash value and cannot be transferred between accounts.
    </p>

    <h2>Returns</h2>
    <p>
      Our full return and refund terms are described in the <Link to="/returns">Returns & Refunds</Link> policy.
    </p>

    <h2>Changes to these terms</h2>
    <p>We may update these terms from time to time; continued use of GreenCart means you accept the current version.</p>

    <h2>Contact</h2>
    <p>Questions about these terms can be sent to support@greencart.com.</p>
  </StaticPageLayout>
)

export default TermsPage
