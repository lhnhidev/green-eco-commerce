import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const STORAGE_KEY = 'recentlyViewedProductIds'
export const MAX_RECENTLY_VIEWED = 10

const loadInitialIds = (): string[] => {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const persist = (ids: string[]) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  }
}

type RecentlyViewedState = {
  productIds: string[]
}

const initialState: RecentlyViewedState = {
  productIds: loadInitialIds(),
}

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    recordProductView: (state, action: PayloadAction<string>) => {
      const id = action.payload
      // Most-recent-first, no duplicates, capped at MAX_RECENTLY_VIEWED.
      state.productIds = [id, ...state.productIds.filter((x) => x !== id)].slice(0, MAX_RECENTLY_VIEWED)
      persist(state.productIds)
    },
    clearRecentlyViewed: (state) => {
      state.productIds = []
      persist(state.productIds)
    },
  },
})

export const { recordProductView, clearRecentlyViewed } = recentlyViewedSlice.actions
export default recentlyViewedSlice.reducer
