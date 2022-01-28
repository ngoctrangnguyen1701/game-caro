export const fightingSelector = state => state.fighting

// export const fightingStatusSelector = state => state.fighting.status
export const fightingStatusSelector = state => fightingSelector(state).status
export const fightingPlayer1Selector = state => fightingSelector(state).player1
export const fightingPlayer2Selector = state => fightingSelector(state).player2