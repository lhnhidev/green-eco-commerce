import authReducer from '@components/features/auth/auth.slice'
import cartReducer from '@components/features/cart/cart.slice'
import chatbotReducer from '@components/features/chatbot/chatbot.slice'
import compareReducer from '@components/features/compare/compare.slice'
import theNavigationReducer from '@components/features/navigation/navigation.slice'
import imgSliderReducer from '@components/ui/img-slider/img-slider.slice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    imgSlider: imgSliderReducer,
    chatbot: chatbotReducer,
    cart: cartReducer,
    compare: compareReducer,
    theNavigation: theNavigationReducer,
  },
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
