import { Navigate } from 'react-router'

// The checkout flow moved to /checkout (see CheckoutPage.tsx) — this route
// stays only so old bookmarks/links to /payment keep working.
const PaymentPage = () => <Navigate to="/checkout" replace />

export default PaymentPage
