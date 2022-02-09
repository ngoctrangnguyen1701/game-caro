import React, { useContext } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import { socket } from 'src/App';
import { GameCaroModalContext } from '../contexts/GameCaroModalContext';

const GameCaroReplayFightingModal = props => {
  const show = useContext(GameCaroModalContext).state.showReplayFightingModal
  const message = useContext(GameCaroModalContext).state.messageReplayFightingModal
  const dispatchModalContext = useContext(GameCaroModalContext).dispatch

  const onDisagree = () => {
    socket.emit('disagreeReplayFighting');
    dispatchModalContext({type: 'SHOW_REPLAY_FIGHTING_MODAL', payload: false})
  }

  return (
    <Dialog
      open={show}
      onClose={()=>dispatchModalContext({type: 'SHOW_REPLAY_FIGHTING_MODAL', payload: false})}
    >
      <DialogTitle>
        <div className='text-center text-danger'>
          {message}
        </div>
      </DialogTitle>
      <DialogActions style={{justifyContent: 'center', paddingBottom: '24px', paddingTop: '0px'}}>
        <Button
          variant="contained"
          color='success'
          onClick={()=>socket.emit('agreeReplayFighting')}
        >Agree
        </Button>
        <Button
          variant="outlined"
          color='success'
          onClick={onDisagree}
        >Disagree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(GameCaroReplayFightingModal)