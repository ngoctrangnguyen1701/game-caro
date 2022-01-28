import axios from "axios"
import { linkServer } from "../constants/constants"

const authApi = {
  signUp: payload => axios.post(`${linkServer}/auth/signUp`, payload),
  logIn: payload => axios.post(`${linkServer}/auth/logIn`, payload),
  // getUser: payload => axios.get(`${linkServer}/auth/getUser`, config) --> this api called in AuthContext
  logInWithSocialAccount: payload => axios.post(`${linkServer}/auth/logInWithSocialAccount`, payload),
}

export default authApi