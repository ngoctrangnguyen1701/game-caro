import React, {useContext, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { fightingAction } from 'src/reducers/fighting/statusSlice';
import { fightingStatusSelector, fightingWinnerSelector, fightingXIsNextSelector, fightingIsOpponentLeaveSelector, fightingIsPlayYourselfSelector,  } from 'src/selectors/fightingSelector';
import { socket } from 'src/App';
import { GameCaroModalContext } from './contexts/GameCaroModalContext';

import { Button } from '@mui/material';

import LoadingThreeDots from './LoadingThreeDots';

const StatusText = styled.div`
  color: #dc3545;
  font-weight: bold;
  text-align: center;
`

const GameCaroFightingStopStatus = () => {
  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const xIsNext = useSelector(fightingXIsNextSelector)
  const winner = useSelector(fightingWinnerSelector)
  const isOpponentLeave = useSelector(fightingIsOpponentLeaveSelector)
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)
  const dispatchModalContext = useContext(GameCaroModalContext).dispatch

  useEffect(()=>{
    socket.on('suggestReplayFighting', data => {
      console.log('suggestReplayFighting')
      dispatchModalContext({type: 'SHOW_REPLAY_FIGHTING_MODAL', payload: true})
      dispatchModalContext({type: 'MESSAGE_REPLAY_FIGHTING_MODAL', payload: data.message})
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
      dispatchModalContext({type: 'SHOW_REPLAY_FIGHTING_MODAL', payload: false})
    }
  }, [status])

  const handleReplay = () => {
    if(isPlayYourself){
      dispatch(fightingAction.setting())
      return
    } 
    
    //when play online, check opponent still is in fighting room
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
      {(status === 'stop' || status === 'suggestReplay' || status === 'disagreeReplay') &&
        <h5 className='text-success text-center'>
          {winner ? `Winner: ${winner}` : 'Draw'}
        </h5>
      }
      {status === 'stop' && 
        <Button
          variant="contained"
          color='success'
          onClick={handleReplay}
          className="d-block mx-auto"
        >
          Replay
        </Button>
      }
      {status === 'suggestReplay' && 
        <StatusText> 
          Waiting agree replay fighting
          <LoadingThreeDots/>
        </StatusText>
      }
      {status === 'disagreeReplay' &&
        <StatusText>
          Player has already disagree replay fighting
        </StatusText>
      }
    </>
  );
};

export default React.memo(GameCaroFightingStopStatus)