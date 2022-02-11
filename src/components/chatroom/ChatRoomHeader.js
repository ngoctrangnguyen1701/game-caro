import React from 'react';

const ChatRoomHeader = () => {
  return (
    <div style={{padding: '15px'}}>
     <h3>Room name</h3>
     <span>description</span>
    </div>
  );
};

export default React.memo(ChatRoomHeader)