import React from 'react'

import GameCaroFightingSetting from './GameCaroFightingSetting';
import GameCaroBoard from './GameCaroBoard';
import GameCaroFightingSettingStatus from './GameCaroFightingSettingStatus';
import GameCaroCountTime from './GameCaroCountTime';
import GameCaroFightingMessage from './GameCaroFightingMessage';


function GameCaroContentOnline() {

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

export default React.memo(GameCaroContentOnline)