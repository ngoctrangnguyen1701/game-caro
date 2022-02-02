import React, {useContext} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';

import { AuthContext } from 'src/contexts/AuthContextProvider';
import { socket } from 'src/App';
import { fightingSettingSelector, fightingStatusSelector } from 'src/selectors/fightingSelector';
import { fightingAction } from 'src/reducers/fighting/statusSlice';

const GameCaroFightingSettingStatus = props => {
  const {user} = useContext(AuthContext)
  const isPlayer1 = user.isPlayer1

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const {height, width, fightingTime} = useSelector(fightingSettingSelector)

  const handleComplete = () => {
    dispatch(fightingAction.settingComplete({width, height}))
    socket.emit('fightingSettingComplete', {width, height, fightingTime})
  }

  const handleDisagree = () => {
    console.log('handleDisagree');
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