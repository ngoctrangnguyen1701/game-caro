import { combineReducers } from 'redux'
import auth from './auth/authSlice'
import onlineUserList from './onlineUser/onlineUserListSlice'
import invitation from './invitation/invitationSlice'
import fighting from './fighting/fightingSlice'
import fullscreenLoading from './fullscreenLoading/fullscreenLoadingSlice'

export default combineReducers({
  auth,
  onlineUserList,
  invitation,
  fighting,
  fullscreenLoading,
})