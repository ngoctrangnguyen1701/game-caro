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
}

const mySlice = createSlice({
  name: 'fighting',
  initialState,
  reducers: {
    settingComplete(state, action){
      const {width, height} = action.payload
      let newArr = []
      if(width && height){
        for(let y = 0; y < height; y++){
          let row = []
          for(let x = 0; x < width; x++){
            row.push({x, y, value: null})
          }
          newArr = [...newArr, ...row]
        }
      }
      // state.board = newArr
      return {
        ...initialState,
        board: newArr
      }
    },
    // changeTurn(state, action){
    //   const {index, value} = action.payload
    //   state.board[index].value = value
    //   state.xIsNext = !state.xIsNext
    // },
    // player1Turn(state, action){
    //   const {index, value} = action.payload
    //   if(xIsNext){
    //     socket.emit('player1Turn', {index, value})
    //     state.board[index].value = value
    //     state.xIsNext = false
    //   }
    // },
    // receivePlayer1Turn(state, action){
    //   state.board[index].value = value
    //   state.xIsNext = false
    // },
    // player2Turn(state, action){
    //   const {index, value} = action.payload
    //   if(!xIsNext){
    //     socket.emit('player2Turn', {index, value})
    //     state.board[index].value = value
    //     state.xIsNext = true
    //   }
    // },
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
    stop(state, action){
      state.result = action.payload?.result
      state.message = action.payload?.message
      state.winner = action.payload?.winner
      state.status = 'stop'
    },
    opponentLeave(state, action){
      state.isOpponentLeave = true
    },
  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer