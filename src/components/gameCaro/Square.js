import React from "react";
import { useDispatch } from 'react-redux';


import { fightingAction } from 'src/reducers/fighting/playSlice';

const style = {
  width: '30px', 
  height: '30px',
  border: '1px solid #ddd',
  display: 'inline-block',
  fontWeight: 'bold',
  fontSize: '18px',
}

let i = 1
const Square = ({index, value }) => {
  console.log(`Square ${index} render ${i++}`);
  const dispatch = useDispatch()

  return (
    <button 
      onClick={()=>dispatch(fightingAction.changeTurn({index}))}
      style={style}
      className={value === 'X' ? 'text-danger' : 'text-primary'}
    >
      {value}
    </button>
  );
}

export default React.memo(Square)