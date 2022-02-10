import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { fightingIsPlayOnlineSelector } from 'src/selectors/fightingSelector';

import GameCaroFightingSetting from './GameCaroFightingSetting';
import GameCaroBoard from './GameCaroBoard';
import GameCaroFightingPrepareStatus from './GameCaroFightingPrepareStatus';
import GameCaroCountTime from './GameCaroCountTime';
import GameCaroFightingStartStopStatus from './GameCaroFightingStartStopStatus';
import { fightingAction } from 'src/reducers/fighting/playSlice';



function GameCaroPlayOnline() {
  console.log('render GameCaroPlayOnline');
  const dispatch = useDispatch()
  const isPlayOnline = useSelector(fightingIsPlayOnlineSelector)

  useEffect(()=>{
    return () => dispatch(fightingAction.waiting())
  }, [])

  return (
    <>
      {isPlayOnline === false && <Navigate to="/game-caro"/>}
      <GameCaroFightingSetting/>
      <GameCaroFightingPrepareStatus/>
      <GameCaroCountTime/>
      <GameCaroFightingStartStopStatus/>
      <GameCaroBoard/>
    </>
  );
}

export default React.memo(GameCaroPlayOnline)