export const fightingSelector = state => state.fighting

export const fightingSettingSelector = state => fightingSelector(state).setting
export const fightingPlayer1Selector = state => fightingSelector(state).setting.player1
export const fightingPlayer2Selector = state => fightingSelector(state).setting.player2
export const fightingTimeSelector = state => fightingSelector(state).setting.fightingTime
export const fightingWidthSelector = state => fightingSelector(state).setting.width
export const fightingHeightSelector = state => fightingSelector(state).setting.height

export const fightingStatusSelector = state => fightingSelector(state).status

export const fightingWinnerSelector = state => fightingSelector(state).playOnline.winner
export const fightingBoardSelector = state => fightingSelector(state).playOnline.board
export const fightingXIsNextSelector = state => fightingSelector(state).playOnline.xIsNext
export const fightingResultSelector = state => fightingSelector(state).playOnline.result
export const fightingMessageSelector = state => fightingSelector(state).playOnline.message
export const fightingIsOpponentLeaveSelector = state => fightingSelector(state).playOnline.isOpponentLeave

export const fightingIsPlayYourselfSelector = state => fightingSelector(state).playYourself.isPlayYourself

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