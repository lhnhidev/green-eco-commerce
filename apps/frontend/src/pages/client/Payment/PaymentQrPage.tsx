import Container from '@components/ui/primitives/Container'
import { useSearchParams } from 'react-router'
import PaymentQr from './PaymentQr'

// Standalone route for a QR payment link (e.g. shared for a specific amount) — the checkout
// flow itself renders <PaymentQr> directly inside a Modal instead of navigating here.
const PaymentQrPage = () => {
  const [searchParams] = useSearchParams()
  const amount = Number(searchParams.get('amount') ?? 0)

  if (!amount || Number.isNaN(amount)) {
    return (
      <Container width="narrow" className="py-10 text-center text-sm text-muted-foreground">
        No payment amount specified.
      </Container>
    )
  }

  return (
    <Container width="narrow" className="py-10">
      <PaymentQr amount={amount} />
    </Container>
  )
}

export default PaymentQrPage
