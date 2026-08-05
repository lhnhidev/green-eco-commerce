import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  active: 'login' | 'register'
}

const initialState: AuthState = {
  active: 'login',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeActive: (state, action: PayloadAction<'login' | 'register'>) => {
      state.active = action.payload
    },
  },
})

export const { changeActive } = authSlice.actions

export default authSlice.reducer
