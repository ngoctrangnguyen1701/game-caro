import React, {useEffect, useState, useContext} from "react";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "src/App";
import { fightingAction } from "src/reducers/fighting/playOnlineSlice";
import {
  fightingBoardSelector,
  fightingRowSelector,
  fightingStatusSelector,
  fightingHeightSelector,
  fightingWidthSelector,
  fightingPlayer1Selector,
  fightingPlayer2Selector,
} from "src/selectors/fightingSelector";
import { AuthContext } from "src/contexts/AuthContextProvider";
import whoIsWinner from './functions/whoIsWinner';

import GameCaroRow from "./GameCaroRow";

const GameCaroBoard = () =>{
  const {user} = useContext(AuthContext)
  const dispatch = useDispatch()
  const row = useSelector(fightingRowSelector)
  const status = useSelector(fightingStatusSelector)
  const board = useSelector(fightingBoardSelector)
  const height = useSelector(fightingHeightSelector)
  const width = useSelector(fightingWidthSelector)
  const player1 = useSelector(fightingPlayer1Selector)
  const player2 = useSelector(fightingPlayer2Selector)

  useEffect(()=>{
    socket.on('changeTurn', data => {
      // console.log('changeTurn: ', data)
      return dispatch(fightingAction.opponentTurn(data))
      //return to not double dispatch
    })

    socket.on('opponentHasWon', data => {
      return dispatch(fightingAction.stop({result: 'lose', message: data.message, winner: data.winner}))
    })
    //when component unmount, off listen 'changeTurn',
    //avoid to create many function listen when component render
    return () => {
      socket.off('changeTurn')
      socket.off('opponentHasWon')
    }
  }, [])

  useEffect(()=>{
    const winValue = whoIsWinner(board, width, height)
    console.log({winValue});
    if(winValue){
      const winner = winValue === 'X' ? player1.username : player2.username
      console.log({winner});
      if(winner === user.username){
        dispatch(fightingAction.stop({result: 'win', winner, message: `You have won`}))
        socket.emit('playerHasWon', {winner, message: `${winner} has won`})
      }
    }
  }, [board])

  let elementRow = []
  if(row && row.length > 0){
    elementRow = row.map((item, index) => {
      return (
        <GameCaroRow
          key={index}
          yParam={item}
        />
      )
    })
  }
  

  return (
    <div className="mt-3">
      {(status === 'start' || status === 'stop') && elementRow}
    </div>
  );
}

export default React.memo(GameCaroBoard)