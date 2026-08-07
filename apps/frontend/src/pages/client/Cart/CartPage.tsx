import { invalidateGetCart, useClearCart, useGetCart } from '@api'
import CartLineItem from '@components/features/cart/CartLineItem'
import Container from '@components/ui/primitives/Container'
import EmptyState from '@components/ui/primitives/EmptyState'
import PageHeader from '@components/ui/primitives/PageHeader'
import Panel from '@components/ui/primitives/Panel'
import PriceTag from '@components/ui/primitives/PriceTag'
import SectionHeading from '@components/ui/primitives/SectionHeading'
import Seo from '@components/ui/Seo'
import Loading from '@components/ui/status/Loading'
import { Button } from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { LeafIcon, ShoppingCartIcon, TrashIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router'

const breadcrumbItems = [
  { title: 'Home', href: '/' },
  { title: 'Cart', href: '/cart' },
]

const CartPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: cart, isLoading, isError } = useGetCart()

  const { mutate: clearCart, isPending: clearing } = useClearCart({
    mutation: {
      onSuccess: async () => {
        await invalidateGetCart(queryClient)
        notifications.show({ title: 'Cart cleared', message: 'All items removed from your cart.', color: 'green' })
      },
      onError: () =>
        notifications.show({ title: 'Error', message: 'Could not clear your cart. Please try again.', color: 'red' }),
    },
  })

  const handleClearCart = () => {
    modals.openConfirmModal({
      title: 'Clear cart',
      children: <p className="text-sm text-gray-600">This will remove every item from your cart. Continue?</p>,
      labels: { confirm: 'Clear cart', cancel: 'Keep items' },
      confirmProps: { color: 'red' },
      onConfirm: () => clearCart(),
    })
  }

  if (isLoading) return <Loading text="Loading your cart..." />

  const items = cart?.items ?? []
  const subtotal = items.reduce((acc, item) => acc + (item.productPrice ?? 0) * (item.quantity ?? 1), 0)
  const totalCo2Saved = items.reduce((acc, item) => acc + (item.unitCo2Saved ?? 0) * (item.quantity ?? 1), 0)
  const hasBlockingStockIssue = items.some((item) => (item.quantity ?? 0) > (item.currentStockQuantity ?? 0))

  return (
    <Container className="py-6">
      <Seo title="My Cart" />
      <PageHeader
        breadcrumbItems={breadcrumbItems}
        icon={ShoppingCartIcon}
        title="My Cart"
        suffix={items.length > 0 && <span className="text-sm text-gray-400">({items.length} items)</span>}
      />

      {isError || items.length === 0 ? (
        <Panel padding="lg">
          <EmptyState
            icon={ShoppingCartIcon}
            title="Your cart is empty"
            description="Looks like you haven't added any eco-friendly products yet. Let's change that!"
            action={
              <Button component={Link} to="/products" mt="sm">
                Shop Now
              </Button>
            }
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <Panel padding="lg" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-500">Items</span>
              <button
                type="button"
                onClick={handleClearCart}
                disabled={clearing}
                className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                <TrashIcon size={13} /> Clear cart
              </button>
            </div>
            {items.map((item) => (
              <CartLineItem key={item.productId} cartItem={item} />
            ))}
          </Panel>

          <Panel padding="lg" className="lg:sticky lg:top-[72px] flex flex-col gap-4">
            <SectionHeading>Order Summary</SectionHeading>

            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-md border border-green-100">
              <LeafIcon className="text-green-600" weight="fill" size={16} />
              <p className="text-xs font-semibold text-green-700">
                You'll earn <span className="text-green-800 font-bold">{cart?.pointsGained ?? 0}</span> Green Points on
                this order
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <PriceTag value={subtotal} size="sm" colorClassName="text-gray-900" />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">CO₂ Saved</span>
                <span className="font-semibold text-teal-600">{totalCo2Saved.toFixed(2)} kg</span>
              </div>
              <p className="text-xs text-gray-400">Coupons, points, and shipping are applied at checkout.</p>
            </div>

            {hasBlockingStockIssue && (
              <p className="text-xs font-semibold text-red-500">
                Some items exceed available stock. Adjust quantities before proceeding to checkout.
              </p>
            )}

            <Button fullWidth size="md" disabled={hasBlockingStockIssue} onClick={() => navigate('/checkout')}>
              Proceed to Checkout
            </Button>
            <Button fullWidth variant="light" color="gray" component={Link} to="/products">
              Continue Shopping
            </Button>
          </Panel>
        </div>
      )}
    </Container>
  )
}

export default CartPage
