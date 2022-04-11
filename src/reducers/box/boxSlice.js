import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  amountOfBoxes: 0
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'box',
  initialState,
  reducers: {
    getBox(state, action){
    },
    buyBox(state, action){
    },
    setAmount(state, action) {
      state.amountOfBoxes = action.payload.amountOfBoxes
    }
  }
})

export const boxAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'