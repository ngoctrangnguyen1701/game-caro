import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import { fightingAction } from 'src/reducers/fighting/statusSlice';
import { socket } from 'src/App';
import { fightingStatusSelector, fightingResultSelector, fightingMessageSelector } from 'src/selectors/fightingSelector';
import { GameCaroModalContext } from '../contexts/GameCaroModalContext';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const GameCaroLeaveFightingModal = () =>{
  const show = React.useContext(GameCaroModalContext).state.showLeaveFightingModal
  const dispatchModalContext = React.useContext(GameCaroModalContext).dispatch

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const message = useSelector(fightingMessageSelector)
  const result = useSelector(fightingResultSelector)

  const handleLeaveFighting = () =>{
    if(status !== 'stop'){
      socket.emit('stopFighting', {fightingResult: 'lose'})
    }
    socket.emit('leaveFighting')
    dispatch(fightingAction.waiting())
    dispatchModalContext({type: 'SHOW_LEAVE_FIGHTING_MODAL', payload: false})
  }


  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      keepMounted
      onClose={()=>dispatchModalContext({type: 'SHOW_LEAVE_FIGHTING_MODAL', payload: false})}
    >
      <DialogTitle>
        {status === 'stop' ? (
          <div className='text-center text-danger'>
            YOU {result.toUpperCase()}
            <span className="text-secondary d-block" style={{fontSize: '14px'}}>{message}</span>
          </div>
        ) : 'If you leave, you will lose'}
      </DialogTitle>
      <DialogActions style={{justifyContent: 'center', paddingBottom: '24px', paddingTop: '0px'}}>
        <Button
          variant="contained"
          color='success'
          onClick={()=>dispatchModalContext({type: 'SHOW_LEAVE_FIGHTING_MODAL', payload: false})}
        >{status === 'stop' ? 'Review board': 'Stay'}
        </Button>
        <Button
          variant="outlined"
          color='success'
          onClick={handleLeaveFighting}
        >Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(GameCaroLeaveFightingModal)