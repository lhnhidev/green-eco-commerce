import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type CartState = {
  isShow: boolean
}

const initialState: CartState = {
  isShow: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setIsShow: (state, action: PayloadAction<boolean>) => {
      state.isShow = action.payload
    },
  },
})

export const { setIsShow } = cartSlice.actions

export default cartSlice.reducer
