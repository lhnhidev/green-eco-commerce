import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ActiveType =
  | 'dashboard'
  | 'product'
  | 'category'
  | 'user'
  | 'material'
  | 'document'
  | 'order'
  | 'analyst'
  | 'setting'
  | 'review'
  | 'coupon'
  | 'banner'

type TheNavigationState = {
  active: ActiveType
  desktopSidebarOpen: boolean
  mobileSidebarOpen: boolean
}

const initialState: TheNavigationState = {
  active: 'dashboard',
  desktopSidebarOpen: true,
  mobileSidebarOpen: false,
}

const theNavigationSlice = createSlice({
  name: 'theNavigation',
  initialState,
  reducers: {
    setActive: (state, action: PayloadAction<ActiveType>) => {
      state.active = action.payload
    },
    toggleDesktopSidebar(state) {
      state.desktopSidebarOpen = !state.desktopSidebarOpen
    },
    closeDesktopSidebar(state) {
      state.desktopSidebarOpen = false
    },
    toggleMobileSidebar(state) {
      state.mobileSidebarOpen = !state.mobileSidebarOpen
    },
    closeMobileSidebar(state) {
      state.mobileSidebarOpen = false
    },
  },
})

export const { setActive, toggleDesktopSidebar, closeDesktopSidebar, toggleMobileSidebar, closeMobileSidebar } = theNavigationSlice.actions

export default theNavigationSlice.reducer
