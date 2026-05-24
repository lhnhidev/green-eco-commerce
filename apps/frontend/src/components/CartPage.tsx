import { Button, Card, TextInput } from '@mantine/core'
import {
  ArrowLeftIcon,
  MinusIcon,
  PlusIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TagIcon,
  TrashIcon,
  TruckIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { useLocation } from 'wouter'
import { ImageWithFallback } from './ImageWithFallback'

export function CartPage() {
  const [, navigate] = useLocation()

  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Monstera Deliciosa',
      price: 45,
      originalPrice: 60,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=150&h=150&fit=crop',
      inStock: true,
      size: 'Medium',
    },
    {
      id: '2',
      name: 'Peace Lily',
      price: 28,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=150&h=150&fit=crop',
      inStock: true,
      size: 'Small',
    },
    {
      id: '3',
      name: 'Snake Plant',
      price: 35,
      quantity: 3,
      image: 'https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=150&h=150&fit=crop',
      inStock: true,
      size: 'Large',
    },
  ])

  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === 'PLANT20') {
      setAppliedPromo('PLANT20')
      setPromoCode('')
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cartItems.reduce(
    (sum, item) => (item.originalPrice ? sum + (item.originalPrice - item.price) * item.quantity : sum),
    0,
  )
  const promoDiscount = appliedPromo === 'PLANT20' ? subtotal * 0.2 : 0
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = (subtotal - promoDiscount) * 0.08
  const total = subtotal - promoDiscount + shipping + tax

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingCartIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-primary mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any plants to your cart yet.</p>
          <Button onClick={() => navigate('/products')} size="lg" radius="xl" color="green.9">
            Shop Plants
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="subtle"
        color="gray"
        className="mb-6 px-0"
        onClick={() => navigate('/products')}
        leftSection={<ArrowLeftIcon className="h-4 w-4" />}
      >
        Continue Shopping
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card shadow="sm" padding="lg" radius="md">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCartIcon className="h-5 w-5" />
              <h2 className="text-lg font-bold">Shopping Cart ({cartItems.length} items)</h2>
            </div>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <div className="relative w-24 h-24 shrink-0">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-semibold text-primary">${item.price}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">${item.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="xs"
                        color="green.9"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <MinusIcon className="h-3 w-3" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="xs"
                        color="green.9"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <PlusIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                    <Button variant="subtle" size="xs" color="red" onClick={() => removeItem(item.id)} className="mt-2">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Promo Code */}
          <Card shadow="sm" padding="lg" radius="md">
            <div className="flex items-center gap-2 mb-4">
              <TagIcon className="h-4 w-4 text-primary" />
              <span className="font-medium">Promo Code</span>
            </div>
            <div className="flex gap-2">
              <TextInput
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button onClick={applyPromoCode} variant="outline" color="green.9">
                Apply
              </Button>
            </div>
            {appliedPromo && (
              <div className="mt-2 text-sm text-green-600">✓ Promo code {appliedPromo} applied! 20% off</div>
            )}
            <p className="text-xs text-gray-500 mt-2">Try code "PLANT20" for 20% off!</p>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card shadow="sm" padding="lg" radius="md" className="sticky top-8">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Savings</span>
                  <span>-${savings.toFixed(2)}</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Promo Discount (20%)</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                {shipping === 0 ? <span className="text-green-600">FREE</span> : <span>${shipping.toFixed(2)}</span>}
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>

            <div className="space-y-3 mt-4">
              <Button fullWidth radius="xl" size="lg" color="green.9">
                Proceed to Checkout
              </Button>
              <div className="text-xs text-center text-gray-500">Secure checkout powered by Stripe</div>
            </div>

            <div className="space-y-2 pt-4 border-t mt-4">
              <div className="flex items-center gap-2 text-sm">
                <TruckIcon className="h-4 w-4 text-primary" />
                {shipping === 0 ? (
                  <span>Free shipping on this order!</span>
                ) : (
                  <span>Add ${(50 - subtotal).toFixed(2)} for free shipping</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ShieldCheckIcon className="h-4 w-4 text-primary" />
                <span>30-day plant health guarantee</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recently Viewed */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-primary mb-6">You might also like</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: '4', name: 'Fiddle Leaf Fig', price: 85, originalPrice: 100 },
            { id: '5', name: 'Rubber Tree', price: 55 },
            { id: '6', name: 'Bird of Paradise', price: 120, originalPrice: 150 },
            { id: '7', name: 'Aloe Vera', price: 18 },
          ].map((product) => (
            <Card
              key={product.id}
              shadow="sm"
              padding={0}
              radius="md"
              className="group hover:shadow-lg transition-shadow plant-shadow"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1586074299478-0d3d20abba7d?w=300&h=300&fit=crop"
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-primary">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <Button size="xs" radius="xl" color="green.9">
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
