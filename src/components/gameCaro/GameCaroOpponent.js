import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  Button,
  Typography,
  Avatar,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';

import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';

import { socket } from 'src/App';
import { AuthContext } from 'src/contexts/AuthContextProvider';
import { invitationAction } from 'src/reducers/invitation/invitationSlice';
import {Card, Content} from './styles/GameCaroOpponentStyle'

import { Loader } from './styles/LoadingStyle';

// let i = 1
const GameCaroOpponent = props => {
  const {
    username,
    avatar,
    gender,
    winRate,
    socketId,
    isFighting,

    addLoading : addLoadingFromRedux,
    removeLoading,

    isInvitation,
    notChosen,
    agreeLoading,
  } = props
  // console.log(`Render GameCaroOpponent ${i++}: ${username}`);

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
      {addLoading ? <Loader color={isInvitation ? 'orange' : 'blue'}/> : (
        <Card
          color={isInvitation ? 'orange' : 'black'}
          opacity={removeLoading || notChosen ? '0.8' : '1'}
        >
          {removeLoading && (
            <div className='w-100 h-100 position-absolute' style={{zIndex: '1'}}>
              <Loader color={isInvitation ? 'orange' : 'blue'}/>
            </div>
          )}
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
              
              {isInvitation && !isFighting && (
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
              )}

              {!isInvitation && !isFighting && (
                <Button
                  size="small"
                  variant='contained'
                  color="info"
                  className="d-inline-block mx-auto mt-2"
                  onClick={()=> onChoosePlayer()}
                  disabled={removeLoading}
                >Choose</Button>
              )}

              {isFighting && (
                <Typography variant="h6" sx={{color: 'red'}}>
                  Fighting <LocalFireDepartmentIcon/>
                </Typography>
              )}
            </div>
          </Content>
        </Card>
      )}
    </Grid>
  );
};

export default React.memo(GameCaroOpponent)