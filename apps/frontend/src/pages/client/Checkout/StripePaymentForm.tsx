import { Button, Stack, Text } from '@mantine/core'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useState } from 'react'

type Props = {
  // Called once Stripe confirms the payment actually succeeded — the caller is responsible for
  // placing the order from here (the order does not exist yet at this point).
  onPaymentSucceeded: (paymentIntentId: string) => void
}

const StripePaymentForm = ({ onPaymentSucceeded }: Props) => {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!stripe || !elements) return

    setSubmitting(true)
    setErrorMessage(null)

    const result = await stripe.confirmPayment({
      elements,
      // redirect: 'if_required' keeps card payments inline — the PaymentIntent is card-only
      // (see StripeService.CreatePaymentIntentAsync) so this should never actually redirect.
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/checkout`,
      },
    })

    if (result.error) {
      setSubmitting(false)
      setErrorMessage(result.error.message ?? 'Payment failed. Please try again.')
      return
    }

    // Don't reset `submitting` — the caller takes over from here to place the order, and the
    // button should stay in its loading state until that either succeeds or fails.
    onPaymentSucceeded(result.paymentIntent.id)
  }

  return (
    <Stack gap="md">
      <PaymentElement />
      {errorMessage && (
        <Text size="sm" c="red">
          {errorMessage}
        </Text>
      )}
      <Button fullWidth loading={submitting} disabled={!stripe || !elements} onClick={handleSubmit}>
        Pay Now
      </Button>
    </Stack>
  )
}

export default StripePaymentForm
