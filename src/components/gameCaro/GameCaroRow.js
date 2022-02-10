import React from 'react';
import { useSelector, } from 'react-redux';
import { fightingBoardSelector, fightingWinFiveCellsSelector, } from 'src/selectors/fightingSelector';

import Square from './Square';

const GameCaroRow = (props) => {
  const {yParam} = props
  const board = useSelector(fightingBoardSelector)
  const winFiveCells = useSelector(fightingWinFiveCellsSelector)

  let elementSquare = []
  if(board && board.length > 0){
    elementSquare = board.map((item, index) =>{
      if(item.y === yParam){
        const isWinCell = winFiveCells?.includes(index)
        return (
          <Square
            key={index}
            index={index}
            value={item.value}
            isWinCell={isWinCell}
          />
        )
      }
    })
  }


  return (
    <div className="d-flex justify-content-center">
      {elementSquare}
    </div>
  );
};

export default React.memo(GameCaroRow)