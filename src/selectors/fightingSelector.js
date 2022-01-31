export const fightingSelector = state => state.fighting

// export const fightingStatusSelector = state => state.fighting.status
export const fightingSettingSelector = state => fightingSelector(state).setting
export const fightingStatusSelector = state => fightingSelector(state).status
export const fightingPlayer1Selector = state => fightingSelector(state).setting.player1
export const fightingPlayer2Selector = state => fightingSelector(state).setting.player2

export const fightingXIsNextSelector = state => fightingSelector(state).play.xIsNext
export const fightingWinnerSelector = state => fightingSelector(state).play.winner