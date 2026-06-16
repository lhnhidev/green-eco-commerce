import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../components/features/auth/auth.slice'
import chatbotReducer from '../components/features/chatbot/chatbot.slice'
import imgSliderReducer from '../components/ui/img-slider/img-slider.slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    imgSlider: imgSliderReducer,
    chatbot: chatbotReducer,
  },
})

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
