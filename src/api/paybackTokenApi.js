import axios from "axios"
import { linkServer } from "../common/constants"

const paybackTokenApi = {
  list: payload => axios.get(`${linkServer}/paybackToken/list`),
  submitReceipt: payload => axios.post(`${linkServer}/paybackToken/receipt`, payload),
}

export default paybackTokenApi