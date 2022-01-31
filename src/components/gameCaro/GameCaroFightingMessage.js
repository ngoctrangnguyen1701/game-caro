import React from 'react';
import { useSelector } from 'react-redux';

import { fightingStatusSelector, fightingXIsNextSelector } from 'src/selectors/fightingSelector';

const GameCaroFightingMessage = () => {
  const status = useSelector(fightingStatusSelector)
  const xIsNext = useSelector(fightingXIsNextSelector)

  return (
    <>
      {status === 'start' && <h5 className='text-danger text-center'>Next player: {xIsNext ? 'X' : 'O'}</h5>}
    </>
  );
};

export default React.memo(GameCaroFightingMessage)