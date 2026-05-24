import { notifications } from '@mantine/notifications'
import { createContext, type ReactNode, useContext, useState } from 'react'

interface CartContextValue {
  cartItems: string[]
  addToCart: (productId: string, quantity?: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<string[]>([])

  const addToCart = (productId: string, quantity = 1) => {
    const newItems = Array.from({ length: quantity }, () => productId)
    setCartItems((prev) => [...prev, ...newItems])
    notifications.show({
      title: 'Added to cart',
      message: `Added ${quantity} item${quantity > 1 ? 's' : ''} to cart!`,
      color: 'green',
    })
  }

  return <CartContext.Provider value={{ cartItems, addToCart }}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
