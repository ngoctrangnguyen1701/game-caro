import React, {useContext, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { fightingAction } from 'src/reducers/fighting/statusSlice';
import {
  fightingStatusSelector,
  fightingWinnerSelector,
  fightingXIsNextSelector,
  fightingIsOpponentLeaveSelector,
  fightingIsPlayYourselfSelector,
  fightingPlayer1Shape,
  fightingPlayer2Shape,
} from 'src/selectors/fightingSelector';
import { socket } from 'src/App';
import { GameCaroModalContext } from './contexts/GameCaroModalContext';

import { Button, Grid } from '@mui/material';
import { Slider, Rail, CircleLine, Ball } from './styles/GameCaroSliderStyle';

import LoadingThreeDots from './LoadingThreeDots';

const StatusText = styled.div`
  color: #dc3545;
  font-weight: bold;
  text-align: center;
`

const GameCaroFightingStartStopStatus = () => {
  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const xIsNext = useSelector(fightingXIsNextSelector)
  const winner = useSelector(fightingWinnerSelector)
  const isOpponentLeave = useSelector(fightingIsOpponentLeaveSelector)
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)
  const player1Shape = useSelector(fightingPlayer1Shape)
  const player2Shape = useSelector(fightingPlayer2Shape)

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
      {(status === 'start' || status === 'stop' || status === 'suggestReplay' || status === 'disagreeReplay') && 
        <Grid item xs={6} style={{margin: '24px auto'}}>
          <Slider>
            <Rail/>
            <CircleLine className={xIsNext ? 'left' : 'right'}>
              <Ball>Turn</Ball>
            </CircleLine>
          </Slider>
        </Grid>
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

export default React.memo(GameCaroFightingStartStopStatus)