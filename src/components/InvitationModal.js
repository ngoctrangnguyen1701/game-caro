import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Typography,
  Modal,
  Grid,
} from '@mui/material'

import { socket } from 'src/App';
import { invitationAction } from 'src/reducers/invitation/invitationSlice';
import { invitationListSelector } from 'src/selectors/invitationSelector';
import { fightingStatusSelector } from 'src/selectors/fightingSelector';

import GameCaroOpponent from './gameCaro/GameCaroOpponent'


const Notify = styled.div`
  width: 300px;
  height: 60px;
  line-height: 60px;
  padding-left: 15px;
  background-color: rgba(0, 0, 0, .8);
  color: white;
  cursor: pointer;

  position: absolute;
  z-index: 10000000;
  right: 24px;
  bottom: 24px;
`

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxHeight: 800,
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

const InvitationModal = () => {
  const dispatch = useDispatch()
  const invitationList = useSelector(invitationListSelector)
  const fightingStatus = useSelector(fightingStatusSelector)

  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowNotify, setIsShowNotify] = useState(false)
  const [hideInititalNotify, setHideInititalNotify] = useState(false) //--> avoid notify show when this component render

  useEffect(()=>{
    socket.on('choosePlayerFailed', data => {
      // console.log('choosePlayerFailed: ', data);
      toast.error(data.message)
    })

    socket.on('receiveInvitation', data => {
      // console.log('receiveInvitation: ', data);
      setIsShowNotify(true)
      setHideInititalNotify(true)
      dispatch(invitationAction.add(data))
    })

    socket.on('choosePlayerSuccess', data => {
      // console.log('choosePlayerSuccess: ', data);
      toast.success(data.message)
    })

    socket.on('agreeInvitationFailed', data => {
      toast.error(data.message)
    })

    socket.on('disagreeInvitationFailed', data => {
      toast.error(data.message)
    })
    //don't need to off event of socket, cause when component InvitationModal unmount, 
    //it's mean exsit to this webapp
  }, [])

  useEffect(()=>{
    if(invitationList.length === 0){
      setIsShowModal(false)
    }
  }, [invitationList])

  //auto hide notify when no click
  useEffect(()=>{
    let hideNotify
    if(isShowNotify === true){
      hideNotify = setTimeout(()=>{
        setIsShowNotify(false)
      }, 6000)
    }
    return () => clearTimeout(hideNotify)
  }, [isShowNotify])

  useEffect(()=>{
    if(fightingStatus === 'setting'){
      setIsShowModal(false)
    }
  }, [fightingStatus])


  const onShowModal = () =>{
    if(fightingStatus === 'waiting'){
      setIsShowModal(true)
      setIsShowNotify(false)
    }
  }

  let elementInvitation = []
  if(invitationList && invitationList.length > 0){
    elementInvitation = invitationList.map((item, index) => (
      <GameCaroOpponent
        key={index} {...item} isInvitation={true}
      />
    ))
  }

  return (
    <>
      <Modal
        open={isShowModal}
        onClose={()=>setIsShowModal(false)}
      >
        <Box sx={style}>
          <Typography variant="h6" sx={{mb: 1}}>
            Invitation from 
          </Typography>
          <Grid container spacing={2}>
            {elementInvitation}
          </Grid> 
        </Box>
      </Modal>

      {hideInititalNotify && (
        <Notify
          className={isShowNotify ? 'animate__animated animate__fadeInUp' : 'animate__animated animate__fadeOutDown'}
          onClick={onShowModal}
        >
          You have a invitation. Click to see!
        </Notify>
      )}
      
    </>
  )
};

export default React.memo(InvitationModal);