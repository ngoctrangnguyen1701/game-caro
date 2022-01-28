export const logInSelector = state => state.auth.logIn
// export const logInStatusSelector = state => state.auth.logIn.status

export const logInStatusSelector = (state) => {
  const logInS = logInSelector(state)
  return logInS.status
}