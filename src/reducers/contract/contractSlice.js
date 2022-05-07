import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  pgc: {
    contract: {}
  },
  exPGC: {
    contract: {}
  },
  tokenSwap: {
    contract: {}
  },
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    connect(state, action){},
    pgc(state, action) {
      state.pgc.contract = action.payload
    },
    exPGC(state, action) {
      state.exPGC.contract = action.payload
    },
    tokenSwap(state, action) {
      state.tokenSwap.contract = action.payload
    },
  }
})

export const contractAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'