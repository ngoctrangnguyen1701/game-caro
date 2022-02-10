import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  player1Shape: 'X',
  player2Shape: 'O',
}

const mySlice = createSlice({
  name: 'fighting',
  initialState,
  reducers: {
    changeShape(state, action){
      return {
        ...state,
        ...action.payload
      }
    },
  }

})

export const fightingAction = mySlice.actions
export default mySlice.reducer