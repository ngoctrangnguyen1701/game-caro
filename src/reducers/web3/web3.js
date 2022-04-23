import { createSlice } from "@reduxjs/toolkit"
import Web3 from "web3"

const initialState = {provider: {}}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'web3',
  initialState,
  reducers: {
    connect(state, action) {
      state.provider = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')
      // state = action.payload.provider
    }
  }
})

// export const boxAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'