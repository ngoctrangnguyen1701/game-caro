// export const onlineUserSelector = state => state.onlineUser
// export const onlineUserListSelector = state => state.onlineUser.list
// export const onlineUserStatusSelector = state => state.onlineUser.status

// export const onlineUserListSelector = state => {
//   const s = onlineUserSelector(state)
//   return s.list
// }
// shorten ↓
// export const onlineUserListSelector = state => onlineUserSelector(state).list

// export const onlineUserMessageSelector = state => {
//   const a = onlineUserSelector(state)
//   return a.message
// }

//Update mới cho onlineUserListSelector

export const onlineUserListSelector = state => state.onlineUserList
export const onlineUserMessageSelector = state => {
  const arr = onlineUserListSelector(state)
  return arr.length > 0 ? '' : 'Player not found'
}

// export const onlineUserLoadingSelector = state => {
//   const 
// }