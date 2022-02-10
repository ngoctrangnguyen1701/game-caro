const effect = [
  'animate__jackInTheBox',
  'animate__rubberBand',
  'animate__bounce',
  'animate__headShake',
  'animate__heartBeat',
  'animate__flipInX',
  'animate__flipInY',
  'animate__lightSpeedInRight',
  'animate__zoomIn', 'animate__slideInDown'
]
const chessEffectFunc = (value, isWinCell) => {
  const textColor = value === 'X' ? 'text-danger' : 'text-primary'
  if(value){
    if(isWinCell){
      return `${textColor} animate__animated animate__fadeIn animate__infinite animate__slow`
    }
    const index = Math.floor(Math.random()*10)
    return `${textColor} animate__animated ${effect[index]} animate__faster`
  }
  return textColor
}

export default chessEffectFunc