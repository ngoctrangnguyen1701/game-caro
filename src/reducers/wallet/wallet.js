import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  account: null,
  balance: 0,
  token: 0,
  isAdmin: false,
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'wallet',
  initialState,
  reducers: {
    setAccount(state, action) {
      const {account, balance, token} = action.payload
      state.account = account
      state.balance = balance
      state.token = token
    },
    isAdmin(state, action) {
      state.isAdmin = action.payload
    }
  }
})

export const walletAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'