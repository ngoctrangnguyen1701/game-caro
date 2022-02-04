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
} from '@mui/material'

import { AuthContext } from 'src/contexts/AuthContextProvider';
import { socket } from 'src/App';
import { fightingSettingSelector, fightingStatusSelector } from 'src/selectors/fightingSelector';
import { fightingAction } from 'src/reducers/fighting/statusSlice';

import GameCaroLeaveFightingModal from './GameCaroLeaveFightingModal'
import { date } from 'yup';

const GameCaroFightingSetting = props => {
  const {user, setUser} = useContext(AuthContext)
  const isPlayer1 = user.isPlayer1

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const {height, width, fightingTime, player1, player2} = useSelector(fightingSettingSelector)

  const [isShowLeaveFightingModal, setIsShowLeaveFightingModal] = useState(false)

  useEffect(()=>{
    if(user.username === player1?.username){
      setUser({...user, isPlayer1: true})
    }
  }, [player1, player2])

  useEffect(()=>{
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
      })
    }

    socket.on('startFighting', () => {
      console.log('startFighting')
      dispatch(fightingAction.start())
    })

    socket.on('opponentLeaveFighting', data => {
      // console.log('opponentLeaveFighting: ', data);
      if(status !== 'stop'){
        //when player leave, but fighting still be stop yet, that player will be lose
        dispatch(fightingAction.stop({result: 'win', message: data.message, winner: user.username}))
        setIsShowLeaveFightingModal(true)
      }
    })

    return () => {
      socket.off('receiveFightingSetting')
      socket.off('receiveDisagreeFightingSetting')
      socket.off('startFighting')
      socket.off('opponentLeaveFighting')
    }
    //if don't off listen event when this component unmount
    //every this component render, one function listen on will be created
  }, [isPlayer1])


  //-------------------------------------------
  const handleChangeSize = obj => {
    const {height, width} = obj
    if(height && height <= 30 && height >= 15){
      // setHeight(height)
      dispatch(fightingAction.setting({height}))
    }
    if(width && width <= 30 && width >= 15){
      // setWidth(width)
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
              value={player1.username}
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
              value={player2.username}
            />
            <Avatar
              alt={player2.username}
              src={player2.avatar || "/static/images/avatar/1.jpg"}
              sx={{ width: 80, height: 80, margin: '10px auto' }}
            />
            <h3>O</h3>
          </div>
        </div>
        <div className='text-center'>
          <label>Width of board (min: 15, max: 40)</label>
          <input
            type="number"
            min="15"
            max="40"
            value={width}
            onChange={e=> handleChangeSize({width: parseInt(e.target.value)})}
            disabled={!isPlayer1 || (status !== 'setting' ? true : false)}
          />
        </div>
        <div className='text-center mt-2'>
          <label>Height of board (min: 15, max: 40)</label>
          <input
            type="number"
            min="15"
            max="40"
            value={height}
            onChange={e=> handleChangeSize({height: parseInt(e.target.value)})}
            disabled={!isPlayer1 || (status !== 'setting' ? true : false)}
          />
        </div>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <FormControl sx={{ m: 1, minWidth: 140 }}>
              <InputLabel>Fighting time</InputLabel>
              <Select
                value={fightingTime}
                onChange={e=>dispatch(fightingAction.setting({fightingTime: e.target.value}))}
                disabled={!isPlayer1 || (status !== 'setting' ? true : false)}
                color='success'
              >
                <MenuItem value={5}>5 minutes</MenuItem>
                <MenuItem value={10}>10 minutes</MenuItem>
                <MenuItem value={15}>15 minutes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} className='d-flex justify-content-end align-items-center'>
            <Button
              variant="contained"
              color="error"
              onClick={()=>(setIsShowLeaveFightingModal(true))}
            >
              Leave fighting
            </Button>
          </Grid>
        </Grid>
      </div>

      {/* MODAL */}
      <GameCaroLeaveFightingModal
        isShowModal={isShowLeaveFightingModal}
        setIsShowModal={setIsShowLeaveFightingModal}
      />
    </>
  )
}

export default React.memo(GameCaroFightingSetting)