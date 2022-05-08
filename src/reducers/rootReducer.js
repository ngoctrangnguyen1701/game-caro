import { combineReducers } from 'redux'
import auth from './auth/authSlice'
import onlineUserList from './onlineUser/onlineUserListSlice'
import invitation from './invitation/invitationSlice'
import fighting from './fighting/fightingSlice'
import box from './box/boxSlice'
import web3 from './web3/web3'
import wallet from './wallet/wallet'
import contract from './contract/contractSlice'
import fullscreenLoading from './fullscreenLoading/fullscreenLoadingSlice'

export default combineReducers({
  auth,
  onlineUserList,
  invitation,
  fighting,
  box,
  contract,
  web3,
  wallet,
  fullscreenLoading,
})