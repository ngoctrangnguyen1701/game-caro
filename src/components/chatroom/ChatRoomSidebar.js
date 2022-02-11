import React, { useContext, useState } from 'react';

import { Divider, Button } from '@mui/material';

import { AuthContext } from 'src/contexts/AuthContextProvider';
import ButtonCreateRoom from './ButtonCreateRoom';
import ChatRoomCreateRoomModal from './ChatRoomCreateRoomModal';

const ChatRoomSidebar = () => {
  const {user} = useContext(AuthContext)
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className='pb-4'>
        <h6 className='text-center'>Create Room</h6>
        <div className='d-flex justify-content-center'>
          <div onClick={()=>{setShowModal(true)}}>
            <ButtonCreateRoom/>
          </div>
        </div>
        <Divider className='my-4'/>
        <h6 className='text-center'>List Room</h6>
        <span style={{fontStyle: 'italic', textAlign: 'center', display: 'block'}}>(Empty...)</span>
      </div>

      {/* MODAL */}
      <ChatRoomCreateRoomModal
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  )
};

export default React.memo(ChatRoomSidebar)