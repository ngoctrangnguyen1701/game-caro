import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  account: null,
  balance: 0, //--> balance BNB của ví
  token: 0, //--> số lượng token của contract pgc hiện tại
  exToken: 0, //--> số lượng token của contract pgc cũ
  isAdmin: false,
  message: '',
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setAccount(state, action) {
      const { account } = action.payload
      state.account = account
    },
    setIsAdmin(state, action) {
      state.isAdmin = action.payload
    },
    setBalance(state, action) {
      state.balance = action.payload.balance
    },
    setToken(state, action) {
      state.token = action.payload.token
    },
    setExToken(state, action) {
      state.exToken = action.payload.exToken
    },
  }
})

export const walletAction = mySlice.actions
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'