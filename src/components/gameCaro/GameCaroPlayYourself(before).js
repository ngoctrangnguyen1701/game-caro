import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import Button from '@mui/material/Button';

import Board from './Board(before)';
import whoIsWinner from './functions/whoIsWinner';
import {fightingIsPlayYourselfSelector} from 'src/selectors/fightingSelector'


function GameCaroPlayYourself(props) {
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)

  const [name1, setName1] = useState('')
  const [name1Complete, setName1Complete] = useState(false)
  const [name2, setName2] = useState('')
  const [name2Complete, setName2Complete] = useState(false)
  
  const [isStart, setIsStart] = useState(false)
  const [time, setTime] = useState('00:00.0')
  const [width, setWidth] = useState(30)
  const [height, setHeight] = useState(30)
  const [winner, setWinner] = useState(null)

  const [squares2, setSquares2] = useState([])
  const [xIsNext, setXIsNext] = useState(true);
  const [isFinish, setIsFinish] = useState(false)
  const [isDraw, setIsDraw] = useState(false)
  const [timeObj, setTimeObj] = useState({
    miliseconds: 0,
    seconds: 0,
    minutes: 0,
  })

  useEffect(()=>{
    // if(name1Complete && name2Complete){
    if(isStart){
      let {miliseconds, seconds, minutes,} = timeObj
      /* let miliseconds = 0
      let seconds = 0
      let minutes = 0 */
      let runTime

      runTime = setInterval(function(){
        miliseconds += 1
        if(miliseconds === 10){
          miliseconds = 0
          seconds += 1
        }
        if(seconds === 60){
          seconds = 0
          minutes += 1
        }
        var result = `${Math.floor(minutes / 10)}${minutes%10}:${Math.floor(seconds / 10)}${seconds%10}.${miliseconds}`
        //console.log(result);
        setTime (result)
      }, 100)

      if(isFinish){
        clearInterval(runTime)
      }

      return () => clearInterval(runTime)
    }
  }, [isFinish, timeObj, isStart])


  useEffect(()=>{
    if(squares2 && squares2.length > 0){
      const winner = whoIsWinner(squares2, width, height)
      // console.log('winner: ', winner)
      if(winner){
        setWinner(winner)
        setIsFinish(true)
      }
    }
  }, [squares2])


  //After 10 minutes, no winner -> draw
  useEffect(()=>{
    if(time){
      //console.log(time);
      const minutes = time.slice(0, 2)
      //console.log('minutes: ', minutes)
      if(parseInt(minutes) === 10){
        setIsDraw(true)
        setIsFinish(true)
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


  const handleChangeSize = obj => {
    const {height, width} = obj
    if(height && height <= 50 && height >= 10){
      setHeight(height)
    }
    if(width && width <= 50 && width >= 10){
      setWidth(width)
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
    setTimeObj({...timeObj}) //-> sét lại 1 biến obj địa chỉ khác để render lại cái chạy time
    setIsFinish(false) //-> để nó ko chạy clearInterval
    setWinner(null)
    setXIsNext(true)
    setIsDraw(false)
    const newArr = squares2.map(item => ({
      x: item.x,
      y: item.y,
      value: null
    }))
    setSquares2([...newArr])
  }
  

  return (
    <>
      {!isPlayYourself && <Navigate to='/game-caro'/>}
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
          <label>Chiều dài bàn cờ (tối thiểu 10)</label>
          <input
            type="number"
            min="10"
            max="50"
            value={width}
            onChange={e=> handleChangeSize({width: parseInt(e.target.value)})}
            // disabled={name1Complete && name2Complete && true}
            disabled={isStart}
          />
        </div>
        <div className='text-center'>
          <label>Chiều cao bàn cờ (tối thiểu 10)</label>
          <input
            type="number"
            min="10"
            max="50"
            value={height}
            onChange={e=> handleChangeSize({height: parseInt(e.target.value)})}
            // disabled={name1Complete && name2Complete && true}
            disabled={isStart}
          />
        </div>
        {!isFinish && <h4 className='text-center'>Thời gian: {time}</h4>}
      </div>
      
      {/* {true && ( */}
      {name1Complete && name2Complete && !isStart && (
        <Button
          color='success' variant='contained'
          onClick={()=>setIsStart(true)}
          className="d-block mx-auto my-2"
        >
        Start</Button>
      )}
      
      {isStart && (
        <div className='container-fluid'>
          <h4 className='text-danger text-center'>{winner && winner === 'X' && `Winner: ${name1}`}</h4>
          <h4 className='text-danger text-center'>{winner && winner === 'O' && `Winner: ${name2}`}</h4>
          <h4 className='text-danger text-center'>{!winner && `Next player: ${xIsNext ? 'X' : 'O'}`}</h4>
          <h4 className='text-danger text-center'>{!winner && isDraw && `Draw`}</h4>
          <h4 className='text-danger text-center'>{isFinish && `Thời gian chơi: ${time}`}</h4>
          <div>
            {isFinish && (
              <button
                className='btn btn-success'
                onClick={()=>handleReplay()}
              >Chơi lại</button>
            )}
          </div>
          <Board
            squares={squares2}
            onClick={i => handleClick(i)}
            width={width}
            height={height}
          />
        </div>
      )}
    </>
  );
}

export default React.memo(GameCaroPlayYourself)