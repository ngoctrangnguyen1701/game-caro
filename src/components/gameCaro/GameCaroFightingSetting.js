import React, {useContext, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Avatar,
  Select,
  Grid,
  Button,
  Box,
} from '@mui/material'

import { AuthContext } from 'src/contexts/AuthContextProvider';
import { socket } from 'src/App';
import { fightingIsPlayOnlineSelector, fightingIsPlayYourselfSelector, fightingResultSelector, fightingSettingSelector, fightingStatusSelector } from 'src/selectors/fightingSelector';
import { fightingAction } from 'src/reducers/fighting/statusSlice';
import { fightingAction as fightingPlayAction} from 'src/reducers/fighting/playSlice';

import createBoardFunc from './functions/createBoardFunc';
import { GameCaroModalContext } from './contexts/GameCaroModalContext';

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
          // console.log('receiveDisagreeFightingSetting')
          dispatch(fightingAction.resetSetting())
          toast.error(`${player2?.username} has already disagree fighting setting`)
        })
      }
      else{
        //only player2 listen event 'receiveFightingSetting'
        socket.on('receiveFightingSetting', data => {
          // console.log('receiveFightingSetting: ', data)
          dispatch(fightingAction.settingComplete(data.receiveFightingSetting))
          const {width, height} = data.receiveFightingSetting
          dispatch(fightingPlayAction.createBoard({board: createBoardFunc(width, height)}))
        })
      }
      socket.on('startFighting', () => {
        console.log('startFighting')
        dispatch(fightingAction.start())
      })

      return () => {
        socket.off('receiveFightingSetting')
        socket.off('receiveDisagreeFightingSetting')
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


  return (
    <>
      <div className="container mt-5">
        <div className="row justify-content-between">
          <div className="col-4 text-center">
            <TextField
              error={player1.username === user.username}
              disabled={player1.username !== user.username}
              label="Player1"
              value={player1.username || ''} 
              //do khi play yourself 'player1.username' sẽ là undefined,
              //và khi chuyển qua play online, 'player1.username' sẽ có giá trị
              //value của thẻ <input> chuyển từ undefined -> sang có giá trị sẽ bị báo lỗi
              //nên thêm giá trị rỗng khi play yourself để chuyển sang play online (value của thẻ <input> từ '' --> sang 'có giá trị' sẽ không bị báo lỗi)
            />
            <Avatar
              alt={player1.username}
              src={player1.avatar || "/static/images/avatar/1.jpg"}
              sx={{ width: 80, height: 80, margin: '10px auto' }}
            />
            <h3>X</h3>
          </div>
          <div className="col-4 text-center">
            <TextField
              error={player2.username === user.username}
              disabled={player2.username !== user.username}
              label="Player2"
              value={player2.username || ''}
            />
            <Avatar
              alt={player2.username}
              src={player2.avatar || "/static/images/avatar/1.jpg"}
              sx={{ width: 80, height: 80, margin: '10px auto' }}
            />
            <h3>O</h3>
          </div>
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