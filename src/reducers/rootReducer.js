import { combineReducers } from 'redux'
import auth from './auth/authSlice'
import onlineUserList from './onlineUser/onlineUserListSlice'
import invitation from './invitation/invitationSlice'
import fighting from './fighting/fightingSlice'
import box from './box/boxSlice'
import contract from './contract/contractSlice'
import web3 from './web3/web3'

export default combineReducers({
  auth,
  onlineUserList,
  invitation,
  fighting,
  box,
  contract,
  web3,
})