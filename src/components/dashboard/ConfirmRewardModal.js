import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { confirmRewardAction } from 'src/reducers/confirmReward/confirmRewardSlice';
import styled from 'styled-components';

const FlexBox = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0px;
  label {
    display: block;
    // width: 120px;
    margin-right: 5px;
  }
  h6 {
    margin-bottom: 0;
    color: orange;
  }
`

const ConfirmRewardModal = () => {
  const dispatch = useDispatch()
  const { isShowModal, detail } = useSelector(state => state.confirmReward)


  return (
    <Dialog
      open={isShowModal}
      onClose={() => dispatch(confirmRewardAction.closeModal())}
    >
      <DialogTitle className='text-primary' style={{ marginBottom: '-20px' }}>
        Confirm Reward
      </DialogTitle>
      <DialogContent>
        {detail &&
          <>
            <FlexBox>
              <label>Id:</label>
              <h6>{detail._id}</h6>
            </FlexBox>
            <FlexBox>
              <label>Address:</label>
              <h6>{detail.address}</h6>
            </FlexBox>
            <FlexBox>
              <label>Payback Token:</label>
              <h6>{detail.paybackToken}</h6>
            </FlexBox>
            <FlexBox>
              <label>Reward:</label>
              <div className='d-flex align-items-center'>
                <h6 className='me-1'>{detail.reward.sapphire}</h6> Sapphire
                <h6 className='ms-4 me-1'>{detail.reward.ruby}</h6> Ruby
                <h6 className='ms-4 me-1'>{detail.reward.quartz}</h6> Quartz
              </div>
            </FlexBox>
            <FlexBox>
              <label>Total:</label>
              <h6>{detail.reward.sapphire + detail.reward.ruby + detail.reward.quartz}</h6>
            </FlexBox>
          </>
        }
      </DialogContent>
      <DialogActions>
        <Button variant='contained' color='success'>
          Agree
        </Button>
        <Button variant='outlined' color='error' onClick={() => dispatch(confirmRewardAction.closeModal())}>Disagree</Button>
      </DialogActions>
    </Dialog>
  );
}


export default React.memo(ConfirmRewardModal);