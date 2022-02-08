import React, { useEffect } from 'react';
import { useDispatch, } from 'react-redux';

import { fightingAction } from 'src/reducers/fighting/statusSlice';

import GameCaroFightingSetting from './GameCaroFightingSetting';
import GameCaroFightingSettingStatus from './GameCaroFightingSettingStatus';
import GameCaroCountTime from './GameCaroCountTime';
import GameCaroBoard from './GameCaroBoard';
import GameCaroFightingMessage from './GameCaroFightingMessage';


const GameCaroPlayYourself = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fightingAction.setting())
    return () => dispatch(fightingAction.waiting())
  }, [])

  return (
    <>
      <GameCaroFightingSetting/>
      <GameCaroFightingSettingStatus/>
      <GameCaroCountTime/>
      <GameCaroFightingMessage/>
      <GameCaroBoard/>
    </>
  );
};

export default React.memo(GameCaroPlayYourself)