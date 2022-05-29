import * as React from 'react';
import {  useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import { socket } from 'src/App';
import { fightingStatusSelector, fightingResultSelector, fightingMessageSelector, fightingIsFightingStop } from 'src/selectors/fightingSelector';
import { GameCaroModalContext } from '../contexts/GameCaroModalContext';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const GameCaroLeaveFightingModal = () =>{
  const navigate = useNavigate()

  const show = React.useContext(GameCaroModalContext).state.showLeaveFightingModal
  const dispatchModalContext = React.useContext(GameCaroModalContext).dispatch

  const status = useSelector(fightingStatusSelector)
  const message = useSelector(fightingMessageSelector)
  const result = useSelector(fightingResultSelector)
  const isFightingStop = useSelector(fightingIsFightingStop)


  const handleLeaveFighting = () => {
    if(isFightingStop === false){
      //when fighting still no stop yet, leave will be losed
      socket.emit('stopFighting', {fightingResult: 'lose'})
    }
    socket.emit('leaveFighting', {isFightingStop})
    dispatchModalContext({type: 'SHOW_LEAVE_FIGHTING_MODAL', payload: false})
    console.log(`navigate('/game-caro')`)
    navigate('/game-caro')
  }


  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      keepMounted
      onClose={()=>dispatchModalContext({type: 'SHOW_LEAVE_FIGHTING_MODAL', payload: false})}
    >
      <DialogTitle>
        {(status === 'stop' || status === 'suggestReplay' || status === 'disagreeReplay') ? (
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