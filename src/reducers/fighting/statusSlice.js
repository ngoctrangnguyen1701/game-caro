import { createSlice } from "@reduxjs/toolkit";

const initialState = 'waiting'

const mySlice = createSlice({
  name: 'fighting',
  initialState,
  reducers: {
    setting(state, action){
      return 'setting'
    },
    settingComplete(state, action){
      return 'settingComplete'
    },
    resetSetting(state, action){
      return 'setting'
    },
    start(state, action){
      return 'start'
    }
  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer