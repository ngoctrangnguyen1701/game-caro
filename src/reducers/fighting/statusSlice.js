
import { createSlice } from "@reduxjs/toolkit";

const initialState = 'waiting'

const mySlice = createSlice({
  name: 'fighting',
  initialState,
  reducers: {
    setting(){
      return 'setting'
    },
    settingComplete(){
      return 'settingComplete'
    },
    resetSetting(){
      return 'setting'
    },
    start(){
      return 'start'
    },
    stop(){
      return 'stop'
    },
    waiting(){
      return initialState
    },
    suggestReplay(){
      return 'suggestReplay'
    },
    disagreeReplay(){
      return 'disagreeReplay'
    },
  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer