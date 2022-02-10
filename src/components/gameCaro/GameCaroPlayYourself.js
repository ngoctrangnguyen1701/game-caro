import React, { useEffect } from 'react';
import { useDispatch, } from 'react-redux';

import { fightingAction } from 'src/reducers/fighting/playSlice';

import GameCaroFightingSetting from './GameCaroFightingSetting';
import GameCaroFightingPrepareStatus from './GameCaroFightingPrepareStatus';
import GameCaroCountTime from './GameCaroCountTime';
import GameCaroBoard from './GameCaroBoard';
import GameCaroFightingStartStopStatus from './GameCaroFightingStartStopStatus';


const GameCaroPlayYourself = () => {
  console.log('render GameCaroPlayYourself');
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fightingAction.setting())
    dispatch(fightingAction.playYourself())
  }, [])

  return (
    <>
      <GameCaroFightingSetting/>
      <GameCaroFightingPrepareStatus/>
      <GameCaroCountTime/>
      <GameCaroFightingStartStopStatus/>
      <GameCaroBoard/>
    </>
  );
};

export default React.memo(GameCaroPlayYourself)
