import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const STORAGE_KEY = 'compareProductIds'
export const MAX_COMPARE_ITEMS = 4

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

type CompareState = {
  productIds: string[]
}

const initialState: CompareState = {
  productIds: loadInitialIds(),
}

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    toggleCompare: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (state.productIds.includes(id)) {
        state.productIds = state.productIds.filter((x) => x !== id)
      } else if (state.productIds.length < MAX_COMPARE_ITEMS) {
        state.productIds.push(id)
      }
      persist(state.productIds)
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.productIds = state.productIds.filter((x) => x !== action.payload)
      persist(state.productIds)
    },
    clearCompare: (state) => {
      state.productIds = []
      persist(state.productIds)
    },
  },
})

export const { toggleCompare, removeFromCompare, clearCompare } = compareSlice.actions
export default compareSlice.reducer
