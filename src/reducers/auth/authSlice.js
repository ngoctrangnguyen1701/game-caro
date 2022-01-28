import { combineReducers } from "redux";
import signUp from "./signUpSlice";
import logIn from "./logInSlice";

const reducer = combineReducers({
  signUp,
  logIn,
})

export default reducer