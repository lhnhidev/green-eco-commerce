import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  imgUrlActive: '',
}

const imgSliderSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    changeImgSliderSliceActive: (state, action: PayloadAction<string>) => {
      state.imgUrlActive = action.payload
    },
  },
})

export const { changeImgSliderSliceActive } = imgSliderSlice.actions

export default imgSliderSlice.reducer
