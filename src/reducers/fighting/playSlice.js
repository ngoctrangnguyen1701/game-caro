import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  board: [],
  xIsNext: true,
  winner: null,
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
      state.board = newArr
    },
    changeTurn(state, action){
      state.board[action.payload.index].value = state.xIsNext ? 'X' : 'O'
      state.xIsNext = !state.xIsNext
    },

  }
})

export const fightingAction = mySlice.actions
export default mySlice.reducer