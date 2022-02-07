import React from 'react';
import { useSelector, } from 'react-redux';
import { fightingBoardSelector, } from 'src/selectors/fightingSelector';

import Square from './Square';

const GameCaroRow = (props) => {
  const {yParam} = props
  const board = useSelector(fightingBoardSelector)

  let elementSquare = []
  if(board && board.length > 0){
    elementSquare = board.map((item, index) =>{
      if(item.y === yParam){
        return (
          <Square
            key={index}
            index={index}
            value={item.value}
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