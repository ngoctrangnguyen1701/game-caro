import { combineReducers } from 'redux'
import auth from './auth/authSlice'
import onlineUserList from './onlineUser/onlineUserListSlice'
import invitation from './invitation/invitationSlice'
import fighting from './fighting/fightingReducer'
import box from './box/boxSlice'

export default combineReducers({
  auth,
  onlineUserList,
  invitation,
  fighting,
  box,
})