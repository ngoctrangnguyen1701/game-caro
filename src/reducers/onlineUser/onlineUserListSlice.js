import { createSlice } from "@reduxjs/toolkit"


const initialState = []

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'onlineUser',
  initialState,
  reducers: {
    fetchAll(state, action){
      // state = action.payload.onlineUserList
      //nếu dùng gán trực tiếp cho cái state lớn như vậy, nhưng ko có return state sẽ không cập nhật được
      //gán giá trị cho từng key trong state thì được
      return action.payload.onlineUserList
    },
    add(state, action){
      const {onlineUser} = action.payload
      const {username, socketId, } = onlineUser

      const index = state.findIndex(item => item.username === username)
      if(index !== -1){
        //đang có username đó
        //có thể do người kia F5 lại trang web nên socketId bị thay đổi,
        //hoặc rớt mạng đăng nhập lại...
        //cập nhật lại socketId và nếu đang có removeLoading do mất kết nối thì xóa nó đi
        state[index].socketId = socketId
        state[index].removeLoading = false
      }
      else{
        //username không có trong mảng --> 1 người online mới hoàn toàn
        //khi thêm 1 người online mới sẽ có hiệu ứng loading trước khi hiện lên
        state.push({...onlineUser, addLoading: true})
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
    updateFightingStatus(state, action){
      state.forEach(item => {
        if(action.payload.updateFightingUserList.includes(item.username)){
          item.isFighting = true
        }
      })
    },
  }
})

export const onlineUserAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'


//khi có người dùng mới đăng nhập
// username	khac
// socketId	giong
// --> log out, xong rồi log in bằng 1 toàn khoản khác --> new

// username	khac
// socketId	khac
// --> may khac, browser khac log in --> new

// username	giong
// socketId	giong
// --> ko co truong hop nay, do da chay log in khi co log in bi trung

// username	giong
// socketId	khac
// --> co the mat ket noi, sau do log in lai tai khoan do --> old