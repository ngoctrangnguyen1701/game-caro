import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

import { AuthContext } from 'src/contexts/AuthContextProvider'
import { Grid } from '@mui/material'

import ChatRoomSidebar from 'src/components/chatroom/ChatRoomSidebar'
import ChatRoomHeader from 'src/components/chatroom/ChatRoomHeader'
import ChatRoomContent from 'src/components/chatroom/ChatRoomContent'
import ChatRoomSend from 'src/components/chatroom/ChatRoomSend'

const ChatRoomPage = () => {
  const {username} = useContext(AuthContext).user

  return (
    <>
      {!username && <Navigate to='/logIn'/>}
      <Grid container spacing={2} style={{marginTop: '0', height: '100vh'}}>
        <Grid item xs={3} className="bg-warning">
          <ChatRoomSidebar/>
        </Grid>
        <div style={{flexGrow: '1'}} className="d-flex flex-column">
          <ChatRoomHeader/>
          <ChatRoomContent/>
          <ChatRoomSend/>
        </div>
      </Grid>
    </>
  );
};

export default React.memo(ChatRoomPage)