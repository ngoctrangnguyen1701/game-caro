import axios from "axios"
import { linkServer } from "../constants/constants"
import setConfigApi from "./setConfigApi"

const boxApi = {
  getBox: () => axios.get(`${linkServer}/box/getBox`, setConfigApi()),
  buyBox: payload => axios.post(`${linkServer}/box/buyBox`, payload, setConfigApi()),
}

export default boxApi