import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { fightingAction } from 'src/reducers/fighting/statusSlice';
import { fightingStatusSelector, fightingWinnerSelector, fightingXIsNextSelector, fightingIsOpponentLeaveSelector } from 'src/selectors/fightingSelector';
import { socket } from 'src/App';

import { Button } from '@mui/material';
import GameCaroReplayFightingModal from './GameCaroReplayFightingModal';

const GameCaroFightingMessage = () => {
  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const xIsNext = useSelector(fightingXIsNextSelector)
  const winner = useSelector(fightingWinnerSelector)
  const isOpponentLeave = useSelector(fightingIsOpponentLeaveSelector)

  const [isShowReplayFightingModal, setIsShowReplayFightingModal] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(()=>{
    socket.on('suggestReplayFighting', data => {
      console.log('suggestReplayFighting')
      setIsShowReplayFightingModal(true)
      setMessage(data.message)
    })

    socket.on('agreeReplayFighting', data => {
      toast.success(data.message)
    })

    socket.on('disagreeReplayFighting', data => {
      dispatch(fightingAction.disagreeReplay(data))
    })

    socket.on('replayFighting', () => {
      dispatch(fightingAction.setting())
    })

    return () =>{
      socket.off('suggestReplayFighting')
      socket.off('agreeReplayFighting')
      socket.off('disagreeReplayFighting')
      socket.off('replayFighting')
    }
  }, [])

  useEffect(()=>{
    if(status === 'setting'){
      setIsShowReplayFightingModal(false)
    }
  }, [status])

  const handleReplay = () => {
    if(isOpponentLeave){
      toast.info('Player has already leave fighting')
    }
    else{
      socket.emit('suggestReplayFighting')
      dispatch(fightingAction.suggestReplay())
    }
  }
  

  return (
    <>
      {status === 'start' && 
        <h5
          className={xIsNext ? 'text-danger text-center' : 'text-primary text-center'}
        >Next player: {xIsNext ? 'X' : 'O'}</h5>
      }
      {status === 'stop' &&
        <>
          <h5
            className='text-success text-center'
          >{winner ? `Winner: ${winner}` : 'Draw'}</h5>
          <Button
            variant="contained"
            color='success'
            onClick={handleReplay}
            className="d-block mx-auto"
          >
            Replay
          </Button>
        </>
      }
      {/* MODAL */}
      <GameCaroReplayFightingModal
        isShowModal={isShowReplayFightingModal}
        setIsShowModal={setIsShowReplayFightingModal}
        message={message}
      />
    </>
  );
};

export default React.memo(GameCaroFightingMessage)