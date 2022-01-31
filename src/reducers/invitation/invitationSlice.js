import {createSlice } from '@reduxjs/toolkit'

const initialState = []


const mySlice = createSlice({
  name: 'invitaion',
  initialState,
  reducers: {
    add(state, action){
      const newInvitation = action.payload.from
      const index = state.findIndex(item => item.username === newInvitation.username)
      if(index !== -1){
        //username is exist, socketId has be changed
        // state[index].socketId = newInvitation.socketId
        // state[index].removeLoading = false
        state[index] = newInvitation
      }
      else{
        state.push({...newInvitation, addLoading: true})
      }
    },
    prepareRemove(state, action){
      const {username} = action.payload.offlineUser
      const index = state.findIndex(item => item.username === username)
      if(index !== -1) state[index].removeLoading = true
    },
    remove(state, action){
      const {username} = action.payload.offlineUser
      const index = state.findIndex(item => item.username === username)
      if(state[index]?.removeLoading){
        //nếu vẫn còn removeLoading (tức chưa có đăng nhập lại) thì sẽ xóa nó đi
        return state.filter(item => item.username !== username)
        //do đã dùng hàm filte, state bị clone ra 1 mảng mới,
        //nên chỗ này phải có return, nếu không state sẽ không được cập nhật
      }
    },
    argee(state, action){
      const {username} = action.payload
      state.forEach(item => {
        if(item.username !== username){
          //nếu là user không được chọn thì thêm key 'notChosen'
          item.notChosen = true
        }
        else{
          //nếu là user được chọn
          item.agreeLoading = true
        }
      })
    },
    updateFightingStatus(state, action){
      state.forEach(item => {
        if(action.payload.updateFightingUserList.includes(item.username)){
          item.isFighting = true
        }
      })
    },
  }
})

export const invitationAction = mySlice.actions 
export default mySlice.reducer