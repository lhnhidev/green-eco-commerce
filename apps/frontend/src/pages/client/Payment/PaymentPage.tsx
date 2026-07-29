import {
  getGetCartQueryKey,
  useGetCart,
  useGetGreenWallet,
  useGetMe,
  useProcessCheckout,
  useValidateCoupon
} from '@api'
import type { CheckoutRequest, ProblemDetails, ValidateCouponResponse } from '@api/schemas'
import { PaymentMethodEnum } from '@api/schemas'
import OrderItem from '@components/features/order/OrderItem'
import Loading from '@components/ui/status/Loading'
import { Anchor, Breadcrumbs, Button, Group, Input, Modal, NumberInput, Radio, Text, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { MapPinIcon, MoneyWavyIcon, ReceiptIcon, ShoppingCartIcon, TagIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import PaymentQr from './PaymentQr'

const breadcrumbItems = [
  { id: 1, title: 'Home', href: '/' },
  { id: 2, title: 'Payment', href: '/payment' },
].map((item) => (
  <Anchor href={item.href} key={item.id}>
    {item.title}
  </Anchor>
))

const PaymentPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: cart, isLoading: cartLoading } = useGetCart()
  const { data: me } = useGetMe()
  const { data: wallet } = useGetGreenWallet()

  const [addressType, setAddressType] = useState<'default' | 'new'>('default')
  const [newAddress, setNewAddress] = useState('')
  const [paymentManner, setPaymentManner] = useState<'COD' | 'Bank' | 'MoMo'>('Bank')
  const [opened, { open, close }] = useDisclosure(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null)
  const [pointsToRedeem, setPointsToRedeem] = useState(0)

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

  const { mutate: checkout, isPending: checkingOut } = useProcessCheckout({
    mutation: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
        notifications.show({
          title: 'Order placed!',
          message: `Your order #${data.orderId.substring(0, 8).toUpperCase()} has been placed.`,
          color: 'green',
        })
        navigate('/my-orders')
      },
      onError: (error) => {
        const axiosError = error as AxiosError<ProblemDetails>
        notifications.show({
          title: 'Checkout failed',
          message: axiosError.response?.data?.detail || 'Something went wrong. Please try again.',
          color: 'red',
        })
      },
    },
  })

  if (cartLoading) return <Loading text="Loading" />

  const totalPrice = cart?.items.reduce((acc, item) => acc + item.productPrice * item.quantity, 0) || 0
  const couponDiscount = appliedCoupon?.discountAmount ?? 0
  const pointsDiscount = pointsToRedeem / 20
  // Coupon and Green Points are mutually exclusive per order — only one discount source applies.
  const discount = appliedCoupon ? couponDiscount : pointsDiscount
  const total = Number((totalPrice - discount).toFixed(2))

  const walletBalance = wallet?.balance ?? 0
  const maxPoints = Math.min(walletBalance, totalPrice * 20)

  const deliveryAddress = addressType === 'default' ? (me?.address ?? '') : newAddress

  const handlePayNow = () => {
    if (!deliveryAddress.trim()) {
      notifications.show({ title: 'Address required', message: 'Please enter a delivery address.', color: 'orange' })
      return
    }

    if (paymentManner === 'Bank' || paymentManner === 'MoMo') {
      open() // show QR first, checkout on confirm
    } else {
      doCheckout()
    }
  }

  const doCheckout = () => {
    const paymentMethodMap: Record<string, CheckoutRequest['paymentMethod']> = {
      COD: PaymentMethodEnum.COD,
      Bank: PaymentMethodEnum.Bank,
      MoMo: PaymentMethodEnum.MoMo,
    }
    checkout({
      data: {
        deliveryAddress: addressType === 'default' ? (me?.address ?? '') : newAddress,
        paymentMethod: paymentMethodMap[paymentManner],
        pointsToRedeem,
        couponCode: appliedCoupon?.code,
      },
    })
    close()
  }

  return (
    <div>
      <Modal opened={opened} onClose={close} title="Scan to Pay" centered>
        <PaymentQr amount={total} />
        <Button fullWidth color="green.9" mt="md" loading={checkingOut} onClick={doCheckout}>
          I've Paid — Confirm Order
        </Button>
      </Modal>
      <div className="container mx-auto px-4 pt-8 pb-10">
        <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-8 border border-gray-300 rounded-lg px-4 sm:px-6 py-4">
            <div className="flex gap-3 items-center mb-6">
              <ShoppingCartIcon className="text-xl" /> Shopping Cart ({cart?.items?.length})
            </div>

            <div className="flex flex-col gap-y-3 max-h-120 lg:max-h-165 overflow-auto">
              {cart?.items?.length === 0 ? (
                <p>No any product in your cart yet</p>
              ) : (
                cart?.items?.map((item) => <OrderItem key={item.productId} product={item} />)
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-4 flex flex-col border border-gray-300 rounded-lg px-4 sm:px-6 py-4">
            <div className="flex gap-3 items-center mb-6">
              <ReceiptIcon className="text-xl" /> Order summary
            </div>

            <div className="flex flex-col gap-y-2">
              <div className="flex justify-between">
                <p>Subtotal:</p>
                <p>${totalPrice.toFixed(2)}</p>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <p className="flex items-center gap-1">
                    <TagIcon size={13} /> Coupon ({appliedCoupon.code}):
                  </p>
                  <p>-${couponDiscount.toFixed(2)}</p>
                </div>
              )}
              {pointsToRedeem > 0 && (
                <div className="flex justify-between text-amber-600">
                  <p>Green Points ({pointsToRedeem} pts):</p>
                  <p>-${pointsDiscount.toFixed(2)}</p>
                </div>
              )}
              <div className="text-primary flex justify-between font-bold">
                <p>Shipping:</p>
                <p>FREE</p>
              </div>
              <div className="text-primary text-lg flex justify-between font-bold">
                <p>Total:</p>
                <p>${total}</p>
              </div>

              <hr className="my-1 border-gray-300" />

              {/* Coupon (mutually exclusive with Green Points — see below) */}
              <div className="flex gap-2 items-end">
                <TextInput
                  label="Coupon Code"
                  placeholder={pointsToRedeem > 0 ? 'Clear Green Points to use a coupon' : 'Enter code...'}
                  size="xs"
                  leftSection={<TagIcon size={12} />}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.currentTarget.value.toUpperCase())}
                  className="flex-1"
                  disabled={!!appliedCoupon || pointsToRedeem > 0}
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
                    disabled={!couponCode.trim() || pointsToRedeem > 0}
                    onClick={() => validateCoupon({ data: { code: couponCode, orderTotal: totalPrice } })}
                  >
                    Apply
                  </Button>
                )}
              </div>

              {/* Green Points (mutually exclusive with a coupon) */}
              {walletBalance > 0 && (
                <div className="mt-2">
                  <Text size="xs" fw={600} mb={4}>
                    Green Points (Balance: {walletBalance} pts = ${(walletBalance / 20).toFixed(2)})
                  </Text>
                  <NumberInput
                    size="xs"
                    min={0}
                    max={maxPoints}
                    step={20}
                    value={pointsToRedeem}
                    onChange={(v) => setPointsToRedeem(typeof v === 'number' ? Math.floor(v / 20) * 20 : 0)}
                    placeholder={appliedCoupon ? 'Remove coupon to redeem points' : 'Points to redeem (20pts = $1)'}
                    description="20 points = $1 off"
                    disabled={!!appliedCoupon}
                  />
                </div>
              )}

              <div className="flex gap-3 items-center mt-2 mb-2">
                <MapPinIcon className="text-xl" /> Delivery
              </div>

              <div>
                <Radio.Group
                  name="addressManner"
                  className="mb-3"
                  value={addressType}
                  onChange={(v) => setAddressType(v as 'default' | 'new')}
                >
                  <Group mt="xs">
                    <Radio value="default" label={`Default: ${me?.address || 'Not set'}`} />
                    <Radio value="new" label="Other address" />
                  </Group>
                </Radio.Group>

                {addressType === 'new' && (
                  <Input
                    placeholder="Enter your delivery address"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.currentTarget.value)}
                  />
                )}
              </div>

              <hr className="mb-1 mt-3 border-gray-300" />

              <div className="flex gap-3 items-center mt-2 mb-2">
                <MoneyWavyIcon className="text-xl" /> Payment
              </div>

              <Radio.Group
                name="paymentManner"
                label="Select your payment manner"
                value={paymentManner}
                onChange={(v) => setPaymentManner(v as 'COD' | 'Bank' | 'MoMo')}
              >
                <Group mt="xs">
                  <Radio value="COD" label="COD (Cash on Delivery)" />
                  <Radio value="Bank" label="Bank Transfer" />
                  <Radio value="MoMo" label="MoMo Wallet" />
                </Group>
              </Radio.Group>
            </div>

            <hr className="mb-4 mt-6 border-gray-300" />

            <Button
              fullWidth
              color="green.9"
              loading={checkingOut}
              disabled={!cart?.items?.length}
              onClick={handlePayNow}
            >
              {paymentManner === 'COD' ? 'Place Order (COD)' : 'Pay Now'}
            </Button>

            <div className="flex items-end justify-center flex-1 mt-4">
              <div className="flex flex-wrap gap-3 justify-center">
                <Anchor size="sm" c="green.9" href="#" target="_blank" underline="always">
                  Terms of service
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
