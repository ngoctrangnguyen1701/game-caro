import {createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false
}

const mySlice = createSlice({
  name: 'fullscreenLoading',
  initialState,
  reducers: {
    showLoading(state, action) {
      state.loading = action.payload
    }
  }
})

export const fullscreenLoadingAction = mySlice.actions 
export default mySlice.reducer