import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  isShowModal: false,
  detail: null,
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'confirmReward',
  initialState,
  reducers: {
    showModal(state, action) {
      state.isShowModal = true
      state.detail = action.payload.detail
    },
    closeModal(state, action) {
      state.isShowModal = false
    }
  }
})

export const confirmRewardAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'