import { formatCurrency } from '@utils/formatCurrency'

type Props = {
  amount: number
}

const PaymentQr = ({ amount }: Props) => {
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
        verification happens; "Paid" is confirmed manually.
      </p>
    </div>
  )
}

export default PaymentQr
