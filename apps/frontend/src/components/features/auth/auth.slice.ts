import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserProfileResponse } from '../../../api/schemas'
import type { AuthState } from '../../../types'

const initialState: AuthState = {
  active: 'login',
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeActive: (state, action: PayloadAction<'login' | 'register'>) => {
      state.active = action.payload
    },
    setAuthUser: (state, action: PayloadAction<UserProfileResponse>) => {
      state.user = action.payload
    },
    clearAuthUser: (state) => {
      state.user = null
    },
  },
})

export const { changeActive, setAuthUser, clearAuthUser } = authSlice.actions

export default authSlice.reducer
