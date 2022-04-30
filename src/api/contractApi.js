import axios from "axios"
import { linkServer } from "../constants/constants"

const contractApi = {
  takeBackToken: (payload) => axios.post(`${linkServer}/pgc/takeBackToken`, payload),
}

export default contractApi