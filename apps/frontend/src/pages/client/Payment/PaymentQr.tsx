const PaymentQr = () => {
  return (
    <div>
      <img
        src={`https://img.vietqr.io/image/VCB-${import.meta.env.VITE_ID_ACCOUNT_BANK}-print.jpg?amount=1000&addInfo=resolve%20invoice`}
        alt="QR Payment"
      />
    </div>
  )
}

export default PaymentQr
