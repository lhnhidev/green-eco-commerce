import { formatCurrency } from '@utils/formatCurrency'

// Fixed demo transfer amount — every order requests the same small real transfer regardless
// of its actual total (shown separately below), so live testing doesn't require real money.
// The order is matched back by its short code in the transfer content, not by amount.
const FIXED_TRANSFER_AMOUNT_VND = 10000

type Props = {
  amount: number
  /** When provided, the QR requests the fixed demo amount and encodes this order's short code
   *  into the transfer content so the SePay webhook can match it automatically. When omitted
   *  (the standalone /payment/qr?amount= route, which has no order to match), falls back to
   *  the original behavior: real amount, generic content, no auto-confirmation. */
  orderId?: string
}

const PaymentQr = ({ amount, orderId }: Props) => {
  if (!orderId) {
    const amountVnd = Math.round(amount * 23000) // approx USD → VND
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-gray-500">
          Scan QR to pay <span className="font-semibold text-primary">{formatCurrency(amount)}</span>
        </p>
        <img
          src={`https://img.vietqr.io/image/VCB-${import.meta.env.VITE_ID_ACCOUNT_BANK}-print.jpg?amount=${amountVnd}&addInfo=GreenEco%20Order`}
          alt="QR Payment"
          className="w-full max-w-xs rounded-lg"
        />
        <p className="text-xs text-gray-400">≈ {amountVnd.toLocaleString('vi-VN')} VND</p>
        <p className="text-2xs text-amber-600 text-center max-w-xs">
          Demo environment — this QR is not connected to a real payment gateway. No bank/wallet
          verification happens.
        </p>
      </div>
    )
  }

  const orderCode = orderId.slice(-8).toUpperCase()

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-gray-500">
        Order total: <span className="font-semibold text-primary">{formatCurrency(amount)}</span>
      </p>
      <img
        src={`https://img.vietqr.io/image/VCB-${import.meta.env.VITE_ID_ACCOUNT_BANK}-print.jpg?amount=${FIXED_TRANSFER_AMOUNT_VND}&addInfo=DH%20${orderCode}`}
        alt="QR Payment"
        className="w-full max-w-xs rounded-lg"
      />
      <p className="text-xs text-gray-500 text-center">
        Transfer exactly{' '}
        <span className="font-semibold text-primary">{FIXED_TRANSFER_AMOUNT_VND.toLocaleString('vi-VN')} VND</span>{' '}
        with content <span className="font-mono font-semibold">DH {orderCode}</span>
      </p>
      <p className="text-2xs text-amber-600 text-center max-w-xs">
        Waiting for your transfer to be detected automatically — this page will update itself
        once payment is confirmed.
      </p>
    </div>
  )
}

export default PaymentQr
