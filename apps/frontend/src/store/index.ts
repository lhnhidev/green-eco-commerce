import authReducer from '@components/features/auth/auth.slice'
import cartReducer from '@components/features/cart/cart.slice'
import chatbotReducer from '@components/features/chatbot/chatbot.slice'
import compareReducer, { persist as persistCompare } from '@components/features/compare/compare.slice'
import theNavigationReducer from '@components/features/navigation/navigation.slice'
import recentlyViewedReducer, {
  persist as persistRecentlyViewed,
} from '@components/features/products/recentlyViewed.slice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatbot: chatbotReducer,
    cart: cartReducer,
    compare: compareReducer,
    recentlyViewed: recentlyViewedReducer,
    theNavigation: theNavigationReducer,
  },
})

// Persist compare/recentlyViewed product-id lists to localStorage outside the reducers
// themselves (reducers must stay pure). Only writes when that slice's `productIds`
// array reference actually changed since the last dispatch.
let previousCompareIds = store.getState().compare.productIds
let previousRecentlyViewedIds = store.getState().recentlyViewed.productIds

store.subscribe(() => {
  const state = store.getState()

  if (state.compare.productIds !== previousCompareIds) {
    previousCompareIds = state.compare.productIds
    persistCompare(previousCompareIds)
  }

  if (state.recentlyViewed.productIds !== previousRecentlyViewedIds) {
    previousRecentlyViewedIds = state.recentlyViewed.productIds
    persistRecentlyViewed(previousRecentlyViewedIds)
  }
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
