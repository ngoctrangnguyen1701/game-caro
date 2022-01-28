import React, {useContext, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';


import whoIsWinner from './functions/whoIsWinner';
import { AuthContext } from 'src/contexts/AuthContextProvider';
import {socket} from 'src/App'
import { fightingPlayer1Selector, fightingPlayer2Selector, fightingSelector } from 'src/selectors/fightingSelector';
import { fightingAction } from 'src/reducers/fighting/fightingSlice';
import useCountTime from './hooks/countTimeHook';

import GameCaroFightingSettingStatus from './GameCaroFightingSettingStatus';
import Board from './Board';
import { toast } from 'react-toastify';


function GameCaroContent() {
  const {user} = useContext(AuthContext)

  const dispatch = useDispatch()
  const player1 = useSelector(fightingPlayer1Selector)
  const player2 = useSelector(fightingPlayer2Selector)
  const {status, height, width, fightingTime} = useSelector(fightingSelector)

  const [isPlayer1, setIsPlayer1] = useState(false)

  const [name1, setName1] = useState('')
  const [name1Complete, setName1Complete] = useState(false)
  const [name2, setName2] = useState('')
  const [name2Complete, setName2Complete] = useState(false)

  const [startCountTime, setStartCountTime] = useState(false)
  const [stopCountTime, setStopCountTime] = useState(false)
  const time = useCountTime({isStart: startCountTime, isStop: stopCountTime})


  const [winner, setWinner] = useState(null)

  const [squares2, setSquares2] = useState([])
  const [xIsNext, setXIsNext] = useState(true);
  const [isFinish, setIsFinish] = useState(false)


  useEffect(()=>{
    if(player1 && player2 && user){
      setName1(player1)
      setName1Complete(true)
      setName2(player2)
      setName2Complete(true)

      if(user.username === player1){
        setIsPlayer1(true)
      }
    } 
  }, [player1, player2, user])

  useEffect(()=>{
    if(isPlayer1){
      socket.on('receiveDisagreeFightingSetting', () => {
        console.log('receiveDisagreeFightingSetting')
        dispatch(fightingAction.resetSetting())
        toast.error(`${player2} has already disagree fighting setting`)
      })
    }
    else{
      //only player2 listen event 'receiveFightingSetting'
      socket.on('receiveFightingSetting', data => {
        console.log('receiveFightingSetting: ', data)
        dispatch(fightingAction.settingComplete(data))
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
    //if don't off listen event when this component unmount
    //every this component render, one function listen on will be created
  }, [isPlayer1])

  useEffect(()=>{
    if(squares2 && squares2.length > 0){
      const winner = whoIsWinner(squares2, width, height)
      // console.log('winner: ', winner)
      if(winner){
        setWinner(winner)
        setIsFinish(true)
        setStopCountTime(true)
      }
    }
  }, [squares2])

  //fighting time is over, no winner -> draw
  useEffect(()=>{
    if(time){
      //console.log(time);
      const minutes = time.slice(0, 2)
      //console.log('minutes: ', minutes)
      if(parseInt(minutes) === fightingTime){
        setIsFinish(true)
        setStopCountTime(true)
      }
    }
  }, [time])

  useEffect(()=>{
    let board = []
    for(let y = 0; y < height; y++){
      let row = []
      for(let x = 0; x < width; x++){
        row.push({x, y, value: null})
      }
      board = [...board, ...row]
    }
    setSquares2([...board])
  }, [height, width])

  useEffect(()=>{
    if(status === 'start'){
      console.log('start count time');
      setStartCountTime(true)
    }
  }, [status])


  //-------------------------------------------
  const handleChangeSize = obj => {
    const {height, width} = obj
    if(height && height <= 40 && height >= 15){
      // setHeight(height)
      dispatch(fightingAction.setting({height}))
    }
    if(width && width <= 40 && width >= 15){
      // setWidth(width)
      dispatch(fightingAction.setting({width}))
    }
  }

  const handleClick = index => {
    if (winner || squares2[index]?.value || isFinish) {
      //nếu có winner or click lại ô cũ or ván cờ đã kết thúc thì ko click được nữa
      return;
    }

    if(squares2 && squares2.length > 0){
      squares2[index].value = xIsNext ? "X" : "O"
      setSquares2([...squares2]);
      setXIsNext(!xIsNext);
    }
  }
  
  const handleReplay = () =>{
    // setTimeObj({...timeObj}) //-> sét lại 1 biến obj địa chỉ khác để render lại cái chạy time
    setIsFinish(false) //-> để nó ko chạy clearInterval
    setWinner(null)
    setXIsNext(true)
    // setIsDraw(false)
    // setStartCountTime(true)
    setStopCountTime(false)

    const newArr = squares2.map(item => ({
      x: item.x,
      y: item.y,
      value: null
    }))
    setSquares2([...newArr])
  }
  

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-6">
            <div>
              <label>Player 1</label>
              <input
                type="text"
                value={name1}
                onChange={e=>setName1(e.target.value)}
                disabled={name1Complete}
              />
              {!name1Complete && (
                <button
                  onClick={()=>setName1Complete(true)}
                >Ok</button>
              )}
              <h3>X</h3>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <div>
              <label>Player 2</label>
              <input
                type="text"
                value={name2}
                onChange={e=>setName2(e.target.value)}
                disabled={name2Complete}
              />
              {!name2Complete && (
                <button
                  onClick={()=>setName2Complete(true)}
                >Ok</button>
              )}
              <h3>O</h3>
            </div>
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
            disabled={startCountTime || !isPlayer1 || (status === 'settingComplete' ? true : false)}
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
            disabled={startCountTime || !isPlayer1 || (status === 'settingComplete' ? true : false)}
          />
        </div>
        <FormControl sx={{ m: 1, minWidth: 140 }}>
          <InputLabel>Fighting time</InputLabel>
          <Select
            value={fightingTime}
            onChange={e=>dispatch(fightingAction.setting({fightingTime: e.target.value}))}
            disabled={startCountTime || !isPlayer1 || (status === 'settingComplete' ? true : false)}
            color='success'
          >
            <MenuItem value={5}>5 minutes</MenuItem>
            <MenuItem value={15}>15 minutes</MenuItem>
            <MenuItem value={15}>15 minutes</MenuItem>
          </Select>
        </FormControl>
      </div>
      
      {name1Complete && name2Complete && !startCountTime && (
        <GameCaroFightingSettingStatus isPlayer1={isPlayer1}/>
      )}
      {startCountTime && status === 'start' && (
        <div className='container-fluid'>
          {!isFinish && <h4 className='text-center'><i className='fas fa-clock'></i> {time}</h4>}
          <h5 className='text-danger text-center'>{winner && winner === 'X' && `Winner: ${name1}`}</h5>
          <h5 className='text-danger text-center'>{winner && winner === 'O' && `Winner: ${name2}`}</h5>
          <h5 className='text-danger text-center'>{!isFinish && !winner && `Next player: ${xIsNext ? 'X' : 'O'}`}</h5>
          <h5 className='text-danger text-center'>{isFinish && !winner && `Draw`}</h5>
          <h5 className='text-danger text-center'>{isFinish && `Fighting time: ${time}`}</h5>
          <div>
            {isFinish && (
              <button
                className='btn btn-success d-block mx-auto'
                onClick={()=>handleReplay()}
              >Replay</button>
            )}
          </div>
          <Board
            squares={squares2}
            // onClick={i => handleClick(i)}
            onClick={handleClick}
            width={width}
            height={height}
          />
        </div>
      )}
    </>
  );
}

export default React.memo(GameCaroContent)