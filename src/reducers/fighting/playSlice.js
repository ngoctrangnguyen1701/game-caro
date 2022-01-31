import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  xIsNext: true,
  winner: null,
}

const mySlice = createSlice({
  name: 'fighting',
  initialState,
  reducers: {
    changeTurn(state, action){
      state.xIsNext = !state.xIsNext
    },
  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer