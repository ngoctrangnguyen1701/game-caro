import { Button } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

const InputText = styled.input`
  background: #eee;
  padding: 10px;
  display: block;
  border-radius: 4px 0 0 4px;
  border: none;
  outline: none;

  color: grey;
  max-height: 100px;
  width: calc(100% - 100px);
`

const ChatRoomSend = () => {
  return (
    <div style={{flexGrow: '1'}} className="d-flex p-3">
      <div className='d-flex my-auto w-100'>
        <InputText type='text' placeholder='Type a message...'/>
        <Button variant='contained' style={{backgroundColor: 'orange', width: '100px', borderRadius: '0 4px 4px 0'}}>Send</Button>
      </div>
    </div>
  );
};

export default React.memo(ChatRoomSend)