import React, {useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import { db } from 'src/firebase/firebaseConfig'
import { collection, addDoc } from "firebase/firestore"; 

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from '@mui/material'

const ChatRoomCreateRoomModal = props =>{
  const {showModal, setShowModal} = props

  const [roomName, setRoomName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(showModal === false) {
      setRoomName('')
      setErrorMessage('')
      setLoading(false)
    }
  }, [showModal])

  const handleCreateRoom = async () => {
    if(roomName){
      if(roomName.length > 15){
        setErrorMessage('Must be 15 characters or less')
        return
      }
      setLoading(true)
      //add data in firestore
      const docRef = await addDoc(collection(db, 'chatRooms'), {
        roomName,
      })
      console.log('Add to firestore successfully', docRef.id)
      toast.success('Create new chat room successfully')
      setShowModal(false)
    }
  }

  return (
    <Dialog
      open={showModal}
      onClose={()=>setShowModal(false)}
    >
      <div style={{width: '600px'}}>
        <DialogTitle className='pb-0'>Create new room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Input room name"
            type="text"
            fullWidth
            variant="standard"
            color='warning'
            value={roomName}
            onChange={e=>setRoomName(e.target.value)}
          />
          <p className='mb-0 text-danger'>{errorMessage}</p>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='success'
            onClick={handleCreateRoom}
          >
            {loading && 
              <CircularProgress
                className='d-inline-block me-1'
                size={15}
                color='inherit'
              />
            }
            OK
          </Button>
          <Button
            variant='outlined'
            color='success'
            onClick={()=>setShowModal(false)}
          >Cancel</Button>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default React.memo(ChatRoomCreateRoomModal)