import React, {useContext} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import Button from '@mui/material/Button';

import { AuthContext } from 'src/contexts/AuthContextProvider';
import { socket } from 'src/App';
import { fightingIsPlayOnlineSelector, fightingIsPlayYourselfSelector, fightingSettingSelector, fightingStatusSelector } from 'src/selectors/fightingSelector';
import { fightingAction } from 'src/reducers/fighting/statusSlice';
import { fightingAction as fightingPlayAction} from 'src/reducers/fighting/playSlice';
import createBoardFunc from './functions/createBoardFunc';

import LoadingThreeDots from './LoadingThreeDots';

const StatusText = styled.div`
  color: #dc3545;
  font-weight: bold;
  text-align: center;
`

const GameCaroFightingPrepareStatus = () => {
  const {user} = useContext(AuthContext)
  const isPlayer1 = user.isPlayer1

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const {height, width, fightingTime} = useSelector(fightingSettingSelector)
  const isPlayYourself = useSelector(fightingIsPlayYourselfSelector)
  const isPlayOnline = useSelector(fightingIsPlayOnlineSelector)

  const handleComplete = () => {
    socket.emit('fightingSettingComplete', {width, height, fightingTime})
    dispatch(fightingAction.settingComplete({width, height}))
    dispatch(fightingPlayAction.createBoard({board: createBoardFunc(width, height)}))
  }

  const handleDisagree = () => {
    console.log('handleDisagree');
    dispatch(fightingAction.resetSetting())
    socket.emit('disagreeFightingSetting')
  }

  const handleStartPlayYourself = () => {
    dispatch(fightingPlayAction.createBoard({board: createBoardFunc(width, height)}))
    dispatch(fightingAction.start())
  }

  return (
    <>
      {isPlayYourself && status === 'setting' && 
        <Button
          color='success' variant='contained'
          className="d-block mx-auto my-2"
          onClick={handleStartPlayYourself}
        >
          Start
        </Button>
      }
      
      {isPlayOnline &&
        <>
          {status === 'setting' && isPlayer1 && 
            <Button
              color='success' variant='contained'
              className="d-block mx-auto my-2"
              onClick={handleComplete}
            >
              Setting Complete
            </Button>
          }

          {status === 'setting' && !isPlayer1 && 
            <StatusText> 
              Player 1 is setting
              <LoadingThreeDots/>
            </StatusText>
          }

          {status === 'settingComplete' && isPlayer1 && 
            <StatusText>
              Waiting confirm
              <LoadingThreeDots/>
            </StatusText>
          }

          {status === 'settingComplete' && !isPlayer1 && 
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
          }
        </>
      }
    </>
  )
}

export default React.memo(GameCaroFightingPrepareStatus)