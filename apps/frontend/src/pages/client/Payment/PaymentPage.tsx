import { useGetCart, useValidateCoupon } from '@api'
import type { ValidateCouponResponse } from '@api/schemas'
import OrderItem from '@components/features/order/OrderItem'
import Loading from '@components/ui/status/Loading'
import { Anchor, Breadcrumbs, Button, Group, Input, Modal, Radio, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { CiReceipt } from 'react-icons/ci'
import { FiTag } from 'react-icons/fi'
import { IoCartOutline } from 'react-icons/io5'
import { LiaMoneyBillWaveSolid } from 'react-icons/lia'
import { SlLocationPin } from 'react-icons/sl'
import PaymentQr from './PaymentQr'

const items = [
  { id: 1, title: 'Home', href: '/' },
  { id: 2, title: 'Payment', href: '/payment' },
].map((item) => (
  <Anchor href={item.href} key={item.id}>
    {item.title}
  </Anchor>
))

const PaymentPage = () => {
  const { data, isLoading } = useGetCart()

  const [addressType, setAddressType] = useState<'default' | 'new'>('default')
  const [paymentManner, setPaymentManner] = useState<'cod' | 'bank' | 'momo'>('bank')
  const [opened, { open, close }] = useDisclosure(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null)

  const { mutate: validateCoupon, isPending: validatingCoupon } = useValidateCoupon({
    mutation: {
      onSuccess: (result) => {
        setAppliedCoupon(result)
        notifications.show({
          title: `Coupon "${result.code}" applied!`,
          message: `You save $${result.discountAmount.toFixed(2)}`,
          color: 'green',
        })
      },
      onError: () =>
        notifications.show({ title: 'Invalid coupon', message: 'This coupon is invalid or expired.', color: 'red' }),
    },
  })

  if (isLoading) return <Loading text="Loading" />

  const totalPrice = data?.items.reduce((acc, item) => acc + item.productPrice * item.quantity, 0) || 0
  const discount = appliedCoupon?.discountAmount ?? 0
  const tax = Number(((totalPrice - discount) * 0.02).toFixed(2))
  const total = Number(((totalPrice - discount) * 1.02).toFixed(2))

  return (
    <div>
      <Modal opened={opened} onClose={close} title="Resolve Invoice" centered>
        <PaymentQr />
      </Modal>
      <div className="container mx-auto px-4 pt-8 pb-10">
        <Breadcrumbs>{items}</Breadcrumbs>
        {/* Responsive grid: stacks on mobile, side-by-side on lg+ */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-8 border border-gray-300 rounded-lg px-4 sm:px-6 py-4">
            <div className="flex gap-3 items-center mb-6">
              <IoCartOutline className="text-xl" /> Shopping Cart ({data?.items?.length})
            </div>

            <div className="flex flex-col gap-y-3 max-h-[480px] lg:max-h-[660px] overflow-auto">
              {data?.items?.length === 0 ? (
                <p>No any product in your cart yet</p>
              ) : (
                data?.items?.map((item) => <OrderItem key={item.productId} product={item} />)
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-4 flex flex-col border border-gray-300 rounded-lg px-4 sm:px-6 py-4">
            <div className="flex gap-3 items-center mb-6">
              <CiReceipt className="text-xl" /> Order summary
            </div>

            <div className="flex flex-col gap-y-2">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <p className="flex items-center gap-1">
                    <FiTag size={13} /> Coupon ({appliedCoupon.code}):
                  </p>
                  <p>-${discount.toFixed(2)}</p>
                </div>
              )}
              <div className="flex justify-between">
                <p>Tax (2%):</p>
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

              {/* Coupon */}
              <div className="flex gap-2 items-end">
                <TextInput
                  label="Coupon Code"
                  placeholder="Enter code..."
                  size="xs"
                  leftSection={<FiTag size={12} />}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.currentTarget.value.toUpperCase())}
                  className="flex-1"
                  disabled={!!appliedCoupon}
                />
                {appliedCoupon ? (
                  <Button
                    size="xs"
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      setAppliedCoupon(null)
                      setCouponCode('')
                    }}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    size="xs"
                    color="primary"
                    loading={validatingCoupon}
                    disabled={!couponCode.trim()}
                    onClick={() => validateCoupon({ data: { code: couponCode, orderTotal: totalPrice } })}
                  >
                    Apply
                  </Button>
                )}
              </div>

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

            <hr className="mb-4 mt-6 border-gray-300" />

            <Button fullWidth color="green.9" onClick={open}>
              Pay now
            </Button>

            <div className="flex items-end justify-center flex-1 mt-4">
              <div className="flex flex-wrap gap-3 justify-center">
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
    </div>
  )
}

export default PaymentPage
