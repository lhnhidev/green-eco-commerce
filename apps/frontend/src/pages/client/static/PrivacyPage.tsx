import StaticPageLayout from '@layouts/StaticPageLayout'

const PrivacyPage = () => (
  <StaticPageLayout title="Privacy Policy" path="/privacy">
    <p className="text-sm text-gray-400 italic">Last updated: {new Date().getFullYear()}</p>

    <h2>Information we collect</h2>
    <p>
      When you create an account, we collect your name, email, phone number, and delivery address.
      When you place an order, we store the items, delivery address, and payment method you chose
      so we can fulfill and let you track that order.
    </p>

    <h2>How we use your information</h2>
    <ul>
      <li>To process and deliver your orders.</li>
      <li>To let you sign in and manage your account, wishlist, and order history.</li>
      <li>To calculate and award Green Points on eligible purchases.</li>
      <li>To respond to support requests you send us.</li>
    </ul>

    <h2>What we don't do</h2>
    <p>We don't sell your personal information to third parties.</p>

    <h2>Your choices</h2>
    <p>
      You can review and update your account details at any time from your Profile page, or contact
      us to request that your account be deleted.
    </p>

    <h2>Contact</h2>
    <p>Questions about this policy can be sent to support@greencart.com.</p>
  </StaticPageLayout>
)

export default PrivacyPage
