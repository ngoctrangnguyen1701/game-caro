import React, { useContext } from "react";
import { useDispatch} from 'react-redux';

import { AuthContext } from "src/contexts/AuthContextProvider";
import { fightingAction } from 'src/reducers/fighting/playSlice';

const style = {
  width: '30px', 
  height: '30px',
  border: '1px solid #ddd',
  display: 'inline-block',
  fontWeight: 'bold',
  fontSize: '18px',
}

const effect = ['animate__jackInTheBox', 'animate__rubberBand', 'animate__bounce', 'animate__headShake', 'animate__heartBeat', 'animate__flipInX', 'animate__flipInY', 'animate__lightSpeedInRight', 'animate__zoomIn', 'animate__slideInDown']
const randomEffect = () => {
  const index = Math.floor(Math.random()*10)
  return `animate__animated ${effect[index]} animate__faster`
}


let i = 1
const Square = ({index, value}) => {
  console.log(`Square ${index} render ${i++}`);
  const dispatch = useDispatch()
  const {user} = useContext(AuthContext)

  const handleClick = () => {
    const {isPlayer1} = user
    // if(value === null && status !== 'stop'){
    if(value === null) dispatch(fightingAction.ownTurn({isPlayer1, index}))
    // if(value === null) dispatch({type: 'fighting/play', payload: {isPlayer1, index}})
    //không đánh trùng với ô đã có giá trị
  }

  return (
    <button 
      onClick={()=>handleClick()}
      style={style}
      className={value === 'X' ? 'text-danger' : 'text-primary'}
    >
      <div className={value && randomEffect()}>{value}</div>
    </button>
  );
}

export default React.memo(Square)