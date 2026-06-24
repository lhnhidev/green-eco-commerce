/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <> */
/** biome-ignore-all lint/a11y/noStaticElementInteractions: <> */
import { useNavigate } from 'react-router'
import type { CartItemDto } from '../../../api/schemas'
import { useAppDispatch } from '../../../hooks/useAppDispatch'
import { setIsShow } from './cart.slice'

const CartItem = ({ cartItem }: { cartItem: CartItemDto }) => {
  const navigation = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <div className="flex gap-5 items-center">
      <div
        className="w-35 h-35 relative hover:cursor-pointer"
        onClick={() => {
          dispatch(setIsShow(false))
          navigation(`/products/${cartItem?.productId}`)
        }}
      >
        <img
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={cartItem?.productImageUrl?.at(0)}
          alt="Imgage is error"
        />
      </div>
      <div className="text-sm">
        <p>Quantity: {cartItem?.quantity}</p>
        <p>{cartItem?.productName}</p>
        <p className="font-bold">${cartItem?.productPrice}</p>
      </div>
    </div>
  )
}

export default CartItem
