import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { socket } from 'src/App';
import { AuthContext } from 'src/contexts/AuthContextProvider';
import { onlineUserAction } from 'src/reducers/onlineUser/onlineUserListSlice';
import { invitationAction } from 'src/reducers/invitation/invitationSlice';
import {Card, Content} from './styles/GameCaroOpponentStyle'

const elementRemoveLoading = (
  <div className='w-100 h-100 position-absolute' style={{zIndex: '1'}}>
    <div className='loader'></div>
  </div>
)

const GameCaroOpponent = props => {
  const {
    username,
    avatar,
    gender,
    winRate,
    socketId,

    addLoading : addLoadingFromRedux,
    removeLoading,

    isInvitation,
    notChosen,
    agreeLoading,
  } = props

  const dispatch = useDispatch()
  const {user} = useContext(AuthContext)
  // console.log(user);

  const [addLoading, setAddLoading] = useState(addLoadingFromRedux)

  useEffect(()=>{
    if(addLoading){
      const addLoadingTimeout = setTimeout(()=>{
        setAddLoading(false)
      }, 500)
      return () => clearTimeout(addLoadingTimeout)
    }
  }, [addLoading])

  useEffect(()=>{
    if(removeLoading){
      const removeLoadingTimeout = setTimeout(()=>{
        //sau khoảng thời gian 10s nếu như không có kết nối socket online trở 
        console.log({username, removeLoading});
        if(removeLoading){
          dispatch(onlineUserAction.remove({username}))
        }
      }, 10000)
      return () => clearTimeout(removeLoadingTimeout)
    }
  }, [removeLoading])

  const onChoosePlayer = () => {
    const from = {
      username: user.username,
      avatar: user.avatar,
      gender: user.gender,
      winRate: user.winRate,
      socketId: socket.id,
    }
    socket.emit('choosePlayer', {from, to: {username, avatar, gender, winRate, socketId}} )
  }

  const onAgreeInvitation = () => {
    const from = {
      username: user.username,
      avatar: user.avatar,
      gender: user.gender,
      winRate: user.winRate,
      socketId: socket.id,
    }
    socket.emit('agreeInvitation', {from, agree: {username, avatar, gender, winRate, socketId}})
    dispatch(invitationAction.argee({username}))
  }

  const onDisagreeInvitation = () => {
    const from = {
      username: user.username,
      avatar: user.avatar,
      gender: user.gender,
      winRate: user.winRate,
      socketId: socket.id,
    }
    socket.emit('disagreeInvitation', {from, disagree: {username, avatar, gender, winRate, socketId}})
  }


  return (
    <Grid item xs={4}>
      {addLoading ? <div className='loader'></div> : (
        <Card
          color={isInvitation ? 'orange' : 'black'}
          opacity={removeLoading || notChosen ? '0.8' : '1'}
        >
          {removeLoading && elementRemoveLoading}
          <Content color={isInvitation ? 'orange' : 'black'}>
            <div className='m-auto'>
              <Avatar
                alt={username}
                src={avatar || "/static/images/avatar/1.jpg"}
                sx={{ width: 80, height: 80, margin: '0 auto 10px' }}
              />
              <Typography variant="h5" sx={{color: "white"}}>
                {username}
              </Typography>
              <Typography sx={{ mb: 1.5, color: 'rgba(255, 255, 255, 0.7)'}}>
                {gender === 'Male' && <MaleIcon/>}
                {gender === 'Female' && <FemaleIcon/>}
                {gender !== 'Male' && gender !== 'Female' && gender}
              </Typography>
              <Typography variant="body2" sx={{color: 'white'}}>
                Win rate: {winRate || '0/0'}
              </Typography>
              
              {isInvitation ? (
                <Box className="jusity-content-center">
                  <Button
                    size="small"
                    variant='contained'
                    color="success"
                    onClick={()=> onAgreeInvitation()}
                    disabled={notChosen}
                  >
                    {agreeLoading ? <CircularProgress size={20} color='inherit'/> : 'Agree'}
                  </Button>
                  <Button
                    size="small"
                    variant='outlined'
                    color="success"
                    className="d-inline-block ms-1"
                    onClick={()=> onDisagreeInvitation()}
                    disabled={notChosen || agreeLoading}
                  >Disagree</Button>
                </Box>
              ) : (
                <Button
                  size="small"
                  variant='contained'
                  color="info"
                  className="d-inline-block mx-auto mt-2"
                  onClick={()=> onChoosePlayer()}
                  disabled={removeLoading}
                >Choose</Button>
              )}
            </div>
          </Content>
        </Card>
      )}
    </Grid>
  );
};

export default React.memo(GameCaroOpponent);