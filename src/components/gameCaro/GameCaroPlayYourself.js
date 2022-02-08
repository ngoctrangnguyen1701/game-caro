import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {fightingIsPlayYourselfSelector} from 'src/selectors/fightingSelector'
import { fightingAction } from 'src/reducers/fighting/statusSlice';
// import { fightingAction as fightingPlayYourselfAction } from 'src/reducers/fighting/playYourselfSlice';

import GameCaroFightingSetting from './GameCaroFightingSetting';
import GameCaroFightingSettingStatus from './GameCaroFightingSettingStatus';
import GameCaroCountTime from './GameCaroCountTime';
import GameCaroBoard from './GameCaroBoard';
import GameCaroFightingMessage from './GameCaroFightingMessage';


const GameCaroPlayYourself = () => {
  const dispatch = useDispatch()
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)

  useEffect(() => {
    dispatch(fightingAction.setting())
    return () => dispatch(fightingAction.waiting())
  }, [])

  return (
    <>
      <GameCaroFightingSetting isPlayYourself={isPlayYourself}/>
      <GameCaroFightingSettingStatus isPlayYourself={isPlayYourself}/>
      <GameCaroCountTime isPlayYourself={isPlayYourself}/>
      <GameCaroFightingMessage isPlayYourself={isPlayYourself}/>
      <GameCaroBoard isPlayYourself={isPlayYourself}/>
    </>
  );
};

export default React.memo(GameCaroPlayYourself)