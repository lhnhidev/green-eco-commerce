import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ActiveType = 'dashboard' | 'category' | 'user' | 'material' | 'document' | 'order' | 'analyst' | 'setting'

type TheNavigationState = {
  active: ActiveType
}

const initialState: TheNavigationState = {
  active: 'dashboard',
}

const theNavigationSlice = createSlice({
  name: 'theNavigation',
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<ActiveType>) => {
      state.active = action.payload
    },
  },
})

export const { setActive } = theNavigationSlice.actions

export default theNavigationSlice.reducer
