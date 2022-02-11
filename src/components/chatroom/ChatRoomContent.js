import React from 'react';
import styled from 'styled-components';

import { Avatar } from '@mui/material';

const ownText = `
  background-color: green;
  color: white;
  // margin-right: 10px;
  border-top-right-radius: 0;
`

const otherText = `
  background-color: white;
  color: black;
  // margin-left: 10px;
  border-top-left-radius: 0;
`

const Text = styled.div`
  max-width: 600px;
  padding: 10px;
  border-radius: 10px;

  ${props => props.own ? `${ownText}` : `${otherText}`};
`

const Box = styled.div`
  padding-bottom: 15px;
  display: flex;
  align-items: end;
  justify-content: ${props => props.own ? 'right' : 'left'};
  flex-direction: ${props => props.own ? 'row-reverse' : 'row'};
`

const Content = styled.div`
  width: 50%;
  ${props => props.own ? 'margin-right: 10px' : 'margin-left: 10px'};
`

const Time = styled.div`
  font-size: 12px;
  color: #3d3d3d;
  font-style: italic;
  text-align: ${props => props.own ? 'right' : 'left'}
`

const ChatRoomContent = () => {
  return (
    <div style={{padding: '15px 15px 0 15px',  backgroundColor: '#eee', height: '550px', overflowY: 'auto'}}>
      <Box>
        <Avatar alt='' src='/static/images/avatar/1.jpg'/>
        <Content>
          <Time>15 minutes</Time>
          <Text>text ... </Text>
        </Content>
      </Box>
      <Box own={true}>
        <Avatar alt='' src='/static/images/avatar/1.jpg'/>
        <Content own={true}>
          <Time own={true}>15 minutes</Time>
          <Text own={true}>text ... </Text>
        </Content>
      </Box>
    </div>
  );
};

export default React.memo(ChatRoomContent)