import React from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import { socket } from 'src/App';

const GameCaroReplayFightingModal = props => {
  const {isShowModal, setIsShowModal, message} = props

  return (
    <Dialog
      open={isShowModal}
      onClose={()=>setIsShowModal(false)}
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
          onClick={()=>{socket.emit('disagreeReplayFighting'); setIsShowModal(false)}}
        >Disagree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(GameCaroReplayFightingModal)