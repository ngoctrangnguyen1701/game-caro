import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  address: '0x1Bb2B5133D4Cd15afc3e459f5E5Df8e299B70dC0'
}

//createSlice của redux toolkit là kết hợp actionCreator và reducer
const mySlice = createSlice({
  name:'pgc',
  initialState,
  reducers: {
  }
})

// export const boxAction = mySlice.actions 
export default mySlice.reducer
//cái này cú pháp để lấy ra những cái action nằm trong key 'reducer'