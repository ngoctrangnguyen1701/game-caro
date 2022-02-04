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
      const user = action.payload.onlineUser || action.payload.waitingFightingUser
      const {username} = user

      const index = state.findIndex(item => item.username === username)
      if(index !== -1){
        //đang có username đó
        //có thể do người kia F5 lại trang web nên socketId bị thay đổi,
        //hoặc rớt mạng đăng nhập lại...
        state[index] = user
      }
      else{
        //username không có trong mảng --> 1 người online mới hoàn toàn
        //khi thêm 1 người online mới sẽ có hiệu ứng loading trước khi hiện lên
        state.push({...user, addLoading: true})
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
        //nếu vẫn còn removeLoading thì sẽ xóa nó đi
        //(chưa có đăng nhập lại, 
        //nếu đã đăng nhập lại thì state mới bằng cái obj từ socket server gửi về
        //nên không có removeLoading) 
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