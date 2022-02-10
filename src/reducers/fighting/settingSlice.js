import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  player1: {},
  player2: {},
  width: 15,
  height: 15,
  fightingTime: 5,
  player1Shape: 'X',
  player2Shape: 'O',
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
    },
    changeShape(state, action){
      return {
        ...state,
        ...action.payload
      }
    },
    clearChessShape(state, action){
      return {
        ...state,
        player1Shape: 'X',
        player2Shape: 'O',
      }
    }
  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer