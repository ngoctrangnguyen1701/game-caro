import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { fightingStatusSelector } from 'src/selectors/fightingSelector'

const GameCaroCountTime = () => {
  const status = useSelector(fightingStatusSelector)

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

  return (
    <>
      {status === 'start' && <h4 className='text-center'><i className="fas fa-stopwatch"></i> {time}</h4>}
    </>
  );
};

export default React.memo(GameCaroCountTime)