import axios from "axios"
import { linkServer } from "../common/constants"
import setConfigApi from "./setConfigApi"

const boxApi = {
  getBox: () => axios.get(`${linkServer}/box/getBox`, setConfigApi()),
  buyBox: payload => axios.post(`${linkServer}/box/buyBox`, payload, setConfigApi()),
  openBox: payload => axios.get(`${linkServer}/box/openBox`, setConfigApi()),
  receiveAward: payload => axios.post(`${linkServer}/box/award`, payload, setConfigApi()),
}

export default boxApi