import {createSlice } from '@reduxjs/toolkit'

const initialState = []


const mySlice = createSlice({
  name: 'invitaion',
  initialState,
  reducers: {
    update(state, action){
      const newInvitation = action.payload.from
      const isExistUsername = state.findIndex(item => item.username === newInvitation.username)
      if(isExistUsername !== -1){
        //username is exist, socketId has be changed
        state[isExistUsername].socketId = newInvitation.socketId
      }
      else{
        state.push(newInvitation)
      }
    },
    argee(state, action){
      const {username} = action.payload
      // const newArr = state.map(item => {
      state.forEach(item => {
        if(item.username !== username){
          //nếu là user không được chọn thì thêm key 'notChosen'
          item.notChosen = true
        }
        else{
          //nếu là user được chọn
          item.agreeLoading = true
        }
        // return item
      })
      // return newArr
      //do đã dùng hàm map, state bị clone ra 1 mảng mới,
      //nên chỗ này phải có return, nếu không state sẽ không được cập nhật
    }
  }
})

export const invitationAction = mySlice.actions 
export default mySlice.reducer