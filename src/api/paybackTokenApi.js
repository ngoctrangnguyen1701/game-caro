import axios from "axios"
import { linkServer } from "../common/constants"

const setConfigApi = (payload) => {
  const adminToken = JSON.parse(sessionStorage.getItem('adminToken'))
  if (adminToken) {
    const config = {
      headers: {
        Authorization: adminToken ? `Bearer ${adminToken}` : 'Bearer'
      },
      params: payload
    }
    return config
  }
}
const paybackTokenApi = {
  list: payload => axios.get(`${linkServer}/paybackToken/list`, setConfigApi(payload)),
  submitReceipt: payload => axios.post(`${linkServer}/paybackToken/receipt`, payload),

}


export default paybackTokenApi