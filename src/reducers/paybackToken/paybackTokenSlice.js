import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  // paybackToken: '',
  status: null,
  message: null,
  isShowModal: false,
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'paybackToken',
  initialState,
  reducers: {
    showModal(state, action) {
      state.isShowModal = action.payload
    },
    submitReceipt(state, action) {
    },
    submitReceiptSuccess(state, action) {
      state.status = 'success'
      state.message = `You have received ${action.payload.paybackToken} PGC`
      state.isShowModal = false
    },
    submitReceiptFailed(state, action) {
      state.status = 'failed'
      state.message = action.payload.message
      state.isShowModal = false
    },
    clearState(state, action) {
      state.status = null
      state.message = null
      state.paybackToken = ''
      state.isShowModal = false
    }
  }
})

export const paybackTokenAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'