import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  player1: {},
  player2: {},
  width: 15,
  height: 15,
  fightingTime: 5,
}

const mySlice = createSlice({
  name: 'fighting',
  initialState,
  reducers: {
    setting(state, action){
      return {
        ...state,
        ...action.payload,
      }
    },
    settingComplete(state, action){
      return {
        ...state, 
        ...action.payload,
      }
    },
    waiting(state, action){
      return initialState
    }
  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer