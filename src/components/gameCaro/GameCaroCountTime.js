import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fightingAction } from 'src/reducers/fighting/statusSlice';
import { fightingStatusSelector, fightingTimeSelector } from 'src/selectors/fightingSelector'

const GameCaroCountTime = () => {
  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const fightingTime = useSelector(fightingTimeSelector)

  const [time, setTime] = useState('00:00.0')

  useEffect(()=>{
    let runTime
    if(status === 'start'){
      let miliseconds = 0
      let seconds = 0
      let minutes = 0

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
    }

    if(status === 'stop'){
      clearInterval(runTime) 
    }

    return () => clearInterval(runTime)
  }, [status])

  useEffect(()=>{
    if(time){
      const minutes = time.slice(0,2)
      // if(parseInt(minutes) === fightingTime){
      if(parseInt(minutes) === 1){
        //after time is over
        dispatch(fightingAction.stop({result: 'draw', message: 'Fighting time is over'}))
      }
    }
  }, [time])

  return (
    <>
      {(status === 'start' || status === 'stop') && 
        <h4 className='text-center'>
          <i className="fas fa-stopwatch"></i> {time}
        </h4>}
    </>
  );
};

export default React.memo(GameCaroCountTime)