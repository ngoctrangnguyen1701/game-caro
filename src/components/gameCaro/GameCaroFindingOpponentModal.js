import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import CachedIcon from '@mui/icons-material/Cached';
import {
  Button,
  DialogContent,
  DialogTitle,
  Typography,
  Dialog,
} from '@mui/material';

import { onlineUserMessageSelector, onlineUserListSelector } from 'src/selectors/onlineUserSelector';

import LoadingFindOpponent from './LoadingFindOpponent';

const ModifyDialog = styled(Dialog)`
  //.css-1t1j96h-MuiPaper-root-MuiDialog-paper{
  //class có chữ 'css' này khi deploy lên product sẽ bị thay đổi
  //nên đừng lấy nó để set lại style cho material ui
  .MuiDialog-paperWidthSm{
    transform: ${props => props.closetext === 'true' ? 'scaleY(0)' : 'scaleY(1)'};
    transition: .3s;

    -webkit-transform: ${props => props.closetext === 'true' ? 'scaleY(0)' : 'scaleY(1)'}; /* Safari & Chrome */
    -moz-transform: ${props => props.closetext === 'true' ? 'scaleY(0)' : 'scaleY(1)'}; /* Firefox */
    -ms-transform: ${props => props.closetext === 'true' ? 'scaleY(0)' : 'scaleY(1)'}; /* Internet Explorer */
    -o-transform: ${props => props.closetext === 'true' ? 'scaleY(0)' : 'scaleY(1)'}; /* Opera */
  }
`


const GameCaroFindingOpponentModal = props => {
  const {isShowModal, setIsShowModal, setPrepareShowOpponentListModal} = props
  const list = useSelector(onlineUserListSelector)
  const onlineUserMessage = useSelector(onlineUserMessageSelector)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [closeTextModal, setCloseTextModal] = useState(false)

  useEffect(()=>{
    if(isShowModal) {
      setLoading(true)
      setCloseTextModal(false)
      setPrepareShowOpponentListModal(false)
    }
  }, [isShowModal])

  useEffect(()=>{
    let runLoadingTimeout
    if(loading){
      runLoadingTimeout = setTimeout(()=>{
        setLoading(false)
        if(list && list.length > 0){
          //sau 0.5s chạy loading, xét nếu có mảng rồi thì đóng cái text ở giữa đi
          setCloseTextModal(true)
        }
        else{
          setMessage(onlineUserMessage)
        }
      }, 500)
    }
    return () => clearTimeout(runLoadingTimeout)
  }, [loading, list])

  useEffect(()=>{
    let closeModalTimeout
    if(closeTextModal){
      closeModalTimeout = setTimeout(()=>{
        //sau khi có hiệu ứng transition đóng cái text ở giữa, thì đóng luôn cái modal đi
        setIsShowModal(false)
        setPrepareShowOpponentListModal(true)
      }, 300)
    }
    return () => clearTimeout(closeModalTimeout)
  }, [closeTextModal])


  return (
    <ModifyDialog
      open={isShowModal}
      onClose={()=>setIsShowModal(false)}
      closetext={closeTextModal ? 'true' : 'false'}
    >
      <div className='m-auto' style={{width: '275px', height: '150px', backgroundColor: 'white'}}>
        <DialogTitle className="text-center">
          {loading && 'Finding opponent ...'}
        </DialogTitle>
        <DialogContent>
          {loading ? <LoadingFindOpponent/> : (
            !closeTextModal && (
              <div className='text-center'>
                <Typography variant='h6' className='text-danger'>{message}</Typography>
                <Button 
                  variant='outlined'
                  onClick={()=>setLoading(true)}
                >
                  <CachedIcon/>
                </Button>
              </div>
            )
          )}
        </DialogContent>
      </div>
    </ModifyDialog>
  );
};

export default React.memo(GameCaroFindingOpponentModal);