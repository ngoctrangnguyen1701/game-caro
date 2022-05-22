import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  isShowModal: false,
  loading: false,
  list: [],
  page: 1,
  totalPages: 1,
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'paybackToken',
  initialState,
  reducers: {
    showModal(state, action) {
      state.isShowModal = action.payload
    },
    getList(state, action) {
      state.loading = true
    },
    getListSuccess(state, action) {
      const {list, page, totalPages} = action.payload
      state.loading = false
      state.list = list
      state.page = page
      state.totalPages = totalPages
    },
    getListFailed(state, action) {
      state.loading = false
      state.list = []
    },
  }
})

export const paybackTokenAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'