import { combineReducers } from "@reduxjs/toolkit";
import setting from "./settingSlice";
import play from './playSlice'
import status from './statusSlice'

const reducer = combineReducers({
  setting,
  play,
  status,
})

export default reducer