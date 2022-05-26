import { combineReducers } from 'redux'
import auth from './auth/authSlice'
import onlineUserList from './onlineUser/onlineUserListSlice'
import invitation from './invitation/invitationSlice'
import fighting from './fighting/fightingSlice'
import box from './box/boxSlice'
import wallet from './wallet/walletSlice'
import contract from './contract/contractSlice'
import fullscreenLoading from './fullscreenLoading/fullscreenLoadingSlice'
import paybackToken from './paybackToken/paybackTokenSlice'
import confirmReward from './confirmReward/confirmRewardSlice'

export default combineReducers({
  auth,
  onlineUserList,
  invitation,
  fighting,
  box,
  contract,
  wallet,
  fullscreenLoading,
  paybackToken,
  confirmReward,
})