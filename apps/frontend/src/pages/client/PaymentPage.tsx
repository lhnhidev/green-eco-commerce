import { Anchor, Breadcrumbs, Button, Group, Input, Radio } from '@mantine/core'
import { useState } from 'react'
import { CiReceipt } from 'react-icons/ci'
import { IoCartOutline } from 'react-icons/io5'
import { LiaMoneyBillWaveSolid } from 'react-icons/lia'
import { SlLocationPin } from 'react-icons/sl'
import { useGetApiCart } from '../../api'
import OrderItem from '../../components/features/order/OrderItem'
import Loading from '../../components/ui/status/Loading'

const items = [
  { id: 1, title: 'Home', href: '/' },
  { id: 2, title: 'Payment', href: '/payment' },
].map((item) => (
  <Anchor href={item.href} key={item.id}>
    {item.title}
  </Anchor>
))

const PaymentPage = () => {
  const { data, isLoading } = useGetApiCart()

  const [addressType, setAddressType] = useState<'default' | 'new'>('default')
  const [paymentManner, setPaymentManner] = useState<'cod' | 'bank' | 'momo'>('bank')

  if (isLoading) return <Loading text="Loading" />

  const totalPrice = Number(data?.totalPrice) || 0

  const tax = Number((totalPrice * 0.02).toFixed(2))
  const total = Number((totalPrice * 1.02).toFixed(2))

  return (
    <div className="container mx-auto px-4 pt-8 pb-10">
      <Breadcrumbs>{items}</Breadcrumbs>
      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-8 border border-gray-300 rounded-lg px-6 py-4">
          <div className="flex gap-3 items-center mb-6">
            <IoCartOutline className="text-xl" /> Shopping Cart ({data?.items?.length})
          </div>

          <div className="flex flex-col gap-y-3 h-165 overflow-auto">
            {data?.items?.length === 0 ? (
              <p>No any product in your cart yet</p>
            ) : (
              data?.items?.map((item) => <OrderItem key={item.productId} product={item} />)
            )}
          </div>
        </div>
        <div className="col-span-4 flex flex-col border border-gray-300 rounded-lg px-6 py-4">
          <div className="flex gap-3 items-center mb-6">
            <CiReceipt className="text-xl" /> Order summary
          </div>

          <div className="flex flex-col gap-y-2">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p>${data?.totalPrice}</p>
            </div>
            <div className="flex justify-between">
              <p>Tax:</p>
              <p>${tax}</p>
            </div>
            <div className="text-primary flex justify-between font-bold">
              <p>Shipping:</p>
              <p>FREE</p>
            </div>

            <div className="text-primary text-lg flex justify-between font-bold">
              <p>Total:</p>
              <p>${total}</p>
            </div>

            <hr className="my-1 border-gray-300" />

            <div className="flex gap-3 items-center mt-2 mb-2">
              <SlLocationPin className="text-xl" /> Delivery
            </div>

            <div>
              <Radio.Group name="addressManner" className="mb-3" defaultValue={addressType}>
                <Group mt="xs">
                  <Radio onClick={() => setAddressType('default')} value="default" label="Default address" />
                  <Radio onClick={() => setAddressType('new')} value="new" label="Other address" />
                </Group>
              </Radio.Group>

              <Input disabled={addressType === 'default' && true} placeholder="Enter your address" />
            </div>

            <hr className="mb-1 mt-3 border-gray-300" />

            <div className="flex gap-3 items-center mt-2 mb-2">
              <LiaMoneyBillWaveSolid className="text-xl" /> Payment
            </div>

            <Radio.Group name="paymentManner" label="Select your payment manner" defaultValue={paymentManner}>
              <Group mt="xs">
                <Radio onClick={() => setPaymentManner('cod')} value="cod" label="COD" />
                <Radio onClick={() => setPaymentManner('bank')} value="bank" label="Bank" />
                <Radio onClick={() => setPaymentManner('momo')} value="momo" label="Momo" />
              </Group>
            </Radio.Group>
          </div>

          <hr className="mb-6 mt-25 border-gray-300" />

          <Button fullWidth color="green.9">
            Pay now
          </Button>

          <div className="flex items-end justify-center flex-1">
            <div className="flex gap-3">
              <Anchor size="sm" c="green.9" href="#" target="_blank" underline="always">
                Team of service
              </Anchor>
              <Anchor size="sm" c="green.9" href="#" target="_blank" underline="always">
                Shipping
              </Anchor>
              <Anchor size="sm" c="green.9" href="#" target="_blank" underline="always">
                Refund policy
              </Anchor>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
