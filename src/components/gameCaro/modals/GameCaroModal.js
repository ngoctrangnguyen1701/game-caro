import React from 'react';

import GameCaroFindingOpponentModal from './GameCaroFindingOpponentModal';
import GameCaroOpponentListModal from './GameCaroOpponentListModal';
import GameCaroLeaveFightingModal from './GameCaroLeaveFightingModal';
import GameCaroReplayFightingModal from './GameCaroReplayFightingModal';

const GameCaroModal = props => {
  return (
    <>
      <GameCaroFindingOpponentModal/>
      <GameCaroOpponentListModal/> 
      <GameCaroLeaveFightingModal/>
      <GameCaroReplayFightingModal/>
    </>
  );
};

export default React.memo(GameCaroModal);