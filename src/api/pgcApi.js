import axios from "axios"
import { linkServer } from "../common/constants"

const pgcApi = {
  requestToken: payload => axios.post(`${linkServer}/pgc/takeBackToken/request`, payload),
  requestTokenList: payload => axios.get(`${linkServer}/pgc/takeBackToken/list`),
  paybackToken: payload => axios.post(`${linkServer}/pgc/takeBackToken/payback`, payload),
  // cancelRequest: payload => axios.post(`${linkServer}/pgc/takeBackToken/cancel`, payload),
}

export default pgcApi