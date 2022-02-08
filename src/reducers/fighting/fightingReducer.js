import { combineReducers } from "@reduxjs/toolkit";
import setting from "./settingSlice";
import playOnline from './playOnlineSlice'
import playYourself from './playYourselfSlice'
import status from './statusSlice'

const reducer = combineReducers({
  setting,
  playOnline,
  playYourself,
  status,
})

export default reducer