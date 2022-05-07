import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  pgc: {},
  exPGC: {},
  tokenSwap: {},
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    pgc(state, action) {
      state.pgc = action.payload
    },
    exPGC(state, action) {
      state.exPGC = action.payload
    },
    tokenSwap(state, action) {
      state.tokenSwap = action.payload
    },
  }
})

export const contractAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'