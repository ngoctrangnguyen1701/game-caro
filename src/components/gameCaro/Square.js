import React, { useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';

import { socket } from "src/App";
import { AuthContext } from "src/contexts/AuthContextProvider";
import { fightingAction } from 'src/reducers/fighting/playSlice';
import { fightingStatusSelector, fightingXIsNextSelector } from "src/selectors/fightingSelector";

const style = {
  width: '30px', 
  height: '30px',
  border: '1px solid #ddd',
  display: 'inline-block',
  fontWeight: 'bold',
  fontSize: '18px',
}

// let i = 1
const Square = ({index, value, onClick }) => {
  // console.log(`Square ${index} render ${i++}`);
  const dispatch = useDispatch()
  const {user} = useContext(AuthContext)
  const xIsNext = useSelector(fightingXIsNextSelector)
  const status = useSelector(fightingStatusSelector)

  const handleClick = () => {
    // console.log('handleClick: ', index);
    if((user.isPlayer1 && xIsNext === true) || (!user.isPlayer1 && xIsNext === false)){
      if(value === null && status !== 'stop'){
        //trong lượt đánh của player1, player2 không được đánh
        //không đánh trùng với ô đã có giá trị
        //không được đánh khi trận đấu kết thúc (status === 'stop')
        const value = user.isPlayer1 ? 'X' : 'O'
        socket.emit('changeTurn', {index, value})
        dispatch(fightingAction.changeTurn({index, value}))
      }
    }
  }

  return (
    <button 
      onClick={()=>handleClick()}
      style={style}
      className={value === 'X' ? 'text-danger' : 'text-primary'}
    >
      {value}
    </button>
  );
}

export default React.memo(Square)