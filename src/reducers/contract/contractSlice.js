import { combineReducers } from "@reduxjs/toolkit";
import pgc from "./pgcSlice";

const reducer = combineReducers({
  pgc,
})

export default reducer