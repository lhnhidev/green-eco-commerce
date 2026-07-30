import { createSlice } from '@reduxjs/toolkit'

type TheNavigationState = {
  desktopSidebarOpen: boolean
  mobileSidebarOpen: boolean
}

const initialState: TheNavigationState = {
  desktopSidebarOpen: true,
  mobileSidebarOpen: false,
}

const theNavigationSlice = createSlice({
  name: 'theNavigation',
  initialState,
  reducers: {
    toggleDesktopSidebar(state) {
      state.desktopSidebarOpen = !state.desktopSidebarOpen
    },
    toggleMobileSidebar(state) {
      state.mobileSidebarOpen = !state.mobileSidebarOpen
    },
    closeMobileSidebar(state) {
      state.mobileSidebarOpen = false
    },
  },
})

export const { toggleDesktopSidebar, toggleMobileSidebar, closeMobileSidebar } = theNavigationSlice.actions

export default theNavigationSlice.reducer
