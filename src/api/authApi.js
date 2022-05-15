import axios from "axios"
import { linkServer } from "../common/constants"

const authApi = {
  signUp: payload => axios.post(`${linkServer}/auth/signUp`, payload),
  logIn: payload => axios.post(`${linkServer}/auth/logIn`, payload),
  // getUser: payload => axios.get(`${linkServer}/auth/getUser`, config) --> this api called in AuthContext
  logInWithSocialAccount: payload => axios.post(`${linkServer}/auth/logInWithSocialAccount`, payload),
  submitSignature: payload => axios.post(`${linkServer}/auth/wallet`, payload)
}

export default authApi