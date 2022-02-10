import { combineReducers } from "@reduxjs/toolkit";
import setting from "./settingSlice";
import play from './playSlice'
import status from './statusSlice'
import chessShape from "./chessShape";

const reducer = combineReducers({
  setting,
  play,
  status,
  chessShape,
})

export default reducer