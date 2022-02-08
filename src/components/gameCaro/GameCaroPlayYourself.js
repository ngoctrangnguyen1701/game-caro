import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {fightingIsPlayYourselfSelector} from 'src/selectors/fightingSelector'
import { fightingAction } from 'src/reducers/fighting/statusSlice';

import GameCaroFightingSetting from './GameCaroFightingSetting';


const GameCaroPlayYourself = () => {
  const dispatch = useDispatch()
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)

  useEffect(() => {
    dispatch(fightingAction.setting())
  }, [])

  return (
    <>
      <GameCaroFightingSetting isPlayYourself={isPlayYourself}/>
    </>
  );
};

export default React.memo(GameCaroPlayYourself) 