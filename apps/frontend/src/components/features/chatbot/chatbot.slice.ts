import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type ChatbotState = {
  isShow: boolean
}

const initialState: ChatbotState = {
  isShow: false,
}

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    setIsShow: (state, action: PayloadAction<boolean>) => {
      state.isShow = action.payload
    },
  },
})

export const { setIsShow } = chatbotSlice.actions

export default chatbotSlice.reducer
