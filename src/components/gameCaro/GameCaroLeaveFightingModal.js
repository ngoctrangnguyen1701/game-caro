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
import { AuthContext } from 'src/contexts/AuthContextProvider';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const GameCaroLeaveFightingModal = (props) =>{
  const {isShowModal, setIsShowModal} = props
  const {user} = React.useContext(AuthContext)

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const message = useSelector(fightingMessageSelector)
  const result = useSelector(fightingResultSelector)

  const handleLeaveFighting = () =>{
    let obj = {}
    if(status === 'stop'){
      obj = {
        fightingResult: result
      }
    }
    else{
      //when player leave, but fighting still be stop yet, that player will be lose
      obj = {
        fightingResult: 'lose',
        message: `${user.username} has already leave fighting`
      }
    }
    socket.emit('leaveFighting', obj)
    dispatch(fightingAction.waiting())
  }


  return (
    <Dialog
      open={isShowModal}
      TransitionComponent={Transition}
      keepMounted
      onClose={()=>setIsShowModal(false)}
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
          onClick={()=>setIsShowModal(false)}
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