import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';

import Button from '@mui/material/Button';

import { onlineUserListSelector } from 'src/selectors/onlineUserSelector';
import { fightingStatusSelector } from 'src/selectors/fightingSelector';

import GameCaroContent from './GameCaroContent';
import GameCaroContentOnline from './GameCaroContentOnline';
import GameCaroOpponentListModal from './GameCaroOpponentListModal';
import GameCaroFindingOpponentModal from './GameCaroFindingOpponentModal';


const GameCaro = () => {
  const onlineUserList = useSelector(onlineUserListSelector)
  const fightingStatus = useSelector(fightingStatusSelector)

  const [isPlayYourself, setIsPlayYourself] = useState(false)
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
    setIsPlayYourself(false)
    setIsShowFindingOpponentModal(true)
    setIsShowOpponentListModal(false)
  }


  return (
    <>
      <h2 className="text-danger my-4 text-center">Game Caro</h2>
      <div className='text-center'>
        <Button
          variant="contained"
          color="error"
          onClick={()=>setIsPlayYourself(true)}
          disabled={isPlayYourself || (fightingStatus === 'waiting' ? false : true)}
        >Play with yourself</Button>
        <Button 
          variant="outlined"
          color="error"
          sx={{marginLeft: '10px', display: 'inline-block'}}
          onClick={()=>onFindOpponent()}
          disabled={fightingStatus === 'waiting' ? false : true}
        >Go find opponent</Button>
      </div>
      {isPlayYourself && <GameCaroContent/>}
      {fightingStatus !== 'waiting' && <GameCaroContentOnline />}

      {/* MODAL */}
      <GameCaroFindingOpponentModal
        isShowModal={isShowFindingOpponentModal}
        setIsShowModal={setIsShowFindingOpponentModal}
        setPrepareShowOpponentListModal={setPrepareShowOpponentListModal}
      />
      <GameCaroOpponentListModal
        isShowModal={isShowOpponentListModal}
        setIsShowModal={setIsShowOpponentListModal}
        setPrepareShowOpponentListModal={setPrepareShowOpponentListModal}
      />
    </>
  )
}

export default React.memo(GameCaro)