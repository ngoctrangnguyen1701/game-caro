import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';

import { socket } from 'src/App';
import { fightingSelector } from 'src/selectors/fightingSelector';
import { fightingAction } from 'src/reducers/fighting/fightingSlice';

const GameCaroFightingSettingStatus = props => {
  const {isPlayer1} = props

  const dispatch = useDispatch()
  const {status, height, width, fightingTime} = useSelector(fightingSelector)

  const handleComplete = () => {
    dispatch(fightingAction.settingComplete())
    socket.emit('fightingSettingComplete', {width, height, fightingTime})
  }

  const handleDisagree = () => {
    dispatch(fightingAction.resetSetting())
    socket.emit('disagreeFightingSetting')
  }

  return (
    <>
      {status === 'setting' && isPlayer1 && (
        <Button
          color='success' variant='contained'
          className="d-block mx-auto my-2"
          onClick={handleComplete}
        >
          Complete
        </Button>
      )}

      {status === 'setting' && !isPlayer1 && (
        <h6 className='text-danger text-center'>Player 1 is setting...</h6>
      )}

      {status === 'settingComplete' && isPlayer1 && (
        <h6 className='text-danger text-center'>Waiting confirm...</h6>
      )}

      {status === 'settingComplete' && !isPlayer1 && (
        <div className="d-flex justify-content-center">
          <Button
            color='success' variant='contained'
            className='d-block'
            onClick={()=>socket.emit('agreeFightingSetting')}
          >
            Agree setting
          </Button>
          <Button
            color='success' variant='outlined'
            className="d-block ms-1"
            onClick={handleDisagree}
          >
            Disagree setting
          </Button>
        </div>
      )}
    </>
  )
}

export default React.memo(GameCaroFightingSettingStatus)