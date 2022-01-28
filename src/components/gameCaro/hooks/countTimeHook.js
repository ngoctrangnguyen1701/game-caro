import React, {useEffect, useState} from 'react'

const useCountTime = ({isStart, isStop}) => {
  const [time, setTime] = useState('00:00.0')
  // const [timeObj, setTimeObj] = useState({
  //   miliseconds: 0,
  //   seconds: 0,
  //   minutes: 0,
  // })
  
  useEffect(()=>{
    let runTime
    if(isStart){
      // let {miliseconds, seconds, minutes,} = timeObj
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

    if(isStop){
      clearInterval(runTime) 
    }
    
    return () => clearInterval(runTime)
  }, [isStop, /* timeObj, */ isStart])

  return time
}

export default useCountTime