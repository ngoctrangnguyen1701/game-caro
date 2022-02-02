import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fightingBoardSelector } from 'src/selectors/fightingSelector';
import Square from './Square';

const GameCaroRow = (props) => {
  const {yParam} = props

  const board = useSelector(fightingBoardSelector)

  // const handleClick = index => {
  //   console.log('handleClick: ', index)
  //   // squares[index].value = xIsNext ? "X" : "O"
  //   // setXIsNext(!xIsNext)
  //   // const value = xIsNext ? 'X' : 'O'
  //   dispatch(fightingAction.changeTurn({index}))
  // }
  //↑ nếu như viết function ở đây, mỗi lần useSelector thay đổi, component sẽ render lại
  //khi render lại sẽ tạo ra 1 function 'handleClick' mới
  //do truyền props onClick là function 'handleClick' nên đồng nghĩa với việc truyền 1 props mới
  //do đó component 'Square' sẽ bị render lại

  let elementSquare = []
  if(board && board.length > 0){
    elementSquare = board.map((item, index) =>{
      if(item.y === yParam){
        return (
          <Square
            key={index}
            index={index}
            value={item.value}
            // onClick={()=>handleClick(index)}
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