import React, {useEffect, useState, useContext} from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@mui/material/Button';

import { onlineUserListSelector } from 'src/selectors/onlineUserSelector';
import { fightingIsPlayYourselfSelector, fightingStatusSelector } from 'src/selectors/fightingSelector';
import { GameCaroModalContext } from './contexts/GameCaroModalContext';


import GameCaroContent from './GameCaroContent';
import GameCaroPlayOnline from './GameCaroPlayOnline';
import GameCaroOpponentListModal from './GameCaroOpponentListModal';
import GameCaroFindingOpponentModal from './GameCaroFindingOpponentModal';


const GameCaroHeader = () => {
  const onlineUserList = useSelector(onlineUserListSelector)
  const status = useSelector(fightingStatusSelector)
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)

  // const [isShowFindingOpponentModal, setIsShowFindingOpponentModal] = useState(false)
  // const [isShowOpponentListModal, setIsShowOpponentListModal] = useState(false)
  // const [prepareShowOpponentListModal, setPrepareShowOpponentListModal] = useState(false)
  const prepareShowOpponentListModal = useContext(GameCaroModalContext).state.prepareShowOpponentListModal
  const dispatchModalContext = useContext(GameCaroModalContext).dispatch

  // useEffect(()=>{
  //   if(prepareShowOpponentListModal) setIsShowOpponentListModal(true)
  // }, [prepareShowOpponentListModal])
  useEffect(()=>{
    if(prepareShowOpponentListModal) {
      dispatchModalContext({type: 'SHOW_OPPONENT_LIST_MODAL', payload: true})
    }
  }, [prepareShowOpponentListModal])

  useEffect(()=>{
    if(onlineUserList.length === 0) {
      //when no user online, modal 'opponent list' will be close
      // setIsShowOpponentListModal(false)
      dispatchModalContext({type: 'SHOW_OPPONENT_LIST_MODAL', payload: false})
    }
  }, [onlineUserList])

  useEffect(()=>{
    if(status === 'setting'){
      //close modal when received agree
      // setIsShowFindingOpponentModal(false)
      // setIsShowOpponentListModal(false)
      dispatchModalContext({type: 'SHOW_FINDING_OPPONENT_MODAL', payload: false})
      dispatchModalContext({type: 'SHOW_OPPONENT_LIST_MODAL', payload: false})
    }
  }, [status])

  const onFindOpponent = () =>{
    // setIsShowFindingOpponentModal(true)
    // setIsShowOpponentListModal(false)
    dispatchModalContext({type: 'SHOW_FINDING_OPPONENT_MODAL', payload: true})
    dispatchModalContext({type: 'SHOW_OPPONENT_LIST_MODAL', payload: false})
  }


  return (
    <>
      {!isPlayYourself && status !== 'watting' && <Navigate to='/game-caro/play-online'/>}
      <h2 className="text-danger my-4 text-center">Game Caro</h2>
      
      <div className='text-center'>
        {/* <Link to='/game-caro/play-yourself'> */}
        <Link to={isPlayYourself ? '/game-caro/play-yourself' : (status === 'waiting' ? '/game-caro/play-yourself' : '#')}>
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
      {/* {isPlayYourself && <GameCaroContent/>}
      {fightingStatus !== 'waiting' && <GameCaroPlayOnline />} */}

      {/* MODAL */}
      <GameCaroFindingOpponentModal
        // isShowModal={isShowFindingOpponentModal}
        // setIsShowModal={setIsShowFindingOpponentModal}
        // setPrepareShowOpponentListModal={setPrepareShowOpponentListModal}
      />
      <GameCaroOpponentListModal
        // isShowModal={isShowOpponentListModal}
        // setIsShowModal={setIsShowOpponentListModal}
        // setPrepareShowOpponentListModal={setPrepareShowOpponentListModal}
      />
    </>
  )
}

export default React.memo(GameCaroHeader)