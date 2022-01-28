import { createSlice } from "@reduxjs/toolkit"

//tạm thời là initialState của sign up
const initialState = {
  loading: false,
  status: null,
  message: '',
}
//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'auth/logIn',
  initialState,
  reducers: {
    submit(state, action){
      //khác với redux, state trong redux toolkit có thể chỉnh sửa trực tiếp, ko cần phải clone ra
      //do nó có thằng xử lý bên dưới
      state.loading = true
    },
    success(state, action){
      /* state = {
        status: 'success',
        loading: false
      } */  //-> thay thế bằng 1 obj trực tiếp như thế này nó ko ăn, chỉnh sửa từng thằng thì đc
      state.loading = false
      state.status = 'success'
      state.message = ''
    },
    failed(state, action){
      state.loading = false
      state.status = 'failed'
      state.message = action.payload.message
    },
    clear(state, action){
      state.status = null
      state.message = ''
    },
  }
})

export const logInAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'