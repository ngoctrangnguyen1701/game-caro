import { combineReducers } from 'redux'
import auth from './auth/authSlice'
import onlineUserList from './onlineUser/onlineUserListSlice'
import invitation from './invitation/invitationSlice'
import fighting from './fighting/fightingSlice'

export default combineReducers({
  auth,
  onlineUserList,
  invitation,
  fighting,
})