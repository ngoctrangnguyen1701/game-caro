import React from 'react';
import { useSelector } from 'react-redux';

import { fightingStatusSelector, fightingWinnerSelector, fightingXIsNextSelector } from 'src/selectors/fightingSelector';

const GameCaroFightingMessage = () => {
  const status = useSelector(fightingStatusSelector)
  const xIsNext = useSelector(fightingXIsNextSelector)
  const winner = useSelector(fightingWinnerSelector)

  return (
    <>
      {status === 'start' && 
        <h5
          className={xIsNext ? 'text-danger text-center' : 'text-primary text-center'}
        >Next player: {xIsNext ? 'X' : 'O'}</h5>
      }
      {status === 'stop' && winner === null &&
        <h5
          className='text-success text-center'
        >Draw</h5>
      }
      {status === 'stop' && winner &&
        <h5
          className='text-success text-center'
        >Winner: {winner}</h5>
      }
    </>
  );
};

export default React.memo(GameCaroFightingMessage)