import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPlayYourself: true,
  board: [],
  width: '',
  height: '',
  xIsNext: true,
  winner: null,
  result: '',
  message: '',
  status: '',
}

const mySlice = createSlice({
  name: 'fighting',
  initialState,
  reducers: {
    // playYourself(state, action){
    //   state.isPlayYourself = true
    // },
  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer