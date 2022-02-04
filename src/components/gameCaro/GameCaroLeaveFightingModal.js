import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import { fightingAction } from 'src/reducers/fighting/statusSlice';
import { socket } from 'src/App';
import { fightingStatusSelector } from 'src/selectors/fightingSelector';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const GameCaroLeaveFightingModal = (props) =>{
  const {isShowModal, setIsShowModal} = props

  const dispatch = useDispatch()
  const fightingStatus = useSelector(fightingStatusSelector)

  const handleLeaveFighting = () =>{
    dispatch(fightingAction.waiting())
    socket.emit('leaveFighting', {fightingStatus})
  }


  return (
    <Dialog
      open={isShowModal}
      TransitionComponent={Transition}
      keepMounted
      onClose={()=>setIsShowModal(false)}
    >
      <DialogTitle>
        {fightingStatus !== 'stop' ? 'If you leave, you will lose' : 'result figting(nếu đang giữa trận thì báo thắng do đối thủ rời đi)'}
      </DialogTitle>
      <DialogActions style={{justifyContent: 'center', paddingBottom: '24px'}}>
        <Button
          variant="contained"
          color='success'
          onClick={()=>setIsShowModal(false)}
        >Disagree
        </Button>
        <Button
          variant="outlined"
          color='success'
          onClick={handleLeaveFighting}
        >Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(GameCaroLeaveFightingModal)