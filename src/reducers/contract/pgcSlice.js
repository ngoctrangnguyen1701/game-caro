import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  contract: {},
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name: 'pgc',
  initialState,
  reducers: {
    interactContract(state, action) {
      state.contract = action.payload.contract
    }
  }
})

export const pgcAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'