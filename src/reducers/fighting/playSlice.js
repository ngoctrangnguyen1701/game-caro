import { createSlice } from "@reduxjs/toolkit";
import { socket } from "src/App";

const initialState = {
  board: [],
  xIsNext: true,
  winner: null,
  result: '',
  message: '',
  isOpponentLeave: false,
  status: '',
  isPlayYourself: true,
}

const mySlice = createSlice({
  name: 'fighting',
  initialState,
  reducers: {
    createBoard(state, action){
      state.board = action.payload.board
    },
    ownTurn(state, action){
      const {isPlayer1, index} = action.payload
      if((isPlayer1 && state.xIsNext) || (!isPlayer1 && !state.xIsNext)){
        if(state.status !== 'stop'){
          //trong lượt đánh của player1, player2 không được đánh
          //không được đánh khi trận đấu kết thúc (status === 'stop')
          const value = isPlayer1 ? 'X' : 'O'
          socket.emit('changeTurn', {index, value})
          state.board[index].value = value
          state.xIsNext = !state.xIsNext
        }
      }
    },
    opponentTurn(state, action){
      const {index, value} = action.payload
      state.board[index].value = value
      state.xIsNext = !state.xIsNext
    },
    waiting(state, action){
      return initialState
    },
    setting(state, action){
      state.status = ''
    },
    stop(state, action){
      state.result = action.payload?.result
      state.message = action.payload?.message
      state.winner = action.payload?.winner
      state.status = 'stop'
    },
    opponentLeave(state, action){
      state.isOpponentLeave = true
    },
    playYourself(state, action){
      if(state.status !== 'stop'){
        const value = state.xIsNext ? 'X' : 'O'
        state.board[action.payload.index].value = value
        state.xIsNext = !state.xIsNext
      }
    },
    playOnline(state, action){
      state.isPlayYourself = false
    }
  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer