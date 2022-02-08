import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import Button from '@mui/material/Button';

import { onlineUserListSelector } from 'src/selectors/onlineUserSelector';
import { fightingIsPlayYourselfSelector, fightingStatusSelector } from 'src/selectors/fightingSelector';
import { fightingAction } from 'src/reducers/fighting/playYourselfSlice';

import GameCaroContent from './GameCaroContent';
import GameCaroPlayOnline from './GameCaroPlayOnline';
import GameCaroOpponentListModal from './GameCaroOpponentListModal';
import GameCaroFindingOpponentModal from './GameCaroFindingOpponentModal';


const GameCaroHeader = () => {
  const dispatch = useDispatch()
  const onlineUserList = useSelector(onlineUserListSelector)
  const fightingStatus = useSelector(fightingStatusSelector)
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)

  // const [isPlayYourself, setIsPlayYourself] = useState(false)
  const [isShowFindingOpponentModal, setIsShowFindingOpponentModal] = useState(false)
  const [isShowOpponentListModal, setIsShowOpponentListModal] = useState(false)
  const [prepareShowOpponentListModal, setPrepareShowOpponentListModal] = useState(false)

  useEffect(()=>{
    if(prepareShowOpponentListModal) setIsShowOpponentListModal(true)
  }, [prepareShowOpponentListModal])

  useEffect(()=>{
    if(onlineUserList.length === 0) setIsShowOpponentListModal(false)
  }, [onlineUserList])

  useEffect(()=>{
    if(fightingStatus === 'setting'){
      //off modal when received agree
      setIsShowFindingOpponentModal(false)
      setIsShowOpponentListModal(false)
    }
  }, [fightingStatus])

  const onFindOpponent = () =>{
    // setIsPlayYourself(false)
    setIsShowFindingOpponentModal(true)
    setIsShowOpponentListModal(false)
  }

  // const onPlayYourSelf = () => {
  //   dispatch(fightingAction.playYourself())
  // }


  return (
    <>
      <h2 className="text-danger my-4 text-center">Game Caro</h2>
      <div className='text-center'>
        <Link to='/game-caro/play-yourself'>
          <Button
            variant="contained"
            color="error"
            // onClick={()=>setIsPlayYourself(true)}
            // onClick={()=>dispatch(fightingAction.playYourself())}
            disabled={isPlayYourself ? false : (fightingStatus === 'waiting' ? false : true)}
            // disabled={isPlayYourself || (fightingStatus === 'waiting' ? false : true)}
          >Play with yourself</Button>
        </Link>
        <Button 
          variant="outlined"
          color="error"
          sx={{marginLeft: '10px', display: 'inline-block'}}
          onClick={onFindOpponent}
          disabled={isPlayYourself ? false : (fightingStatus === 'waiting' ? false : true)}
          // disabled={fightingStatus === 'waiting' ? false : true}
        >Go find opponent</Button>
      </div>
      {/* {isPlayYourself && <GameCaroContent/>}
      {fightingStatus !== 'waiting' && <GameCaroPlayOnline />} */}

      {/* MODAL */}
      {/* <GameCaroFindingOpponentModal
        isShowModal={isShowFindingOpponentModal}
        setIsShowModal={setIsShowFindingOpponentModal}
        setPrepareShowOpponentListModal={setPrepareShowOpponentListModal}
      />
      <GameCaroOpponentListModal
        isShowModal={isShowOpponentListModal}
        setIsShowModal={setIsShowOpponentListModal}
        setPrepareShowOpponentListModal={setPrepareShowOpponentListModal}
      /> */}
    </>
  )
}

export default React.memo(GameCaroHeader)