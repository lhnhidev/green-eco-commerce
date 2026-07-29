/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */

import { useGetCart } from '@api'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useAppSelector } from '@hooks/useAppSelector'
import { ShoppingCartIcon, UserIcon, XIcon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router'
import CartItem from './CartItem'
import { setIsShow } from './cart.slice'

const CartSidebar = () => {
  const isShow = useAppSelector((state) => state.cart.isShow)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useGetCart()

  const close = () => dispatch(setIsShow(false))
  const subtotal = data?.items?.reduce((acc, item) => acc + (item.productPrice ?? 0) * (item.quantity ?? 1), 0) ?? 0
  const itemCount = data?.items?.length ?? 0

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-99 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${isShow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
      />

      {/* Drawer panel */}
      <div
        className={`
          fixed top-0 right-0 z-100 h-full
          w-full sm:w-100 max-w-[calc(100vw-2rem)]
          bg-white flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isShow ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <ShoppingCartIcon className="text-green-300" weight="bold" size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-[15px] leading-none">My Cart</p>
              {itemCount > 0 && (
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {itemCount} item{itemCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-all"
          >
            <XIcon />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {isError ? (
            /* Not logged in */
            <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                <UserIcon className="text-amber-500" weight="bold" size={28} />
              </div>
              <p className="font-semibold text-gray-700">Sign in to see your cart</p>
              <p className="text-sm text-gray-400">Your eco-friendly picks will appear here once you're logged in.</p>
              <button
                type="button"
                onClick={() => {
                  close()
                  navigate('/auth')
                }}
                className="mt-1 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Sign In
              </button>
            </div>
          ) : isLoading || data === undefined ? (
            /* Loading skeleton */
            <div className="px-5 py-4 flex flex-col gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-100 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                    <div className="h-6 bg-gray-100 rounded-full w-24 mt-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : data.items.length === 0 ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center gap-3 px-8 text-center py-12">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-2">
                <ShoppingCartIcon className="text-green-500" weight="bold" size={32} />
              </div>
              <p className="font-bold text-gray-800 text-lg">Your cart is empty</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Looks like you haven't added any eco-friendly products yet. Let's change that!
              </p>
              <button
                type="button"
                onClick={() => {
                  close()
                  navigate('/products')
                }}
                className="mt-3 px-6 py-2.5 bg-linear-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-green-500/20 active:scale-[0.98]"
              >
                Shop Now →
              </button>
            </div>
          ) : (
            /* Items list */
            <div className="px-5">
              {data.items.map((item) => (
                <CartItem key={item.productId} cartItem={item} />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer (only when cart has items) ──────────── */}
        {!isError && !isLoading && data && data.items.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50">
            {/* Green Points notice */}
            <div className="mx-5 mt-4 px-3 py-2.5 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
              <span className="text-base">🌿</span>
              <p className="text-[11px] font-semibold text-green-700">
                You'll earn <span className="text-green-800 font-black">{data.pointsGained}</span> Green Points on this
                order
              </p>
            </div>

            {/* Subtotal */}
            <div className="px-5 pt-4 pb-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900 text-[15px]">${subtotal.toFixed(2)}</span>
            </div>
            <p className="px-5 text-[11px] text-gray-400 mb-4">Taxes and shipping calculated at checkout</p>

            {/* Actions */}
            <div className="px-5 pb-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  close()
                  navigate('/payment')
                }}
                className="w-full py-3.5 bg-linear-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Checkout — ${subtotal.toFixed(2)}
              </button>
              <button
                type="button"
                onClick={() => {
                  close()
                  navigate('/products')
                }}
                className="w-full py-3 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 text-gray-700 hover:text-green-700 font-semibold text-sm rounded-xl transition-all active:scale-[0.98]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default CartSidebar
