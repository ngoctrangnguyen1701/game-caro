import React, { useContext } from "react";
import { useDispatch, useSelector} from 'react-redux';

import { AuthContext } from "src/contexts/AuthContextProvider";
import { fightingAction } from 'src/reducers/fighting/playSlice';
import { fightingIsPlayYourselfSelector, fightingPlayer1Shape, fightingPlayer2Shape } from "src/selectors/fightingSelector";
import chessEffectFunc from "./functions/chessEffectFunc";

const style = {
  width: '30px', 
  height: '30px',
  border: '1px solid #ddd',
  display: 'inline-block',
  fontWeight: 'bold',
  fontSize: '18px',
  padding: '0',  
}


// let i = 1
const Square = ({index, value, isWinCell}) => {
  // console.log(`Square ${index} render ${i++}`);
  const {user} = useContext(AuthContext)
  const dispatch = useDispatch()
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)
  const player1Shape = useSelector(fightingPlayer1Shape)
  const player2Shape = useSelector(fightingPlayer2Shape)

  const handleClick = () => {
    const {isPlayer1} = user
    if(value === null){
      //không đánh trùng với ô đã có giá trị
      if(isPlayYourself){
        dispatch(fightingAction.changeTurnPlayYourself({index}))
        return
      }
      //when play online
      dispatch(fightingAction.ownTurn({isPlayer1, index}))
    }
  }


  return (
    <button 
      onClick={()=>handleClick()}
      style={style}
      // className={value === 'X' ? 'text-danger' : 'text-primary'}
    >
      <div className={chessEffectFunc(value, isWinCell)}>
        {value === 'X' && player1Shape.includes('http') && <img style={{width: '100%'}} src={player1Shape}/>}
        {value === 'X' && !player1Shape.includes('http') && value}
        {value === 'O' && player2Shape.includes('http') && <img style={{width: '100%'}} src={player2Shape}/>}
        {value === 'O' && !player2Shape.includes('http') && value}
      </div>
    </button>
  );
}

export default React.memo(Square)