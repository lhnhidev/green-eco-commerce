/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */

import { Button } from '@mantine/core'
import { IoCloseSharp } from 'react-icons/io5'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { useAppSelector } from '../../../hooks/useAppSelector'
import { setIsShow } from './cart.slice'

const CartSidebar = () => {
  const isShow = useAppSelector((state) => state.cart.isShow)
  const dispatch = useAppDispatch()

  console.log(isShow)

  return (
    isShow && (
      <div className="fixed z-100 top-0 right-0 left-0 w-full h-full">
        <div className="w-full h-full bg-black/80 animate__animated animate__fadeIn"></div>
        <div className=" bg-(--color-background) fixed top-0 right-0 w-[40%] h-full animate__animated animate__fadeInRight">
          <div className="px-4 relative text-center font-bold text-sm py-4 border-b-gray-400 border-b">
            Shopping Cart
            <div
              onClick={() => dispatch(setIsShow(false))}
              className="text-xl hover:bg-gray-300 transition-all hover:cursor-pointer absolute top-0 right-0 h-full flex items-center justify-center px-5"
            >
              <IoCloseSharp />
            </div>
          </div>

          <div className="px-4 py-5 border-b-gray-400 border-b">123</div>

          <div className="px-4 py-5">
            <p className="text-center text-sm mb-2"> Included tax. Checkout to pay them.</p>
            <div>
              <Button color="green.9" size="md" w="100%" radius="xl" classNames={{ root: '!mb-3' }}>
                <span className="hidden sm:inline">Checkout</span>
              </Button>
              <Button color="green.9" size="md" w="100%" radius="xl">
                <span className="hidden sm:inline">Continue Shopping</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  )
}

export default CartSidebar
