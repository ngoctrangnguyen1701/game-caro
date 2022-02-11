import React, {useEffect, useContext} from 'react'
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';

import { fightingIsPlayYourselfSelector, fightingStatusSelector } from 'src/selectors/fightingSelector';
import { GameCaroModalContext } from './contexts/GameCaroModalContext';


const GameCaroHeader = () => {
  const location = useLocation()
  const {pathname} = location

  const status = useSelector(fightingStatusSelector)
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)

  const dispatchModalContext = useContext(GameCaroModalContext).dispatch

  useEffect(()=>{
    if(status === 'setting'){
      //close modal when received agree
      dispatchModalContext({type: 'SHOW_FINDING_OPPONENT_MODAL', payload: false})
      dispatchModalContext({type: 'SHOW_OPPONENT_LIST_MODAL', payload: false})
    }
  }, [status])

  const onFindOpponent = () =>{
    dispatchModalContext({type: 'SHOW_FINDING_OPPONENT_MODAL', payload: true})
    dispatchModalContext({type: 'SHOW_OPPONENT_LIST_MODAL', payload: false})
  }


  return (
    <>
      <h2 className="text-danger my-4 text-center">Game Caro</h2>
      
      <div className='text-center'>
        <Link to={pathname.includes('play-online') ? '/game-caro/play-online' : '/game-caro/play-yourself'}>
          <Button
            variant="contained"
            color="error"
            disabled={isPlayYourself ? false : (status === 'waiting' ? false : true)}
          >Play with yourself</Button>
        </Link>
        <Button 
          variant="outlined"
          color="error"
          sx={{marginLeft: '10px', display: 'inline-block'}}
          onClick={onFindOpponent}
          disabled={isPlayYourself ? false : (status === 'waiting' ? false : true)}
        >Go find opponent</Button>
      </div>
    </>
  )
}

export default React.memo(GameCaroHeader)