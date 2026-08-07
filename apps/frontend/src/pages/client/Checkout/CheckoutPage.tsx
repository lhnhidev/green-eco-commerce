import {
  invalidateGetCart,
  invalidateGetGreenWallet,
  invalidateGetMyAddresses,
  invalidateGetMyStatistics,
  useCreateAddress,
  useCreatePaymentUrl,
  useGetCart,
  useGetGreenWallet,
  useGetMe,
  useGetMyAddresses,
  useGetMyOrderById,
  useProcessCheckout,
  useValidateCoupon,
} from '@api'
import type { CheckoutRequest, ProblemDetails, ValidateCouponResponse } from '@api/schemas'
import { PaymentMethodEnum, PaymentStatusEnum } from '@api/schemas'
import AddressAutocomplete from '@components/features/addresses/AddressAutocomplete'
import OrderItem from '@components/features/order/OrderItem'
import PageBreadcrumbs from '@components/ui/PageBreadcrumbs'
import Container from '@components/ui/primitives/Container'
import Panel from '@components/ui/primitives/Panel'
import SectionHeading from '@components/ui/primitives/SectionHeading'
import Seo from '@components/ui/Seo'
import Loading from '@components/ui/status/Loading'
import {
  Anchor,
  Badge,
  Button,
  Checkbox,
  Group,
  Modal,
  NumberInput,
  Radio,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { MapPinIcon, MoneyWavyIcon, ReceiptIcon, ShoppingCartIcon, TagIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '@utils/formatCurrency'
import type { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import PaymentQr from '../Payment/PaymentQr'

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Checkout', href: '/checkout' },
]

const paymentMethodLabel: Record<'COD' | 'Bank' | 'MoMo' | 'VnPay', string> = {
  COD: 'Cash on Delivery',
  Bank: 'Bank Transfer',
  MoMo: 'MoMo Wallet',
  VnPay: 'VNPay',
}

const NEW_ADDRESS_OPTION = 'new'
const PROFILE_ADDRESS_OPTION = 'profile'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('vnpay') === 'failed') {
      notifications.show({
        title: 'VNPay payment failed',
        message: 'Your payment was not completed. You can try again or choose another payment method.',
        color: 'red',
      })
      setSearchParams((prev) => {
        prev.delete('vnpay')
        return prev
      })
    }
  }, [searchParams, setSearchParams])

  const { data: cart, isLoading: cartLoading } = useGetCart()
  const { data: me } = useGetMe()
  const { data: wallet } = useGetGreenWallet()
  const { data: addresses } = useGetMyAddresses()

  const hasSavedAddresses = (addresses?.length ?? 0) > 0
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [newAddressText, setNewAddressText] = useState('')
  const [newAddressPlace, setNewAddressPlace] = useState<{
    commune: string | null
    province: string | null
    placeId: string | null
  } | null>(null)
  const [saveNewAddress, setSaveNewAddress] = useState(false)

  // Default the radio selection once addresses have loaded — a saved default address if one
  // exists, otherwise the account's profile address, otherwise straight to "new address".
  if (selectedAddressId === null && addresses !== undefined) {
    const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0]
    setSelectedAddressId(defaultAddress?.id ?? (me?.address ? PROFILE_ADDRESS_OPTION : NEW_ADDRESS_OPTION))
  }

  const { mutate: createAddress } = useCreateAddress({
    mutation: {
      onSuccess: async () => {
        await invalidateGetMyAddresses(queryClient)
        notifications.show({ title: 'Address saved', message: 'Added to your address book.', color: 'green' })
      },
      onError: () => notifications.show({ title: 'Error', message: 'Could not save this address.', color: 'red' }),
    },
  })

  const [paymentManner, setPaymentManner] = useState<'COD' | 'Bank' | 'MoMo' | 'VnPay'>('Bank')
  const [opened, { open, close }] = useDisclosure(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<ValidateCouponResponse | null>(null)
  const [pointsToRedeem, setPointsToRedeem] = useState(0)

  // Bank/MoMo QR flow: the order is created (Pending) first, then we poll its payment status
  // until SePay's webhook confirms the transfer and flips it to Paid — no manual "I've Paid" step.
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null)
  const { data: polledOrder } = useGetMyOrderById(payingOrderId ?? '', {
    query: { enabled: !!payingOrderId, refetchInterval: 3000 },
  })

  useEffect(() => {
    if (payingOrderId && polledOrder?.paymentStatus === PaymentStatusEnum.Paid) {
      close()
      notifications.show({
        title: 'Payment received!',
        message: `Your order #${payingOrderId.slice(-8).toUpperCase()} has been paid.`,
        color: 'green',
      })
      const paidOrderId = payingOrderId
      setPayingOrderId(null)
      navigate(`/order-success/${paidOrderId}`)
    }
  }, [payingOrderId, polledOrder, close, navigate])

  const { mutate: validateCoupon, isPending: validatingCoupon } = useValidateCoupon({
    mutation: {
      onSuccess: (result) => {
        setAppliedCoupon(result)
        notifications.show({
          title: `Coupon "${result.code}" applied!`,
          message: `You save ${formatCurrency(result.discountAmount)}`,
          color: 'green',
        })
      },
      onError: () =>
        notifications.show({ title: 'Invalid coupon', message: 'This coupon is invalid or expired.', color: 'red' }),
    },
  })

  const { mutate: createVnPayUrl, isPending: startingVnPay } = useCreatePaymentUrl({
    mutation: {
      onSuccess: (data) => {
        // Full-page redirect to VNPay's hosted payment page — not an SPA navigation.
        window.location.href = data.paymentUrl
      },
      onError: () => {
        notifications.show({
          title: 'VNPay error',
          message: 'Could not start VNPay payment. Your order was placed as unpaid — try again from My Orders.',
          color: 'red',
        })
      },
    },
  })

  const { mutate: checkout, isPending: checkingOut } = useProcessCheckout({
    mutation: {
      onSuccess: (data) => {
        invalidateGetCart(queryClient)
        invalidateGetMyStatistics(queryClient)
        invalidateGetGreenWallet(queryClient)

        if (paymentManner === 'VnPay') {
          // Order is created with Payment.Status = Pending — hand off to VNPay to collect
          // payment, then its return callback marks the order paid and redirects back to us.
          createVnPayUrl({ data: { orderId: data.orderId } })
          return
        }

        if (paymentManner === 'Bank' || paymentManner === 'MoMo') {
          // Order is created Pending — show the QR and poll until SePay's webhook confirms
          // the transfer (see polledOrder effect above), instead of trusting a manual click.
          setPayingOrderId(data.orderId)
          open()
          return
        }

        notifications.show({
          title: 'Order placed!',
          message: `Your order #${data.orderId.slice(-8).toUpperCase()} has been placed.`,
          color: 'green',
        })
        navigate(`/order-success/${data.orderId}`)
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

  const selectedSavedAddress = addresses?.find((a) => a.id === selectedAddressId)
  const deliveryAddress =
    selectedAddressId === NEW_ADDRESS_OPTION
      ? newAddressText
      : selectedAddressId === PROFILE_ADDRESS_OPTION
        ? (me?.address ?? '')
        : (selectedSavedAddress?.formattedAddress ?? '')

  const maybeSaveNewAddress = () => {
    if (selectedAddressId === NEW_ADDRESS_OPTION && saveNewAddress) {
      createAddress({
        data: {
          label: 'Address',
          recipientName: `${me?.firstName ?? ''} ${me?.lastName ?? ''}`.trim() || 'Recipient',
          phone: me?.phone ?? '',
          formattedAddress: newAddressText,
          commune: newAddressPlace?.commune ?? null,
          province: newAddressPlace?.province ?? null,
          placeId: newAddressPlace?.placeId ?? null,
          isDefault: false,
        },
      })
    }
  }

  const handlePlaceOrder = () => {
    if (!deliveryAddress.trim()) {
      notifications.show({ title: 'Address required', message: 'Please enter a delivery address.', color: 'orange' })
      return
    }

    maybeSaveNewAddress()

    const paymentMethodMap: Record<string, CheckoutRequest['paymentMethod']> = {
      COD: PaymentMethodEnum.COD,
      Bank: PaymentMethodEnum.Bank,
      MoMo: PaymentMethodEnum.MoMo,
      VnPay: PaymentMethodEnum.VnPay,
    }
    checkout({
      data: {
        deliveryAddress,
        paymentMethod: paymentMethodMap[paymentManner],
        pointsToRedeem,
        couponCode: appliedCoupon?.code,
      },
    })
  }

  return (
    <Container className="py-6">
      <Seo title="Checkout" />
      <Modal
        opened={opened}
        onClose={() => {
          close()
          setPayingOrderId(null)
        }}
        title="Scan to Pay"
        centered
      >
        {payingOrderId && <PaymentQr amount={total} orderId={payingOrderId} />}
      </Modal>

      <PageBreadcrumbs items={breadcrumbItems} className="mb-4" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 flex flex-col gap-4">
          {/* Delivery address */}
          <Panel padding="md">
            <SectionHeading icon={MapPinIcon} className="mb-3">
              Delivery Address
            </SectionHeading>

            <Radio.Group name="addressManner" value={selectedAddressId} onChange={setSelectedAddressId}>
              <Stack gap="sm">
                {addresses?.map((a) => (
                  <Radio
                    key={a.id}
                    value={a.id}
                    label={
                      <span>
                        <span className="font-semibold text-sm">{a.label}</span>
                        {a.isDefault && (
                          <Badge size="xs" color="primary" variant="light" ml={6}>
                            Default
                          </Badge>
                        )}
                        <br />
                        <span className="text-xs text-gray-500">
                          {a.recipientName} · {a.phone} — {a.formattedAddress}
                        </span>
                      </span>
                    }
                  />
                ))}
                {!hasSavedAddresses && me?.address && (
                  <Radio value={PROFILE_ADDRESS_OPTION} label={`Default: ${me.address}`} />
                )}
                <Radio value={NEW_ADDRESS_OPTION} label="Use a new address" />
              </Stack>
            </Radio.Group>

            {selectedAddressId === NEW_ADDRESS_OPTION && (
              <div className="flex flex-col gap-2 mt-2">
                <AddressAutocomplete
                  value={newAddressText}
                  onChange={setNewAddressText}
                  onSelectSuggestion={(s) => {
                    setNewAddressText(s.description)
                    setNewAddressPlace({ commune: s.commune, province: s.province, placeId: s.placeId })
                  }}
                />
                <Checkbox
                  label="Save this address to my address book"
                  checked={saveNewAddress}
                  onChange={(e) => setSaveNewAddress(e.currentTarget.checked)}
                />
              </div>
            )}
          </Panel>

          {/* Payment method */}
          <Panel padding="md">
            <SectionHeading icon={MoneyWavyIcon} className="mb-3">
              Payment Method
            </SectionHeading>
            <Radio.Group
              name="paymentManner"
              value={paymentManner}
              onChange={(v) => setPaymentManner(v as 'COD' | 'Bank' | 'MoMo' | 'VnPay')}
            >
              <Group>
                <Radio value="COD" label="COD (Cash on Delivery)" />
                <Radio value="Bank" label="Bank Transfer" />
                <Radio value="MoMo" label="MoMo Wallet" />
                <Radio value="VnPay" label="VNPay" />
              </Group>
            </Radio.Group>
          </Panel>

          {/* Items, coupon, points */}
          <Panel padding="md">
            <SectionHeading icon={ShoppingCartIcon} className="mb-3">
              Items ({cart?.items?.length})
            </SectionHeading>
            <div className="flex flex-col gap-y-3 max-h-64 overflow-auto">
              {cart?.items?.map((item) => (
                <OrderItem key={item.productId} product={item} />
              ))}
            </div>

            <hr className="border-border my-4" />

            {/* Coupon (mutually exclusive with Green Points) */}
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
              <div className="mt-4">
                <Text size="xs" fw={600} mb={4}>
                  Green Points (Balance: {walletBalance} pts = {formatCurrency(walletBalance / 20)})
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
          </Panel>
        </div>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-[72px] lg:self-start">
          <Panel padding="md" className="flex flex-col">
            <SectionHeading icon={ReceiptIcon} className="mb-4">
              Order summary
            </SectionHeading>

            <div className="flex flex-col gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Deliver to</span>
                <span className="font-medium max-w-48 text-right truncate">{deliveryAddress || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment method</span>
                <span className="font-medium">{paymentMethodLabel[paymentManner]}</span>
              </div>

              <hr className="border-border my-1" />

              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <TagIcon size={13} /> Coupon ({appliedCoupon.code})
                  </span>
                  <span>-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              {pointsToRedeem > 0 && (
                <div className="flex justify-between text-amber-600">
                  <span>Green Points ({pointsToRedeem} pts)</span>
                  <span>-{formatCurrency(pointsDiscount)}</span>
                </div>
              )}
              <div className="text-primary flex justify-between font-semibold">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="text-primary text-lg flex justify-between font-semibold pt-1 border-t border-border">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <Button
              fullWidth
              size="md"
              className="mt-4"
              loading={checkingOut || startingVnPay}
              disabled={!cart?.items?.length || !!payingOrderId}
              onClick={handlePlaceOrder}
            >
              {paymentManner === 'COD' ? 'Place Order (COD)' : 'Pay Now'}
            </Button>

            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <Anchor component={Link} to="/terms" size="xs" c="primary" target="_blank" underline="always">
                Terms of service
              </Anchor>
              <Anchor component={Link} to="/shipping" size="xs" c="primary" target="_blank" underline="always">
                Shipping
              </Anchor>
              <Anchor component={Link} to="/returns" size="xs" c="primary" target="_blank" underline="always">
                Refund policy
              </Anchor>
            </div>
          </Panel>
        </aside>
      </div>
    </Container>
  )
}

export default CheckoutPage
