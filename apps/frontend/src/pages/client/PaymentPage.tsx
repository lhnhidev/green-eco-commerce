import { Anchor, Breadcrumbs } from '@mantine/core'
import { CiReceipt } from 'react-icons/ci'
import { FaRegTrashCan } from 'react-icons/fa6'
import { IoCartOutline } from 'react-icons/io5'

const items = [
  { id: 1, title: 'Home', href: '/' },
  { id: 2, title: 'Payment', href: '/payment' },
].map((item) => (
  <Anchor href={item.href} key={item.id}>
    {item.title}
  </Anchor>
))

const PaymentPage = () => {
  return (
    <div className="container mx-auto px-4 pt-8 pb-10">
      <Breadcrumbs>{items}</Breadcrumbs>
      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-8 border border-gray-300 rounded-lg px-6 py-4">
          <div className="flex gap-3 items-center mb-6">
            <IoCartOutline className="text-xl" /> Shopping Cart
          </div>

          <div>
            <div className="flex gap-5 items-center border border-gray-300 rounded-lg p-4">
              <div>
                <img className="rounded-lg w-30 h-30" src="" alt="Img of product" />
              </div>

              <div className="flex justify-between flex-1">
                <div>
                  <p className="font-bold">Monstera Deliciosa</p>
                  <p>Point: 123</p>
                  <p>$45</p>
                  <div>123</div>
                </div>
                <div className="flex-col items-center">
                  <p className="mb-3">$10</p>
                  <div className="text-red-500">
                    <FaRegTrashCan />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 border border-gray-300 rounded-lg px-6 py-4">
          <div className="flex gap-3 items-center mb-6">
            <CiReceipt className="text-xl" /> Order summary
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
