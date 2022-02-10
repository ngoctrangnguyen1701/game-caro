import React, {useContext, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Grid,
  Button,
  Box,
} from '@mui/material'

import { AuthContext } from 'src/contexts/AuthContextProvider';
import { socket } from 'src/App';
import {
  fightingIsPlayOnlineSelector,
  fightingIsPlayYourselfSelector,
  fightingPlayer1Shape,
  fightingResultSelector,
  fightingSettingSelector,
  fightingStatusSelector,
  fightingPlayer2Shape,
} from 'src/selectors/fightingSelector';
import { fightingAction } from 'src/reducers/fighting/statusSlice';
import { fightingAction as fightingPlayAction} from 'src/reducers/fighting/playSlice';
import { fightingAction as fightingSettingAction } from 'src/reducers/fighting/settingSlice';

import createBoardFunc from './functions/createBoardFunc';
import { GameCaroModalContext } from './contexts/GameCaroModalContext';
import GameCaroPlayer from './GameCaroPlayer';

const isDisabledInputSelect = ({isPlayYourself, isPlayer1, status}) => {
  if(status === 'setting'){
    if(isPlayYourself || isPlayer1) return false
  } 
  return true
}


const GameCaroFightingSetting = () => {
  const {user, setUser} = useContext(AuthContext)
  const isPlayer1 = user.isPlayer1

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const result = useSelector(fightingResultSelector)
  const {height, width, fightingTime, player1, player2} = useSelector(fightingSettingSelector)
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)
  const isPlayOnline = useSelector(fightingIsPlayOnlineSelector)
  const player1Shape = useSelector(fightingPlayer1Shape)
  const player2Shape = useSelector(fightingPlayer2Shape)

  const dispatchModalContext = useContext(GameCaroModalContext).dispatch

  useEffect(()=>{
    if(user.username === player1?.username){
      setUser({...user, isPlayer1: true})
    }
    else{
      setUser({...user, isPlayer1: false})
    }
  }, [player1, player2])

  useEffect(()=>{
    if(isPlayOnline){
      if(isPlayer1){
        socket.on('receiveDisagreeFightingSetting', () => {
          dispatch(fightingAction.resetSetting())
          toast.error(`${player2?.username} has already disagree fighting setting`)
        })
      }
      else{
        //only player2 listen event 'receiveFightingSetting'
        socket.on('receiveFightingSetting', data => {
          dispatch(fightingAction.settingComplete(data.receiveFightingSetting))
          const {width, height} = data.receiveFightingSetting
          dispatch(fightingPlayAction.createBoard({board: createBoardFunc(width, height)}))
        })
      }

      socket.on('opponentChangeChessShape', data => {
        dispatch(fightingSettingAction.changeShape(data))
      })

      socket.on('startFighting', () => {
        console.log('startFighting')
        dispatch(fightingAction.start())
      })

      return () => {
        socket.off('receiveFightingSetting')
        socket.off('receiveDisagreeFightingSetting')
        socket.off('opponentChangeChessShape')
        socket.off('startFighting')
      }
    }
    //if don't off listen event when this component unmount
    //every this component render, one function listen on will be created
  }, [isPlayer1, isPlayOnline])

  useEffect(()=>{
    if(isPlayOnline){
      if(status === 'stop'){
        socket.emit('stopFighting', {fightingResult: result})
        socket.on('opponentLeaveFighting', data => {
          toast.info(data.message)
          dispatch(fightingPlayAction.opponentLeave())
        })
      }
      else{
        //when player leave, but fighting still be stop yet, that player will be lose and another player will win
        socket.on('opponentLeaveFighting', data => {
          dispatch(fightingPlayAction.opponentLeave())
          dispatch(fightingAction.stop({result: 'win', message: data.message, winner: user.username}))
          dispatchModalContext({type: 'SHOW_LEAVE_FIGHTING_MODAL', payload: true})
        })
      }
      return () => socket.off('opponentLeaveFighting')
    }
  }, [status, isPlayOnline])


  //-------------------------------------------
  const handleChangeSize = obj => {
    const {height, width} = obj
    if(height && height <= 30 && height >= 15){
      dispatch(fightingAction.setting({height}))
    }
    if(width && width <= 30 && width >= 15){
      dispatch(fightingAction.setting({width}))
    }
  }

  const handleChangeShape = obj => {
    if(status === 'setting'){
      if(player1Shape === obj.player2Shape || player2Shape === obj.player1Shape){
        toast.error(`Please choose shape of chess that diffrent with oppnent's one`)
        return
      }
      if(isPlayOnline){
        socket.emit('changeChessShape', obj)
      }
      dispatch(fightingSettingAction.changeShape(obj))
    }
  }


  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-between">
          <GameCaroPlayer
            label='Player1'
            player={player1}
            user={user}
            onChangeShape={value => handleChangeShape({player1Shape: value})}
            defaultChessShape='X'
            chessShape={player1Shape}
            disabledChangeShape={isPlayOnline ? isPlayer1 ? false : true : false}
            //when play online, player1 can not change shape of chess of player2
            //if not play online, no disable
          />
          <GameCaroPlayer
            label='Player2'
            player={player2}
            user={user}
            onChangeShape={value => handleChangeShape({player2Shape: value})}
            defaultChessShape='O'
            chessShape={player2Shape}
            disabledChangeShape={isPlayOnline ? isPlayer1 ? true : false : false}
            //when play online, player2 can not change shape of chess of player1
            //if not play online, no disable
          />
        </div>
        <Box className='d-flex justify-content-center align-items-center'>
          <label>Width of board (min: 15, max: 30)</label>
          <TextField
            color="error"
            size='small'
            hiddenLabel
            variant="filled"
            type="number"
            value={width}
            sx={{width: 60, marginLeft: 1}}
            onChange={e=> handleChangeSize({width: parseInt(e.target.value)})}
            disabled={isDisabledInputSelect({isPlayYourself, isPlayer1, status})}
          />
        </Box>
        <Box className='d-flex justify-content-center align-items-center mt-2'>
          <label>Height of board (min: 15, max: 30)</label>
          <TextField
            color="error"
            size='small'
            hiddenLabel
            variant="filled"
            type="number"
            value={height}
            sx={{width: 60, marginLeft: 1}}
            onChange={e=> handleChangeSize({height: parseInt(e.target.value)})}
            disabled={isDisabledInputSelect({isPlayYourself, isPlayer1, status})}
          />
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl sx={{ m: 1, minWidth: 140 }}>
              <InputLabel>Fighting time</InputLabel>
              <Select
                value={fightingTime}
                onChange={e=>dispatch(fightingAction.setting({fightingTime: e.target.value}))}
                disabled={isDisabledInputSelect({isPlayYourself, isPlayer1, status})}
                color='success'
              >
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {isPlayOnline && 
            <Grid item xs={6} className='d-flex justify-content-end align-items-center'>
              <Button
                variant="contained"
                color="error"
                onClick={()=>dispatchModalContext({type: 'SHOW_LEAVE_FIGHTING_MODAL', payload: true})}
              >
                Leave fighting
              </Button>
            </Grid>
          }
        </Grid>
      </div>
    </>
  )
}

export default React.memo(GameCaroFightingSetting)