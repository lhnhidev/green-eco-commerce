import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  active: 'login',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeActive: (state, action: PayloadAction<string>) => {
      if (action.payload === 'login') {
        state.active = action.payload
      }

      if (action.payload === 'register') {
        state.active = action.payload
      }
    },
  },
})

export const { changeActive } = authSlice.actions

export default authSlice.reducer
