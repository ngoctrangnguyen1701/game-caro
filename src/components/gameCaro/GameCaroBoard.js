import React, {useEffect, useState, useContext} from "react";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "src/App";
import { fightingAction } from "src/reducers/fighting/playSlice";
import {
  fightingBoardSelector,
  fightingRowSelector,
  fightingStatusSelector,
  fightingHeightSelector,
  fightingWidthSelector,
  fightingPlayer1Selector,
  fightingPlayer2Selector,
  fightingIsPlayYourselfSelector,
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
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)

  useEffect(()=>{
    socket.on('changeTurn', data => {
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
    const {winValue, winFiveCells} = whoIsWinner(board, width, height)
    if(winValue){
      if(isPlayYourself){
        const winner = winValue === 'X' ? 'player1' : 'player2'
        dispatch(fightingAction.stop({result: 'win', winner, winFiveCells}))
        return
      }

      //when play online
      const winner = winValue === 'X' ? player1.username : player2.username
      if(winner === user.username){
        dispatch(fightingAction.stop({result: 'win', winner, message: `You have won`, winFiveCells}))
        socket.emit('playerHasWon', {winner, message: `${winner} has won`, winFiveCells})
      }
    }
  }, [board, isPlayYourself])

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
      {(status === 'start' || status === 'stop' || status === 'suggestReplay' || status === 'disagreeReplay') && elementRow}
    </div>
  );
}

export default React.memo(GameCaroBoard)