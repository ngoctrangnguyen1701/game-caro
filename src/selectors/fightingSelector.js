export const fightingSelector = state => state.fighting

export const fightingSettingSelector = state => fightingSelector(state).setting
export const fightingPlayer1Selector = state => fightingSelector(state).setting.player1
export const fightingPlayer2Selector = state => fightingSelector(state).setting.player2
export const fightingTimeSelector = state => fightingSelector(state).setting.fightingTime
export const fightingWidthSelector = state => fightingSelector(state).setting.width
export const fightingHeightSelector = state => fightingSelector(state).setting.height

export const fightingStatusSelector = state => fightingSelector(state).status

export const fightingWinnerSelector = state => fightingSelector(state).play.winner
export const fightingBoardSelector = state => fightingSelector(state).play.board
export const fightingXIsNextSelector = state => fightingSelector(state).play.xIsNext
export const fightingResultSelector = state => fightingSelector(state).play.result
export const fightingMessageSelector = state => fightingSelector(state).play.message
export const fightingIsOpponentLeaveSelector = state => fightingSelector(state).play.isOpponentLeave

export const fightingRowSelector = state => {
  const board = fightingBoardSelector(state)
  if(board && board.length > 0){
    const rowArr = []
    board.forEach(item => {
      if(!rowArr.includes(item.y)){
        rowArr.push(item.y)
      }
    })
    // console.log({rowArr})-
    return rowArr
  }
}