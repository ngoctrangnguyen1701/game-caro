import { createSlice } from "@reduxjs/toolkit"
import Web3 from "web3"
import { NETWORK_BLOCKCHAIN } from "src/common/constants"

const initialState = {
  provider: null
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'web3',
  initialState,
  reducers: {
    connect(state, action) {
      state.provider = new Web3(NETWORK_BLOCKCHAIN)
    }
  }
})

export const web3Action = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'