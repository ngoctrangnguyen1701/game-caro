import React from 'react'

import GameCaroFightingSetting from './GameCaroFightingSetting';
import GameCaroBoard from './GameCaroBoard';
import GameCaroFightingSettingStatus from './GameCaroFightingSettingStatus';
import GameCaroCountTime from './GameCaroCountTime';
import GameCaroFightingMessage from './GameCaroFightingMessage';


function GameCaroPlayOnline() {

  return (
    <>
      <GameCaroFightingSetting/>
      <GameCaroFightingSettingStatus/>
      <GameCaroCountTime/>
      <GameCaroFightingMessage/>
      <GameCaroBoard/>
    </>
  );
}

export default React.memo(GameCaroPlayOnline)