import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  player1: {},
  player2: {},
  width: 30,
  height: 30,
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
    // resetSetting(state, action){
    //   state.status = 'setting'
    // },
    // start(state, action){
    //   state.status = 'start'
    // }
  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer